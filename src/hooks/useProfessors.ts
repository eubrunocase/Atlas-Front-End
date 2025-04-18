import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Professor, professorService } from "@/services/professor.service";
import { toast } from "sonner";

export function useProfessors() {
  const queryClient = useQueryClient();

  // Consulta para obter todos os professores
  const { 
    data: professors = [], 
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ["professors"],
    queryFn: professorService.getAll,
    enabled: false, // Desabilita a execução automática
  });

  // Mutação para criar um novo professor
  const createProfessorMutation = useMutation({
    mutationFn: (professor: Professor) => professorService.create(professor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professors"] });
      toast.success("Professor criado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao criar professor:", error);
      toast.error("Falha ao criar professor");
    },
  });

  // Mutação para atualizar um professor
  const updateProfessorMutation = useMutation({
    mutationFn: ({ id, professor }: { id: number, professor: Professor }) => 
      professorService.update(id, professor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professors"] });
      toast.success("Professor atualizado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao atualizar professor:", error);
      toast.error("Falha ao atualizar professor");
    },
  });

  // Mutação para excluir um professor
  const deleteProfessorMutation = useMutation({
    mutationFn: (id: number) => professorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professors"] });
      toast.success("Professor excluído com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao excluir professor:", error);
      toast.error("Falha ao excluir professor");
    },
  });

  return {
    professors,
    isLoading,
    error,
    refetch,
    createProfessor: createProfessorMutation.mutate,
    updateProfessor: updateProfessorMutation.mutate,
    deleteProfessor: deleteProfessorMutation.mutate,
    isCreating: createProfessorMutation.isPending,
    isUpdating: updateProfessorMutation.isPending,
    isDeleting: deleteProfessorMutation.isPending,
  };
}

export function useProfessor(id: number) {
  // Consulta para obter um professor específico
  const { 
    data: professor, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ["professor", id],
    queryFn: () => professorService.getById(id),
    enabled: !!id, // Só executa se o ID for válido
  });

  return {
    professor,
    isLoading,
    error,
  };
}
