
import api from './api';

// Interface para professor
export interface Professor {
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

// Serviço de professores
export const professorService = {
  async getAll(): Promise<Professor[]> {
    try {
      const response = await api.get('/professor');
      return ensureArray(response.data);
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Professor> {
    try {
      const response = await api.get(`/professor/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar professor ${id}:`, error);
      throw error;
    }
  },

  async create(professor: Professor): Promise<Professor> {
    try {
      const response = await api.post('/professor', professor);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar professor:', error);
      throw error;
    }
  },

  async update(id: number, professor: Professor): Promise<Professor> {
    try {
      const response = await api.put(`/professor/${id}`, professor);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar professor ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/professor/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir professor ${id}:`, error);
      throw error;
    }
  },

  async deleteAll(): Promise<void> {
    try {
      await api.delete('/professor');
    } catch (error) {
      console.error('Erro ao excluir todos os professores:', error);
      throw error;
    }
  }
};
