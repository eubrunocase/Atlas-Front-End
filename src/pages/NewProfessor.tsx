
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { authService, RegisterProfessorData } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NewProfessor = () => {
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
        title: "Professor cadastrado com sucesso",
        description: "O professor pode agora fazer login no sistema.",
      });
      
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erro ao cadastrar professor:", error);
      toast({
        title: "Erro ao cadastrar professor",
        description: "Não foi possível completar o cadastro.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate("/admin/dashboard")}
      >
        Voltar
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Novo Professor</CardTitle>
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
                      <Input placeholder="Login do professor" {...field} />
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
                      <Input type="password" placeholder="Senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit">Cadastrar Professor</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProfessor;
