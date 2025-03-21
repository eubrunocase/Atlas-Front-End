
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { authService, RegisterProfessorData } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, ArrowLeft } from "lucide-react";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<RegisterProfessorData>({
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterProfessorData) => {
    try {
      await authService.registerProfessor(data);
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Você pode fazer login agora.",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast({
        title: "Erro ao realizar cadastro",
        description: "Não foi possível completar o cadastro.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full">
        <Button 
          variant="ghost" 
          className="mb-4 p-0 flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
        </Button>
      
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Atlas</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestão da Fábrica de Software</p>
        </div>
        
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-center">Cadastro de Professor</CardTitle>
            <CardDescription className="text-center">
              Crie sua conta para solicitar projetos na Fábrica de Software
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="login"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Login</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            placeholder="Digite seu login" 
                            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            type="password" 
                            placeholder="Digite sua senha" 
                            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Criar Conta
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">Já possui uma conta?</p>
              <Button 
                variant="link" 
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Entrar no sistema
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} Atlas - Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default Register;
