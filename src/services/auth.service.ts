
import api from './api';
import { toast } from 'sonner';

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

// Funções de autenticação
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Verificar se a resposta contém token e role
      if (response.data && response.data.token) {
        // Salvar token no localStorage
        localStorage.setItem('atlas_token', response.data.token);
        localStorage.setItem('atlas_role', response.data.role);
        return response.data;
      } else {
        throw new Error('Resposta de autenticação inválida');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      throw error;
    }
  },

  async registerProfessor(data: RegisterProfessorData): Promise<void> {
    try {
      await api.post('/auth/register/professor', data);
    } catch (error) {
      console.error('Erro ao registrar professor:', error);
      throw error;
    }
  },

  async registerAdmin(data: RegisterAdminData): Promise<void> {
    try {
      await api.post('/auth/register/adm', data);
    } catch (error) {
      console.error('Erro ao registrar administrador:', error);
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('atlas_token');
    localStorage.removeItem('atlas_role');
    toast.success('Logout realizado com sucesso');
    window.location.href = '/';
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('atlas_token');
  },

  getRole(): string | null {
    return localStorage.getItem('atlas_role');
  },

  isAdmin(): boolean {
    return this.getRole() === 'ADMINISTRADOR';
  },
  
  isProfessor(): boolean {
    return this.getRole() === 'PROFESSOR';
  },
  
  getUserInfo(): { authenticated: boolean, role: string | null } {
    return {
      authenticated: this.isAuthenticated(),
      role: this.getRole()
    };
  }
};
