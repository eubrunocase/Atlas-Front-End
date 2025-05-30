import React from 'react';
import LoginForm from "@/components/LoginForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

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
        
        <LoginForm />
        
        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} Atlas - Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default Login;
