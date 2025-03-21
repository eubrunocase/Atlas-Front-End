
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-[40%] right-[10%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[15%] left-[35%] w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="container mx-auto py-6 px-4">
          <nav className="flex justify-end">
            <a 
              href="https://ucsal.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center"
            >
              Sobre a UCSAL <ArrowRight className="ml-1 h-3 w-3" />
            </a>
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
                <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Já possui cadastro?</h3>
                <p className="text-gray-600 mb-4">
                  Acesse o sistema para visualizar seus projetos e acompanhar o andamento de suas solicitações.
                </p>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-6 group"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> 
                  Entrar no Sistema
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 text-green-600 rounded-full p-2 mt-1 flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Fácil de usar</h4>
                  <p className="text-sm text-gray-600">Interface intuitiva para professores e administradores</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 text-green-600 rounded-full p-2 mt-1 flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Monitoramento</h4>
                  <p className="text-sm text-gray-600">Acompanhe o progresso dos projetos em tempo real</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 text-green-600 rounded-full p-2 mt-1 flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Integração</h4>
                  <p className="text-sm text-gray-600">Conectado com os repositórios Git da UCSAL</p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        
        <footer className="relative z-10 bg-white/30 backdrop-blur-sm py-8 border-t border-gray-100">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-600">
                  Um projeto da Fábrica de Software da UCSAL
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  © {new Date().getFullYear()} Atlas - Todos os direitos reservados
                </p>
              </div>
              
              <div className="flex space-x-6">
                <a href="#acessibilidade" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Acessibilidade
                </a>
                <a href="#termos" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Termos de Uso
                </a>
                <a href="#privacidade" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Privacidade
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
