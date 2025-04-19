import api from './api';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';
import { userService } from './user.service';

// Tipos para autenticação
export interface LoginCredentials {
  login: string;
  password: string;
}

export interface RegisterProfessorData {
  login: string;
  password: string;
  escola: string;
}

export interface RegisterAdminData {
  login: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role?: string;
}

interface JwtPayload {
  exp: number;
  role?: string;
}

const TOKEN_KEY = 'atlas_token';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    try {
      const response = await api.post('/auth/login', credentials);
      const token = response.data?.token;
      console.log(response)

      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        return response.data as AuthResponse;
      } else {
        throw new Error('Resposta de autenticação inválida.');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      toast.error(error?.response?.data?.message || 'Falha ao fazer login.');
      return null;
    }
  },

  async registerProfessor(data: RegisterProfessorData): Promise<void> {
    try {
      await api.post('/auth/register/professor', data);
      toast.success('Professor registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar professor:', error);
      toast.error(error?.response?.data?.message || 'Erro ao registrar professor.');
      throw error;
    }
  },

  async registerAdmin(data: RegisterAdminData): Promise<void> {
    try {
      await api.post('/auth/register/adm', data);
      toast.success('Administrador registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar administrador:', error);
      toast.error(error?.response?.data?.message || 'Erro ao registrar administrador.');
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
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

  async getRole(): Promise<string | null> {
    const user = await userService.getUser();
    return user.role;
  },

  async isAdmin(): Promise<boolean> {
    return this.isAuthenticated() && await this.getRole() === 'ADMINISTRADOR';
  },

  async isProfessor(): Promise<boolean> {
    return this.isAuthenticated() && await this.getRole() === 'PROFESSOR';
  },

  getUserInfo(): { authenticated: boolean; role: string | null } {
    return {
      authenticated: this.isAuthenticated(),
      role: this.getRole(),
    };
  },
};
