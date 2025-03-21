import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { projectService, Project, ProjectStatus } from "@/services/project.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

const ProfessorDashboard = () => {
  const { toast: hookToast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getAll();
        
        const projectsData = Array.isArray(data) 
          ? data 
          : (data && typeof data === 'object' && Array.isArray(data.data)) 
            ? data.data 
            : [];
            
        setProjects(projectsData);
        
        console.log("Projects API response:", data);
        console.log("Parsed projects data:", projectsData);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        toast.error("Erro", {
          description: "Não foi possível carregar os projetos."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const handleCreateProject = () => {
    navigate("/professor/new-project");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Painel do Professor</h1>
          <p className="text-gray-600">Gerencie seus projetos na Fábrica de Software</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleCreateProject}>Novo Projeto</Button>
          <Button variant="outline" onClick={handleLogout}>Sair</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando projetos...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Você ainda não possui projetos.</p>
              <Button onClick={handleCreateProject} className="mt-4">Solicitar Novo Projeto</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project) => (
                <div key={project.id || Math.random()} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-500">
                        Início: {new Date(project.dataInicio).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {statusLabels[project.status]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{project.objetivo}</p>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/professor/project/${project.id}`)}>
                      Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorDashboard;
