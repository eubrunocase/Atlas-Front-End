
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ProjectStatus, projectService } from '@/services/project.service';

interface StatusBadgeProps {
  status: ProjectStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getVariant = (status: ProjectStatus): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case ProjectStatus.AGUARDANDO_ANALISE_PRELIMINAR:
        return "secondary";
      case ProjectStatus.EM_ANALISE:
        return "default";
      case ProjectStatus.PROJETO_RECUSADO:
        return "destructive";
      case ProjectStatus.EM_ANDAMENTO:
        return "outline";
      case ProjectStatus.FINALIZADO:
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Badge variant={getVariant(status)}>
      {projectService.getStatusLabel(status)}
    </Badge>
  );
};

export default StatusBadge;
