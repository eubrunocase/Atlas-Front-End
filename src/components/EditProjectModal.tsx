import { useForm } from "react-hook-form";
import { Project, projectService, ProjectStatus } from "@/services/project.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSuccess: () => void;
}

const EditProjectModal = ({ isOpen, onClose, project, onSuccess }: EditProjectModalProps) => {
  const { toast } = useToast();
  
  const form = useForm<Project>({
    defaultValues: {
      name: project.name,
      objetivo: project.objetivo,
      dataInicio: project.dataInicio,
      escopo: project.escopo,
      publicoAlvo: project.publicoAlvo,
      status: project.status,
    },
  });

  const onSubmit = async (data: Project) => {
    try {
      if (!project.id) {
        throw new Error("ID do projeto não encontrado");
      }
      
      await projectService.update(project.id, {
        ...data,
        id: project.id
      });
      
      toast({
        title: "Projeto atualizado com sucesso",
        description: "As alterações foram salvas.",
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      toast({
        title: "Erro ao atualizar projeto",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Projeto</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do projeto" {...field} />
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
              name="escopo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escopo</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o escopo do projeto" 
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
                    <Input placeholder="Público-alvo do projeto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ProjectStatus.AGUARDANDO_ANALISE_PRELIMINAR}>Aguardando Análise</SelectItem>
                      <SelectItem value={ProjectStatus.EM_ANALISE}>Em Análise</SelectItem>
                      <SelectItem value={ProjectStatus.PROJETO_RECUSADO}>Recusado</SelectItem>
                      <SelectItem value={ProjectStatus.EM_ANDAMENTO}>Em Andamento</SelectItem>
                      <SelectItem value={ProjectStatus.FINALIZADO}>Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectModal; 