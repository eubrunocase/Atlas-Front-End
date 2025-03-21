
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { authService, RegisterProfessorData } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Atlas</h1>
          <p className="text-gray-600">Cadastro de Professor</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Cadastro</CardTitle>
            <CardDescription>
              Crie sua conta de professor para solicitar projetos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="login"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu login" {...field} />
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
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Sua senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Cadastrar</Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center">
              <Button variant="link" onClick={() => navigate("/login")}>
                Já tem uma conta? Faça login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
