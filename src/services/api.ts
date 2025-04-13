
import axios from 'axios';
import { toast } from 'sonner';

// Base URL para o proxy configurado no Vite
const BASE_URL = '/api';

// Instância do axios com configuração base e CORS
const api = axios.create({
  baseURL: BASE_URL,
  // Configurando headers para CORS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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
      method: config.method,
      baseURL: config.baseURL,
      data: config.data
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
    
    // Verificando se há uma mensagem específica no erro que indica usuário com papel nulo
    const errorMessage = error?.response?.data?.message || '';
    const errorStack = error?.stack || '';
    
    // Verificação mais abrangente para identificar problemas com papel de usuário
    if (
      errorMessage.includes('NullPointerException') || 
      errorStack.includes('NullPointerException') || 
      (error.message && error.message.includes('role')) ||
      // Nova verificação para casos específicos do erro reportado
      (errorStack.includes('Users.getAuthorities') && errorStack.includes('null'))
    ) {
      console.error('Erro de papel do usuário nulo detectado:', error);
      
      // Limpar autenticação para forçar novo login
      localStorage.removeItem('atlas_token');
      localStorage.removeItem('atlas_role');
      
      toast.error('O usuário não tem um papel (role) definido no sistema ou o papel está incorreto. Entre em contato com o administrador.');
    
      
      return Promise.reject(error);
    }
    
    if (error.response) {
      // O servidor respondeu com um status de erro
      const status = error.response.status;
      
      if (status === 401) {
        // Token expirado ou inválido
        console.log('Erro 401 - Não autorizado');
        localStorage.removeItem('atlas_token');
        localStorage.removeItem('atlas_role');
        toast.error('Sessão expirada ou credenciais inválidas. Por favor, faça login novamente.');
        
        // Redirecionar apenas se não estivermos já na página de login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      } else if (status === 403) {
        console.log('Erro 403 - Acesso negado');
        
        // Verificar a role do usuário
        const userRole = localStorage.getItem('atlas_role');
        console.log(`Role do usuário atual: ${userRole}`);
        
        // Mensagem específica para erro de acesso negado
        if (userRole) {
          toast.error(`Acesso negado. Seu papel atual (${userRole}) não tem permissão para acessar este recurso.`);
        } else {
          toast.error('Acesso negado. Você não tem permissão para acessar este recurso. Verifique se você está logado com as credenciais corretas.');
          
          // Se não tiver token, redirecionar para login
          if (!localStorage.getItem('atlas_token')) {
            setTimeout(() => {
          
            }, 2000);
          }
        }
      } else if (status === 404) {
        toast.error('Recurso não encontrado no servidor.');
      } else if (status === 400) {
        const serverErrorMessage = error.response.data?.message || 'Dados inválidos fornecidos.';
        toast.error(serverErrorMessage);
      } else if (status === 500) {
        toast.error(`Erro interno do servidor. Detalhes: ${error.response.data?.message || 'Ocorreu um erro no servidor.'}`);
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
        toast.error('Erro de rede: Não foi possível conectar ao servidor. Verifique se o backend está em execução na porta 8080.');
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

export const configureApiBaseUrl = (newBaseUrl: string) => {
  api.defaults.baseURL = newBaseUrl;
  console.log(`URL da API alterada para: ${newBaseUrl}`);
};

export default api;
