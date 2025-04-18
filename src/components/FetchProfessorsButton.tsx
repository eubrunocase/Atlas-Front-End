import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useProfessors } from "@/hooks/useProfessors";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FetchProfessorsButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { professors, refetch } = useProfessors();
  const navigate = useNavigate();
  const isAdmin = authService.isAdmin();

  useEffect(() => {
    const checkUserRole = () => {
      const token = localStorage.getItem('atlas_token');
      const userRole = localStorage.getItem('atlas_role');
      
      if (!token) {
        setShowAuthAlert(true);
        setErrorMessage("Você precisa estar logado para acessar esta lista. Por favor, faça login primeiro.");
      } 
      else if (!authService.isAdmin()) {
        setShowAuthAlert(true);
        setErrorMessage(`Você está logado com o papel ${userRole}, mas este recurso requer o papel ADMINISTRADOR. Por favor, faça login com uma conta de administrador.`);
      } else {
        setShowAuthAlert(false);
        setErrorMessage("");
      }
    };
    
    checkUserRole();
  }, []);

  const handleFetchProfessors = async () => {
    setIsLoading(true);
    
    try {
      if (!authService.isAuthenticated()) {
        setShowAuthAlert(true);
        setErrorMessage("Você precisa estar logado para acessar esta lista. Por favor, faça login primeiro.");
        toast.error("Você precisa estar logado para acessar esta lista");
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      
      if (!authService.isAdmin()) {
        const userRole = localStorage.getItem('atlas_role');
        setShowAuthAlert(true);
        setErrorMessage(`Você está logado com o papel ${userRole}, mas este recurso requer o papel ADMINISTRADOR. Por favor, faça login com uma conta de administrador.`);
        toast.error("Acesso negado. Você precisa ser um administrador.");
        return;
      }
      
      const result = await refetch();
      
      if (result.data && result.data.length > 0) {
        toast.success(`${result.data.length} professores carregados com sucesso!`);
      } else {
        toast.success("Lista de professores carregada (vazia ou não disponível)");
      }
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
      
      if (error?.response?.status === 403) {
        const userRole = localStorage.getItem('atlas_role');
        const errorMsg = `Acesso negado. Seu papel atual (${userRole || 'desconhecido'}) não tem permissão para acessar esta lista. Você precisa ser um administrador.`;
        toast.error(errorMsg);
        setShowAuthAlert(true);
        setErrorMessage(errorMsg);
      } else if (error?.response?.status === 401) {
        const errorMsg = "Autenticação necessária. Por favor, faça login novamente para acessar.";
        toast.error(errorMsg);
        setShowAuthAlert(true);
        setErrorMessage(errorMsg);
        
        authService.logout();
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (error.message && (error.message.includes("Network Error") || error.message.includes("Failed to fetch") || error.message.includes("CORS"))) {
        const errorMsg = "Erro de conexão com o servidor. Verifique se o backend está em execução na porta 8080 e se está permitindo acesso CORS da sua origem.";
        toast.error(errorMsg);
        setShowAuthAlert(true);
        setErrorMessage(errorMsg);
      } else {
        const errorMsg = `Erro ao buscar professores: ${error.message || 'Erro desconhecido'}. Verifique o console para mais detalhes.`;
        toast.error(errorMsg);
        setShowAuthAlert(true);
        setErrorMessage(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {showAuthAlert && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro de autorização</AlertTitle>
          <AlertDescription>
            {errorMessage || "Você não tem permissão para acessar este recurso. Verifique se está logado com as credenciais corretas e se tem as permissões necessárias."}
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={handleFetchProfessors}
        disabled={isLoading || !isAdmin}
        className={`${isAdmin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        {isLoading ? "Carregando..." : "Buscar Professores"}
      </Button>
      
      {!isAdmin && !showAuthAlert && (
        <Alert variant="destructive" className="mt-2">
          <Info className="h-4 w-4" />
          <AlertTitle>Acesso restrito</AlertTitle>
          <AlertDescription>
            Esta funcionalidade está disponível apenas para administradores.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FetchProfessorsButton;
