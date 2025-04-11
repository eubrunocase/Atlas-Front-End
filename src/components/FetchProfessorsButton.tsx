
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProfessors } from "@/hooks/useProfessors";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FetchProfessorsButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const { professors, refetch } = useProfessors();
  const navigate = useNavigate();

  const handleFetchProfessors = async () => {
    setIsLoading(true);
    setShowAuthAlert(false);
    
    try {
      console.log("Iniciando busca de professores...");
      
      // Verificar autenticação antes de fazer a requisição
      if (!authService.isAuthenticated()) {
        console.log("Usuário não autenticado");
        setShowAuthAlert(true);
        toast.error("Você precisa estar logado para acessar esta lista");
        return;
      }
      
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
        setShowAuthAlert(true);
      } else if (error?.response?.status === 401) {
        toast.error("Autenticação necessária. Por favor, faça login para acessar.");
        setShowAuthAlert(true);
        // Redirecionando para login se não estiver autenticado
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (error.message && (error.message.includes("Network Error") || error.message.includes("Failed to fetch"))) {
        toast.error("Erro de conexão com o servidor. Verifique se o backend está em execução na porta 8080.");
      } else {
        toast.error(`Erro ao buscar professores: ${error.message || 'Erro desconhecido'}. Verifique o console para mais detalhes.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {showAuthAlert && (
        <Alert variant="destructive" className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Erro de autorização</AlertTitle>
          <AlertDescription>
            Você não tem permissão para acessar este recurso. Verifique se está logado 
            com as credenciais corretas e se tem as permissões necessárias.
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={handleFetchProfessors}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? "Carregando..." : "Buscar Professores"}
      </Button>
    </div>
  );
};

export default FetchProfessorsButton;
