import { Project, ProjectStatus } from "@/services/project.service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

const statusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.AGUARDANDO_ANALISE_PRELIMINAR]: "Aguardando Análise",
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

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const ProjectDetailsModal = ({ isOpen, onClose, project }: ProjectDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{project.name}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {statusLabels[project.status]}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="pt-6 space-y-6">
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
          </CardContent>
        </Card>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal; 