
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Se já estiver autenticado, redireciona para o dashboard apropriado
    if (authService.isAuthenticated()) {
      if (authService.isAdmin()) {
        navigate("/admin/dashboard");
      } else {
        navigate("/professor/dashboard");
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Atlas</h1>
        <p className="text-xl text-gray-600 mb-8">Sistema de Gestão da Fábrica de Software</p>
        
        <Button
          size="lg"
          className="w-full mb-4"
          onClick={() => navigate("/login")}
        >
          Entrar
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => navigate("/register")}
        >
          Cadastrar como Professor
        </Button>
      </div>
    </div>
  );
};

export default Index;
