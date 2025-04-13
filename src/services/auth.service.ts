import api from './api';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

// Tipos para autenticação
export interface LoginCredentials {
  login: string;
  password: string;
}

export interface RegisterProfessorData {
  login: string;
  password: string;
}

export interface RegisterAdminData {
  login: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: string;
}

interface JwtPayload {
  exp: number;
  role?: string;
}

const TOKEN_KEY = 'atlas_token';
const ROLE_KEY = 'atlas_role';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);

      if (response.data?.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(ROLE_KEY, response.data.role);
        toast.success('Login realizado com sucesso!');
        return response.data;
      } else {
        throw new Error('Resposta de autenticação inválida.');
      }
    } catch (error: any) {
      console.error('Erro ao realizar login:', error);
      toast.error(error?.response?.data?.message || 'Falha ao fazer login.');
      throw error;
    }
  },

  async registerProfessor(data: RegisterProfessorData): Promise<void> {
    try {
      await api.post('/auth/register/professor', data);
      toast.success('Professor registrado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao registrar professor:', error);
      toast.error(error?.response?.data?.message || 'Erro ao registrar professor.');
      throw error;
    }
  },

  async registerAdmin(data: RegisterAdminData): Promise<void> {
    try {
      await api.post('/auth/register/adm', data);
      toast.success('Administrador registrado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao registrar administrador:', error);
      toast.error(error?.response?.data?.message || 'Erro ao registrar administrador.');
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    toast.success('Logout realizado com sucesso!');
    window.location.href = '/login';
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (err) {
      console.warn('Token inválido ou malformado:', err);
      return false;
    }
  },

  getRole(): string | null {
    return localStorage.getItem(ROLE_KEY);
  },

  isAdmin(): boolean {
    return this.isAuthenticated() && this.getRole() === 'ROLE_ADMINISTRADOR';
  },

  isProfessor(): boolean {
    return this.isAuthenticated() && this.getRole() === 'ROLE_PROFESSOR';
  },

  getUserInfo(): { authenticated: boolean; role: string | null } {
    return {
      authenticated: this.isAuthenticated(),
      role: this.getRole(),
    };
  },
};
