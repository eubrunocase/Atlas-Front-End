
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { projectService, Project, ProjectStatus } from "@/services/project.service";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const statusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.AGUARDANDO_ANALISE_PRELIMINAR]: "Aguardando Análise Preliminar",
  [ProjectStatus.EM_ANALISE]: "Em Análise",
  [ProjectStatus.PROJETO_RECUSADO]: "Recusado",
  [ProjectStatus.EM_ANDAMENTO]: "Em Andamento",
  [ProjectStatus.FINALIZADO]: "Finalizado",
};

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.AGUARDANDO_ANALISE_PRELIMINAR:
      return "bg-yellow-100 text-yellow-800";
    case ProjectStatus.EM_ANALISE:
      return "bg-blue-100 text-blue-800";
    case ProjectStatus.PROJETO_RECUSADO:
      return "bg-red-100 text-red-800";
    case ProjectStatus.EM_ANDAMENTO:
      return "bg-purple-100 text-purple-800";
    case ProjectStatus.FINALIZADO:
      return "bg-green-100 text-green-800";
  }
};

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isAdmin = authService.isAdmin();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ProjectStatus | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectService.getById(Number(id));
        setProject(data);
        setStatus(data.status);
      } catch (error) {
        console.error("Erro ao buscar projeto:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do projeto.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, toast]);

  const handleUpdateStatus = async () => {
    if (!project || !status) return;
    
    try {
      const updatedProject = await projectService.update(project.id!, {
        ...project,
        status,
      });
      
      setProject(updatedProject);
      toast({
        title: "Status atualizado",
        description: `O status do projeto foi alterado para ${statusLabels[status]}.`,
      });
      setOpenConfirm(false);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do projeto.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmReceived = async () => {
    if (!project) return;
    
    try {
      // Apenas confirma recebimento se estiver finalizado
      if (project.status === ProjectStatus.FINALIZADO) {
        toast({
          title: "Recebimento confirmado",
          description: "Obrigado por confirmar o recebimento do projeto.",
        });
      }
    } catch (error) {
      console.error("Erro ao confirmar recebimento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível confirmar o recebimento.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Carregando...</div>;
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Erro ao carregar projeto</AlertTitle>
          <AlertDescription>Projeto não encontrado.</AlertDescription>
        </Alert>
        <Button
          className="mt-4"
          onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/professor/dashboard")}
        >
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/professor/dashboard")}
      >
        Voltar
      </Button>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{project.name}</CardTitle>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {statusLabels[project.status]}
          </span>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Objetivo</h3>
              <p className="mt-1">{project.objetivo}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Data de Início</h3>
              <p className="mt-1">{new Date(project.dataInicio).toLocaleDateString()}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Escopo</h3>
              <p className="mt-1">{project.escopo}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Público-Alvo</h3>
              <p className="mt-1">{project.publicoAlvo}</p>
            </div>
            
            {isAdmin && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Atualizar Status</h3>
                <div className="flex items-center gap-4">
                  <Select
                    value={status || undefined}
                    onValueChange={(value) => setStatus(value as ProjectStatus)}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ProjectStatus).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {statusLabels[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                    <DialogTrigger asChild>
                      <Button 
                        disabled={status === project.status}
                      >
                        Atualizar Status
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar alteração de status</DialogTitle>
                        <DialogDescription>
                          Você está alterando o status do projeto de "{statusLabels[project.status]}" para "{status ? statusLabels[status] : ''}".
                          Esta ação notificará o professor solicitante.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenConfirm(false)}>Cancelar</Button>
                        <Button onClick={handleUpdateStatus}>Confirmar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
            
            {!isAdmin && project.status === ProjectStatus.FINALIZADO && (
              <div className="pt-4 border-t">
                <Button onClick={handleConfirmReceived}>
                  Confirmar Recebimento do Projeto
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetails;
