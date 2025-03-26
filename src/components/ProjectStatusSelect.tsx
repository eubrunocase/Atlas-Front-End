
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectStatus, projectService } from '@/services/project.service';

interface ProjectStatusSelectProps {
  value: ProjectStatus;
  onChange: (value: ProjectStatus) => void;
  disabled?: boolean;
}

const ProjectStatusSelect: React.FC<ProjectStatusSelectProps> = ({ value, onChange, disabled = false }) => {
  const handleValueChange = (newValue: string) => {
    onChange(newValue as ProjectStatus);
  };

  return (
    <Select 
      value={value} 
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione o status" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(ProjectStatus).map((status) => (
          <SelectItem key={status} value={status}>
            {projectService.getStatusLabel(status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProjectStatusSelect;
