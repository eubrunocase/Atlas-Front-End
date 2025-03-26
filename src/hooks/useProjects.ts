
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project, projectService } from "@/services/project.service";
import { toast } from "sonner";

export function useProjects() {
  const queryClient = useQueryClient();

  // Consulta para obter todos os projetos
  const { 
    data: projects = [], 
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getAll,
  });

  // Mutação para criar um novo projeto
  const createProjectMutation = useMutation({
    mutationFn: (project: Project) => projectService.create(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto criado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao criar projeto:", error);
      toast.error("Falha ao criar projeto");
    },
  });

  // Mutação para atualizar um projeto
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, project }: { id: number, project: Project }) => 
      projectService.update(id, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto atualizado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao atualizar projeto:", error);
      toast.error("Falha ao atualizar projeto");
    },
  });

  // Mutação para excluir um projeto
  const deleteProjectMutation = useMutation({
    mutationFn: (id: number) => projectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto excluído com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao excluir projeto:", error);
      toast.error("Falha ao excluir projeto");
    },
  });

  return {
    projects,
    isLoading,
    error,
    refetch,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
  };
}

export function useProject(id: number) {
  // Consulta para obter um projeto específico
  const { 
    data: project, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectService.getById(id),
    enabled: !!id, // Só executa se o ID for válido
  });

  return {
    project,
    isLoading,
    error,
  };
}
