
import axios from 'axios';
import { toast } from 'sonner';

// Base URL do backend - pode ser configurada de acordo com o ambiente
const BASE_URL = '/atlas'; // Usando caminho relativo para utilizar o proxy

// Instância do axios com configuração base e CORS
const api = axios.create({
  baseURL: BASE_URL,
  // Configurando headers para CORS
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Importante para autenticação com cookies
});

// Interceptor para incluir o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('atlas_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debug
    console.log(`Enviando requisição para: ${config.url}`, {
      headers: config.headers,
      method: config.method
    });
    
    return config;
  },
  (error) => {
    console.error('Erro na configuração da requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => {
    console.log(`Resposta recebida de ${response.config.url}:`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', error);
    
    if (error.response) {
      // O servidor respondeu com um status de erro
      const status = error.response.status;
      
      if (status === 401) {
        // Token expirado ou inválido
        console.log('Erro 401 - Não autorizado');
        localStorage.removeItem('atlas_token');
        localStorage.removeItem('atlas_role');
        toast.error('Sessão expirada. Por favor, faça login novamente.');
        
        // Redirecionar apenas se não estivermos já na página de login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      } else if (status === 403) {
        console.log('Erro 403 - Acesso negado');
        toast.error('Acesso negado. Você não tem permissão para acessar este recurso.');
      } else if (status === 404) {
        toast.error('Recurso não encontrado no servidor.');
      } else if (status === 400) {
        const errorMessage = error.response.data?.message || 'Dados inválidos fornecidos.';
        toast.error(errorMessage);
      } else {
        // Erro genérico
        toast.error(`Erro ${status}: ${error.response.data?.message || 'Ocorreu um erro no servidor.'}`);
      }
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('Erro de conexão:', error);
      if (error.message && error.message.includes('CORS')) {
        toast.error('Erro de CORS: Verifique se o servidor está configurado para aceitar requisições deste domínio.');
      } else if (error.message && error.message.includes('Network Error')) {
        toast.error('Erro de rede: Não foi possível conectar ao servidor. Verifique se o backend está em execução.');
      } else {
        toast.error('Não foi possível conectar ao servidor. Verifique sua conexão de rede.');
      }
    } else {
      // Erro na configuração da requisição
      toast.error(`Erro na requisição: ${error.message}`);
    }
    
    return Promise.reject(error);
  }
);

// Função para alterar a URL base da API
export const configureApiBaseUrl = (newBaseUrl: string) => {
  api.defaults.baseURL = newBaseUrl;
  console.log(`URL da API alterada para: ${newBaseUrl}`);
};

export default api;
