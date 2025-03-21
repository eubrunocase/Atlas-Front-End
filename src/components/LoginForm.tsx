
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { LoginCredentials, authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const LoginForm = () => {
  const { toast: hookToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginCredentials>({
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      
      // Mensagem de sucesso
      toast.success("Login realizado com sucesso", {
        description: "Bem-vindo ao sistema Atlas!",
      });
      
      // Pequeno atraso para mostrar a mensagem antes do redirecionamento
      setTimeout(() => {
        // Redireciona baseado no papel do usuário
        if (authService.isAdmin()) {
          navigate("/admin/dashboard");
        } else {
          navigate("/professor/dashboard");
        }
      }, 800);
      
    } catch (error: any) {
      console.error("Erro no login:", error);
      
      // Mensagem mais específica com base no erro
      let errorMessage = "Credenciais inválidas ou servidor indisponível.";
      
      if (error.response && error.response.status === 401) {
        errorMessage = "Usuário ou senha incorretos.";
      } else if (!error.response) {
        errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão.";
      }
      
      toast.error("Erro ao realizar login", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Acesse o sistema Atlas - Fábrica de Software
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
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
