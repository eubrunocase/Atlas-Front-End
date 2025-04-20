import { useForm } from "react-hook-form";
import { Professor, professorService } from "@/services/professor.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface EditProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  professor: Professor;
  onSuccess: () => void;
}

const EditProfessorModal = ({ isOpen, onClose, professor, onSuccess }: EditProfessorModalProps) => {
  const { toast } = useToast();
  
  const form = useForm<Professor>({
    defaultValues: {
      login: professor.login,
      password: "",
      escola: professor.escola,
    },
  });

  const onSubmit = async (data: Professor) => {
    try {
      await professorService.update(professor.id!, data);
      
      toast({
        title: "Professor atualizado com sucesso",
        description: "As alterações foram salvas.",
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar professor:", error);
      toast({
        title: "Erro ao atualizar professor",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Professor</DialogTitle>
        </DialogHeader>
        
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
                    <Input type="password" placeholder="Deixe em branco para manter a senha atual" {...field} />
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

export default EditProfessorModal; 