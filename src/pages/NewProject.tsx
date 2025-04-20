import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { projectService, Project, ProjectStatus } from "@/services/project.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { useEffect, useState } from "react";

const NewProject = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"admin" | "professor">("professor");
  
  useEffect(() => {
    const checkUserType = async () => {
      const isAdmin = await authService.isAdmin();
      setUserType(isAdmin ? "admin" : "professor");
    };
    checkUserType();
  }, []);
  
  const form = useForm<Omit<Project, 'status'>>({
    defaultValues: {
      name: "",
      objetivo: "",
      dataInicio: new Date().toISOString().split('T')[0],
      escopo: "",
      publicoAlvo: "",
    },
  });

  const onSubmit = async (data: Omit<Project, 'status'>) => {
    try {
      // Para novos projetos, sempre começamos com status "aguardando análise"
      const projectData: Project = {
        ...data,
        status: ProjectStatus.AGUARDANDO_ANALISE_PRELIMINAR,
      };
      
      await projectService.create(projectData);
      
      toast({
        title: "Projeto criado com sucesso",
        description: "Seu projeto foi enviado para análise.",
      });
      
      // Redireciona para o dashboard apropriado
      navigate(`/${userType}/dashboard`);
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      toast({
        title: "Erro ao criar projeto",
        description: "Não foi possível enviar sua solicitação.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate(`/${userType}/dashboard`)}
      >
        Voltar
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Solicitar Novo Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Projeto</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do projeto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="objetivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o objetivo do projeto" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início Desejada</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="escopo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escopo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Defina o escopo do projeto" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="publicoAlvo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Público-Alvo</FormLabel>
                    <FormControl>
                      <Input placeholder="Quem é o público-alvo do projeto?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit">Solicitar Projeto</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProject;
