
import axios from 'axios';

// Base URL do backend - ajuste conforme a sua configuração
const BASE_URL = 'http://localhost:8080/atlas';

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

export default api;
