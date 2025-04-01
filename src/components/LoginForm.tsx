
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { LoginCredentials, authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CorsErrorHelper from "./CorsErrorHelper";

const loginSchema = z.object({
  login: z.string().min(1, "Login é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [corsError, setCorsError] = useState(false);
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setCorsError(false);
    try {
      // Cast the data to LoginCredentials since we've ensured both fields will be present
      // due to the zod validation
      const credentials: LoginCredentials = {
        login: data.login,
        password: data.password
      };
      
      const response = await authService.login(credentials);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo ao sistema plmds me salva!`,
      });
      
      // Redireciona baseado no papel do usuário
      if (authService.isAdmin()) {
        navigate("/admin/dashboard");
      } else {
        navigate("/professor/dashboard");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      
      // Verificar se é erro de CORS
      if (error instanceof Error && 
         (error.message.includes('CORS') || 
          error.message.includes('Network Error') ||
          error.toString().includes('Network Error'))) {
        setCorsError(true);
      }
      
      toast({
        title: "Erro ao realizar login",
        description: "Credenciais inválidas ou servidor indisponível.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-[400px] mx-auto">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Acesse o sistema plmds me salva - Fábrica de Software
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              
              <div className="text-center mt-4">
                <Button 
                  variant="link" 
                  className="p-0 text-sm text-gray-600"
                  onClick={() => navigate("/register")}
                  type="button"
                >
                  Não possui conta? Cadastre-se
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {corsError && <CorsErrorHelper />}
    </>
  );
};

export default LoginForm;
