import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { projectService, Project, ProjectStatus } from "@/services/project.service";
import { professorService, Professor } from "@/services/professor.service";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfessorModal from "@/components/EditProfessorModal";
import EditProjectModal from "@/components/EditProjectModal";
import { Plus, LogOut } from "lucide-react";
import NewAdminModal from "@/components/NewAdminModal";

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditProfessorModalOpen, setIsEditProfessorModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isNewAdminModalOpen, setIsNewAdminModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await projectService.getAll();
      setProjects(projectsData);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessors = async () => {
    try {
      setLoading(true);
      const professorsData = await professorService.getAll();
      setProfessors(professorsData);
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os professores.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "projects") {
      fetchProjects();
    } else if (activeTab === "professors") {
      fetchProfessors();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleUpdateProject = (projectId: number) => {
    navigate(`/admin/project/${projectId}`);
  };

  const handleAddProfessor = () => {
    navigate("/admin/new-professor");
  };

  const handleEditProfessor = (professor: Professor) => {
    setSelectedProfessor(professor);
    setIsEditProfessorModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchProfessors();
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditProjectModalOpen(true);
  };

  const handleProjectEditSuccess = () => {
    fetchProjects();
  };

  const getStatusLabel = (status: ProjectStatus) => {
    const labels = {
      [ProjectStatus.AGUARDANDO_ANALISE_PRELIMINAR]: "Aguardando Análise Preliminar",
      [ProjectStatus.EM_ANALISE]: "Em Análise",
      [ProjectStatus.PROJETO_RECUSADO]: "Recusado",
      [ProjectStatus.EM_ANDAMENTO]: "Em Andamento",
      [ProjectStatus.FINALIZADO]: "Finalizado",
    };
    return labels[status];
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-gray-600">Fábrica de Software - Gestão de Projetos</p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => setIsNewAdminModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Administrador
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="professors">Professores</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Projetos</CardTitle>
              <Button onClick={() => navigate('/admin/new-project')}>Novo Projeto</Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando projetos...</div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum projeto cadastrado.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{project.name}</h3>
                          <p className="text-sm text-gray-500">
                            Início: {new Date(project.dataInicio).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm">{project.objetivo}</p>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditProject(project)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={async () => {
                            try {
                              await projectService.delete(project.id!);
                              setProjects(projects.filter(p => p.id !== project.id));
                              toast({
                                title: "Sucesso",
                                description: "Projeto excluído com sucesso",
                              });
                            } catch (error) {
                              toast({
                                title: "Erro",
                                description: "Não foi possível excluir o projeto",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professors">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Professores</CardTitle>
              <Button onClick={handleAddProfessor}>Cadastrar Professor</Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando professores...</div>
              ) : professors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum professor cadastrado.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {professors.map((professor) => (
                    <div key={professor.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium">{professor.login}</h3>
                          <p className="text-sm text-gray-500">{professor.escola}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProfessor(professor)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                              try {
                                await professorService.delete(professor.id!);
                                setProfessors(professors.filter((p) => p.id !== professor.id));
                                toast({
                                  title: "Sucesso",
                                  description: "Professor excluído com sucesso",
                                });
                              } catch (error) {
                                toast({
                                  title: "Erro",
                                  description: "Não foi possível excluir o professor",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedProfessor && (
        <EditProfessorModal
          isOpen={isEditProfessorModalOpen}
          onClose={() => {
            setIsEditProfessorModalOpen(false);
            setSelectedProfessor(null);
          }}
          professor={selectedProfessor}
          onSuccess={handleEditSuccess}
        />
      )}

      {selectedProject && (
        <EditProjectModal
          isOpen={isEditProjectModalOpen}
          onClose={() => {
            setIsEditProjectModalOpen(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
          onSuccess={handleProjectEditSuccess}
        />
      )}

      <NewAdminModal
        isOpen={isNewAdminModalOpen}
        onClose={() => setIsNewAdminModalOpen(false)}
        onSuccess={() => {
          // Aqui você pode adicionar lógica para atualizar a lista de administradores se necessário
        }}
      />
    </div>
  );
};

export default AdminDashboard;
