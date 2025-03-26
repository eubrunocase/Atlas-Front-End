
import React from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { LoginCredentials, authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<LoginCredentials>({
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      const response = await authService.login(data);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo ao sistema Atlas!`,
      });
      
      // Redireciona baseado no papel do usuário
      if (authService.isAdmin()) {
        navigate("/admin/dashboard");
      } else {
        navigate("/professor/dashboard");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro ao realizar login",
        description: "Credenciais inválidas ou servidor indisponível.",
        variant: "destructive",
      });
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
            <Button type="submit" className="w-full">Entrar</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
