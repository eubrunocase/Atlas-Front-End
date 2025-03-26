
import api from './api';

// Interface para administrador
export interface Admin {
  id?: number;
  login: string;
  password?: string; // opcional para atualizações
}

// Função auxiliar para verificar e transformar a resposta da API
const ensureArray = (data: any): any[] => {
  if (Array.isArray(data)) {
    return data;
  } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
    return data.data;
  } else if (data && typeof data === 'object') {
    return [data];
  }
  return [];
};

// Serviço de administradores
export const adminService = {
  async getAll(): Promise<Admin[]> {
    try {
      const response = await api.get('/adm');
      return ensureArray(response.data);
    } catch (error) {
      console.error('Erro ao buscar administradores:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Admin> {
    try {
      const response = await api.get(`/adm/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar administrador ${id}:`, error);
      throw error;
    }
  },

  async create(admin: Admin): Promise<Admin> {
    try {
      const response = await api.post('/adm', admin);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar administrador:', error);
      throw error;
    }
  },

  async update(id: number, admin: Admin): Promise<Admin> {
    try {
      const response = await api.put(`/adm/${id}`, admin);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar administrador ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/adm/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir administrador ${id}:`, error);
      throw error;
    }
  }
};
