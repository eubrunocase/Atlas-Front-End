import React, { useState } from 'react';
import LoginForm from "@/components/LoginForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ServerStatusChecker from "@/components/ServerStatusChecker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const navigate = useNavigate();
  const [shouldCheckServer, setShouldCheckServer] = useState(false);

  const handleCheckServer = () => {
    setShouldCheckServer(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full">
        <Button 
          variant="ghost" 
          className="mb-4 p-0 flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Atlas</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestão da Fábrica de Software</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Status do Servidor</CardTitle>
            <CardDescription>
              Verifique se o servidor backend está disponível
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ServerStatusChecker 
                serverUrl={import.meta.env.VITE_API_URL} 
                shouldCheck={shouldCheckServer} 
              />
              <Button 
                variant="outline" 
                onClick={handleCheckServer}
                className="w-full"
              >
                Verificar Status do Servidor
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <LoginForm />
        
        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} Atlas - Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default Login;
