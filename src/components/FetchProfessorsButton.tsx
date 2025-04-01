
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProfessors } from "@/hooks/useProfessors";
import { toast } from "sonner";

const FetchProfessorsButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { professors, refetch } = useProfessors();

  const handleFetchProfessors = async () => {
    setIsLoading(true);
    try {
      await refetch();
      toast.success(`${professors.length} professores carregados com sucesso!`);
      console.log("Professores carregados:", professors);
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
      toast.error("Erro ao buscar professores. Verifique o console para mais detalhes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleFetchProfessors}
      disabled={isLoading}
      className="bg-blue-600 hover:bg-blue-700"
    >
      {isLoading ? "Carregando..." : "Buscar Professores"}
    </Button>
  );
};

export default FetchProfessorsButton;
