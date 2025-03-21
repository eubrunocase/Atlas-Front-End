
import axios from 'axios';
import { toast } from "sonner";

// URL do backend
// No ambiente de desenvolvimento, use localhost
// Em produção, use a URL do servidor de produção
const BASE_URL = 'https://id-preview--8c3b8630-204d-4b5f-975a-62d75ffbc6ef.lovable.app/api/atlas';

// Instância do axios com configuração base
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para incluir o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('atlas_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Erro na resposta da API:', error);
    
    // Mensagem de erro amigável com base no tipo de erro
    let errorMessage = 'Ocorreu um erro ao conectar com o servidor.';
    
    if (error.response) {
      // Resposta do servidor com código de erro
      if (error.response.status === 401) {
        errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
        // Limpar dados de autenticação e redirecionar para login
        localStorage.removeItem('atlas_token');
        localStorage.removeItem('atlas_role');
        window.location.href = '/login';
      } else if (error.response.status === 403) {
        errorMessage = 'Acesso negado. Você não tem permissão para esta ação.';
      } else if (error.response.status === 404) {
        errorMessage = 'O recurso solicitado não foi encontrado.';
      } else if (error.response.status >= 500) {
        errorMessage = 'Erro no servidor. Por favor, tente novamente mais tarde.';
      }
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
    }

    // Mostrar notificação de erro
    toast.error(errorMessage);
    
    return Promise.reject(error);
  }
);

export default api;
