import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, ArrowRight, Code, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      <header className="container mx-auto py-6 px-4">
        <nav className="flex justify-between items-center">
          <div>
            <a 
              href="https://ucsal.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center"
            >
              Sobre a UCSAL <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </nav>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
              Atlas
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
              Sistema de Gestão da <span className="font-semibold">Fábrica de Software</span>
            </p>
          </motion.div>
          
          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-16"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              variants={item}
            >
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Professores</h3>
              <p className="text-gray-600 mb-4">
                Solicite projetos para a Fábrica de Software e acompanhe todo o processo de desenvolvimento.
              </p>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-6 group"
                onClick={() => navigate("/register")}
              >
                <UserPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> 
                Cadastrar como Professor
              </Button>
            </motion.div>
            
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              variants={item}
            >
              <div className="bg-purple-100 text-purple-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Já tem uma conta?</h3>
              <p className="text-gray-600 mb-4">
                Faça login para acessar seu painel e gerenciar seus projetos.
              </p>
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-6 group"
                onClick={() => navigate("/login")}
              >
                <LogIn className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Fazer Login
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
