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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

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
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isNullRoleError, setIsNullRoleError] = useState(false);
  
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
    setLoginError(null);
    setIsNullRoleError(false);
    
    try {
      const credentials: LoginCredentials = {
        login: data.login,
        password: data.password
      };
      
      console.log("Tentando login com credenciais:", {
        login: credentials.login,
        password: "********"
      });
      
      const response = await authService.login(credentials);
      
      if (!response.role) {
        setIsNullRoleError(true);
        setLoginError("O usuário não tem um papel (role) definido no sistema. Entre em contato com o administrador.");
        console.error("Login realizado mas papel (role) é nulo", response);
        return;
      }
      
      console.log("Login bem-sucedido. Papel recebido:", response.role);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo ao sistema! Você está logado como ${response.role}.`,
      });
      
      if (authService.isAdmin()) {
        navigate("/admin/dashboard");
      } else {
        navigate("/professor/dashboard");
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      
      if (
        (error?.message && error.message.includes('NullPointerException') && error.message.includes('role')) ||
        (error?.stack && error.stack.includes('Users.getAuthorities') && error.stack.includes('null'))
      ) {
        setIsNullRoleError(true);
        setLoginError("Erro no cadastro do usuário: O papel (role) do usuário não está definido. Entre em contato com o administrador.");
      } else if (error?.response?.status === 401) {
        setLoginError("Credenciais inválidas. Verifique seu login e senha.");
      } else if (error?.response?.status === 403) {
        setLoginError("Acesso negado. Você não tem permissão para acessar o sistema.");
      } else if (error?.message?.includes('NetworkError') || error?.message?.includes('Network Error')) {
        setCorsError(true);
        setLoginError("Erro de conexão com o servidor. Verifique se o backend está rodando.");
      } else {
        if (error instanceof Error && 
           (error.message.includes('CORS') || 
            error.message.includes('Network Error') ||
            error.toString().includes('Network Error'))) {
          setCorsError(true);
          setLoginError("Erro de CORS: O servidor não está aceitando requisições deste domínio.");
        } else {
          setLoginError("Ocorreu um erro no login. Tente novamente mais tarde.");
        }
      }
      
      toast({
        title: "Erro ao realizar login",
        description: "Verifique as credenciais ou se o servidor está disponível.",
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
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro de autenticação</AlertTitle>
              <AlertDescription>
                {loginError}
              </AlertDescription>
            </Alert>
          )}
          
          {isNullRoleError && (
            <Alert variant="destructive" className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Problema com papel do usuário</AlertTitle>
              <AlertDescription>
                Seu usuário não tem um papel (role) configurado no sistema. 
                Este é um problema no banco de dados que precisa ser corrigido por um administrador. 
                Por favor, entre em contato com o suporte técnico.
              </AlertDescription>
            </Alert>
          )}
          
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
