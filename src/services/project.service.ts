
import api from './api';

// Enum para status de projeto
export enum ProjectStatus {
  AGUARDANDO_ANALISE_PRELIMINAR = "AGUARDANDO_ANALISE_PRELIMINAR",
  EM_ANALISE = "EM_ANALISE",
  PROJETO_RECUSADO = "PROJETO_RECUSADO",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  FINALIZADO = "FINALIZADO"
}

// Interface para projeto
export interface Project {
  id?: number;
  name: string;
  objetivo: string;
  dataInicio: string; // formato ISO
  escopo: string;
  publicoAlvo: string;
  status: ProjectStatus;
}

// Serviço de projetos
export const projectService = {
  async getAll(): Promise<Project[]> {
    try {
      const response = await api.get('/project');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Project> {
    try {
      const response = await api.get(`/project/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar projeto ${id}:`, error);
      throw error;
    }
  },

  async create(project: Project): Promise<Project> {
    try {
      const response = await api.post('/project', project);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }
  },

  async update(id: number, project: Project): Promise<Project> {
    try {
      const response = await api.put(`/project/${id}`, project);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar projeto ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/project/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir projeto ${id}:`, error);
      throw error;
    }
  }
};
