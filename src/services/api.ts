
import axios from 'axios';
import { toast } from 'sonner';

// URL do backend - altere para o endereço IP ou domínio do servidor onde o backend está rodando
// Por exemplo: 'http://192.168.1.100:8080/atlas' ou 'http://meuservidor.com/atlas'
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/atlas';

// Instância do axios com configuração base
const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor para incluir o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('atlas_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      const status = error.response.status;
      
      if (status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('atlas_token');
        localStorage.removeItem('atlas_role');
        toast.error('Sessão expirada. Por favor, faça login novamente.');
        window.location.href = '/login';
      } else if (status === 403) {
        toast.error('Você não tem permissão para acessar este recurso.');
      } else if (status === 404) {
        toast.error('Recurso não encontrado.');
      } else if (status === 400) {
        const errorMessage = error.response.data?.message || 'Dados inválidos.';
        toast.error(errorMessage);
      } else {
        // Erro genérico
        toast.error('Ocorreu um erro no servidor. Tente novamente mais tarde.');
      }
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      toast.error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } else {
      // Erro na configuração da requisição
      toast.error('Ocorreu um erro ao processar sua solicitação.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
