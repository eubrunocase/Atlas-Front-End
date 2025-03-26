
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Admin, adminService } from "@/services/admin.service";
import { toast } from "sonner";

export function useAdmins() {
  const queryClient = useQueryClient();

  // Consulta para obter todos os administradores
  const { 
    data: admins = [], 
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ["admins"],
    queryFn: adminService.getAll,
  });

  // Mutação para criar um novo administrador
  const createAdminMutation = useMutation({
    mutationFn: (admin: Admin) => adminService.create(admin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Administrador criado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao criar administrador:", error);
      toast.error("Falha ao criar administrador");
    },
  });

  // Mutação para atualizar um administrador
  const updateAdminMutation = useMutation({
    mutationFn: ({ id, admin }: { id: number, admin: Admin }) => 
      adminService.update(id, admin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Administrador atualizado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao atualizar administrador:", error);
      toast.error("Falha ao atualizar administrador");
    },
  });

  // Mutação para excluir um administrador
  const deleteAdminMutation = useMutation({
    mutationFn: (id: number) => adminService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Administrador excluído com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao excluir administrador:", error);
      toast.error("Falha ao excluir administrador");
    },
  });

  return {
    admins,
    isLoading,
    error,
    refetch,
    createAdmin: createAdminMutation.mutate,
    updateAdmin: updateAdminMutation.mutate,
    deleteAdmin: deleteAdminMutation.mutate,
    isCreating: createAdminMutation.isPending,
    isUpdating: updateAdminMutation.isPending,
    isDeleting: deleteAdminMutation.isPending,
  };
}

export function useAdmin(id: number) {
  // Consulta para obter um administrador específico
  const { 
    data: admin, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ["admin", id],
    queryFn: () => adminService.getById(id),
    enabled: !!id, // Só executa se o ID for válido
  });

  return {
    admin,
    isLoading,
    error,
  };
}
