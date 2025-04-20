
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { authService } from "@/services/auth.service";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NewProject from "./pages/NewProject";
import NewProfessor from "./pages/NewProfessor";
import ProjectDetails from "./pages/ProjectDetails";

const queryClient = new QueryClient();

// Componentes de proteção de rota
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated() || !authService.isAdmin()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const ProfessorRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas protegidas para professores */}
          <Route
            path="/professor/dashboard"
            element={
              <ProfessorRoute>
                <ProfessorDashboard />
              </ProfessorRoute>
            }
          />
          <Route
            path="/professor/new-project"
            element={
              <ProfessorRoute>
                <NewProject />
              </ProfessorRoute>
            }
          />
          <Route
            path="/professor/project/:id"
            element={
              <ProfessorRoute>
                <ProjectDetails />
              </ProfessorRoute>
            }
          />

          {/* Rotas protegidas para administradores */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/new-project"
            element={
              <AdminRoute>
                <NewProject />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/new-professor"
            element={
              <AdminRoute>
                <NewProfessor />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/project/:id"
            element={
              <AdminRoute>
                <ProjectDetails />
              </AdminRoute>
            }
          />

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
