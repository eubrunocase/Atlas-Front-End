
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, PlusCircle } from "lucide-react";
import { authService } from '@/services/auth.service';

interface NavigationHeaderProps {
  title: string;
  showNewProjectButton?: boolean;
  showNewProfessorButton?: boolean;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ 
  title, 
  showNewProjectButton = false,
  showNewProfessorButton = false
}) => {
  const navigate = useNavigate();
  const isAdmin = authService.isAdmin();
  
  const handleLogout = () => {
    authService.logout();
  };
  
  const handleNewProject = () => {
    if (isAdmin) {
      navigate('/admin/new-project');
    } else {
      navigate('/professor/new-project');
    }
  };
  
  const handleNewProfessor = () => {
    navigate('/admin/new-professor');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b">
      <h1 className="text-2xl font-bold mb-4 sm:mb-0">{title}</h1>
      
      <div className="flex flex-wrap gap-2">
        {showNewProjectButton && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleNewProject}
          >
            <PlusCircle className="h-4 w-4" />
            Novo Projeto
          </Button>
        )}
        
        {isAdmin && showNewProfessorButton && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleNewProfessor}
          >
            <User className="h-4 w-4" />
            Novo Professor
          </Button>
        )}
        
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default NavigationHeader;
