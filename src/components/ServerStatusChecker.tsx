
import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface ServerStatusCheckerProps {
  serverUrl: string;
}

const ServerStatusChecker: React.FC<ServerStatusCheckerProps> = ({ serverUrl }) => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        // Usamos o axios diretamente para evitar interceptores
        await axios({
          method: 'get',
          url: `${serverUrl}`,
          timeout: 5000, // 5 segundos
        });
        setStatus('online');
      } catch (error) {
        console.error('Erro ao verificar status do servidor:', error);
        setStatus('offline');
        
        if (error instanceof Error) {
          if (error.message.includes('CORS')) {
            setMessage('Erro de CORS: O servidor está rodando, mas não permite requisições deste domínio.');
          } else if (error.message.includes('timeout')) {
            setMessage('Timeout: O servidor não está respondendo ou está muito lento.');
          } else if (error.message.includes('Network Error')) {
            setMessage('Erro de rede: Não foi possível conectar ao servidor. Verifique se ele está ligado.');
          } else {
            setMessage(`Erro: ${error.message}`);
          }
        } else {
          setMessage('Erro desconhecido ao conectar com o servidor');
        }
      }
    };

    checkServerStatus();
  }, [serverUrl]);

  if (status === 'checking') {
    return (
      <Alert className="bg-gray-100 border-gray-200">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Verificando servidor</AlertTitle>
        <AlertDescription>
          Estamos verificando se o servidor está disponível...
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'online') {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-600">Servidor online</AlertTitle>
        <AlertDescription>
          O servidor está respondendo normalmente.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-amber-50 border-amber-200">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-600">Servidor offline</AlertTitle>
      <AlertDescription>
        {message || 'Não foi possível conectar ao servidor. Verifique se ele está em execução.'}
      </AlertDescription>
    </Alert>
  );
};

export default ServerStatusChecker;
