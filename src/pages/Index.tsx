
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">Atlas</h1>
          <p className="text-xl text-gray-700">Sistema de Gestão da Fábrica de Software</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <Button
            size="lg"
            className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={() => navigate("/login")}
          >
            <LogIn className="mr-2 h-5 w-5" /> Entrar no Sistema
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full py-6 border-2 border-blue-600 text-blue-700 hover:bg-blue-50 transition-all duration-200"
            onClick={() => navigate("/register")}
          >
            <UserPlus className="mr-2 h-5 w-5" /> Cadastrar como Professor
          </Button>
        </div>
        
        <div className="mt-16 flex flex-col gap-3">
          <p className="text-gray-600 text-sm">
            Um projeto da Fábrica de Software da UCSAL
          </p>
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Atlas - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
