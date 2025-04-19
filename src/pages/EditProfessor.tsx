import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Professor, professorService } from "@/services/professor.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

const EditProfessor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<Professor>({
    defaultValues: {
      login: "",
      password: "",
      escola: "",
    },
  });

  useEffect(() => {
    const fetchProfessor = async () => {
      if (!id) return;
      
      try {
        const professor = await professorService.getById(parseInt(id));
        form.reset({
          login: professor.login,
          escola: professor.escola,
          // Não preenchemos a senha por questões de segurança
        });
      } catch (error) {
        console.error("Erro ao carregar professor:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do professor.",
          variant: "destructive",
        });
        navigate("/admin/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessor();
  }, [id, form, toast, navigate]);

  const onSubmit = async (data: Professor) => {
    if (!id) return;
    
    try {
      await professorService.update(parseInt(id), data);
      
      toast({
        title: "Professor atualizado com sucesso",
        description: "As alterações foram salvas.",
      });
      
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erro ao atualizar professor:", error);
      toast({
        title: "Erro ao atualizar professor",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

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
          <CardTitle>Editar Professor</CardTitle>
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
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Deixe em branco para manter a senha atual" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="escola"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escola</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da escola" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfessor; 