
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProfessors } from "@/hooks/useProfessors";
import { toast } from "sonner";

const FetchProfessorsButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { professors, refetch } = useProfessors();

  const handleFetchProfessors = async () => {
    setIsLoading(true);
    try {
      console.log("Iniciando busca de professores...");
      
      const result = await refetch();
      console.log("Resultado da busca:", result);
      
      if (professors && professors.length > 0) {
        toast.success(`${professors.length} professores carregados com sucesso!`);
        console.log("Professores carregados:", professors);
      } else {
        toast.success("Lista de professores carregada (vazia ou não disponível)");
      }
    } catch (error: any) {
      console.error("Erro ao buscar professores:", error);
      
      // Verificando o tipo específico de erro para dar mensagens mais claras
      if (error?.response?.status === 403) {
        toast.error("Acesso negado. Você não tem permissão para acessar esta lista.");
      } else if (error?.response?.status === 401) {
        toast.error("Autenticação necessária. Por favor, faça login para acessar.");
        // Redirecionando para login se não estiver autenticado
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.message && (error.message.includes("Network Error") || error.message.includes("Failed to fetch"))) {
        toast.error("Erro de conexão com o servidor. Como o frontend e o backend estão na mesma porta (8080), verifique se há conflitos no uso da porta.");
      } else {
        toast.error(`Erro ao buscar professores: ${error.message || 'Erro desconhecido'}. Verifique o console para mais detalhes.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleFetchProfessors}
      disabled={isLoading}
      className="bg-blue-600 hover:bg-blue-700"
    >
      {isLoading ? "Carregando..." : "Buscar Professores"}
    </Button>
  );
};

export default FetchProfessorsButton;
