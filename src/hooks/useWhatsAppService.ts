
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

// URL do servidor WhatsApp
const WHATSAPP_SERVER_URL = "http://localhost:3001"; // Altere para a URL de produção quando estiver pronto

interface WhatsAppMessage {
  id: string;
  body: string;
  from: string;
  fromName: string;
  timestamp: number;
  hasMedia: boolean;
  isGroup: boolean;
  chat: {
    id: string;
    name: string;
  };
}

export const useWhatsAppService = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [connectionInfo, setConnectionInfo] = useState({
    phoneNumber: '',
    connectionTime: '',
    status: 'disconnected'
  });

  // Conectar ao Socket.IO
  useEffect(() => {
    if (!user?.id) return;

    const socketInstance = io(WHATSAPP_SERVER_URL);
    setSocket(socketInstance);

    // Entrar na sala do usuário
    socketInstance.emit('join', user.id);

    // Configurar listeners
    socketInstance.on('connect', () => {
      console.log('Conectado ao servidor WhatsApp via Socket.IO');
    });

    socketInstance.on('whatsapp:ready', (data) => {
      setIsConnected(true);
      setIsConnecting(false);
      setConnectionInfo({
        phoneNumber: data.phoneNumber,
        connectionTime: new Date(data.connectionTime).toLocaleString('pt-BR'),
        status: 'connected'
      });
    });

    socketInstance.on('whatsapp:message', (message: WhatsAppMessage) => {
      setMessages(prev => [message, ...prev]);
      
      // Notificar usuário sobre nova mensagem
      toast({
        title: `Nova mensagem de ${message.fromName}`,
        description: message.body.substring(0, 60) + (message.body.length > 60 ? '...' : ''),
      });
    });

    socketInstance.on('whatsapp:disconnected', () => {
      setIsConnected(false);
      setConnectionInfo(prev => ({...prev, status: 'disconnected'}));
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Erro ao conectar com o Socket.IO:', err);
      setIsConnecting(false);
      setIsConnected(false);
    });

    // Verificar status atual
    checkConnectionStatus(user.id);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.id, toast]);

  // Verificar status da conexão
  const checkConnectionStatus = async (userId: string) => {
    try {
      setIsConnecting(true);
      const response = await fetch(`${WHATSAPP_SERVER_URL}/api/whatsapp/status/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'connected') {
          setIsConnected(true);
          setConnectionInfo({
            phoneNumber: data.phoneNumber || '',
            connectionTime: data.connectionTime ? new Date(data.connectionTime).toLocaleString('pt-BR') : '',
            status: 'connected'
          });
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status do WhatsApp:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Enviar mensagem
  const sendMessage = async (to: string, message: string) => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    if (!isConnected) {
      throw new Error('WhatsApp não está conectado');
    }

    try {
      const response = await fetch(`${WHATSAPP_SERVER_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          to,
          message
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao enviar mensagem');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      throw error;
    }
  };

  // Inicializar conexão (usado principalmente pela página de integração)
  const initializeConnection = async () => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setIsConnecting(true);
      const response = await fetch(`${WHATSAPP_SERVER_URL}/api/whatsapp/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Não foi possível inicializar o cliente WhatsApp');
      }

      // O resto da conexão será gerenciado pelos eventos WebSocket
    } catch (error) {
      console.error('Erro ao inicializar conexão WhatsApp:', error);
      setIsConnecting(false);
      throw error;
    }
  };

  // Desconectar
  const disconnectWhatsApp = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`${WHATSAPP_SERVER_URL}/api/whatsapp/disconnect/${user.id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Não foi possível desconectar o WhatsApp');
      }

      setIsConnected(false);
      setConnectionInfo(prev => ({...prev, status: 'disconnected'}));
    } catch (error) {
      console.error('Erro ao desconectar WhatsApp:', error);
      throw error;
    }
  };

  return {
    isConnected,
    isConnecting,
    connectionInfo,
    messages,
    sendMessage,
    initializeConnection,
    disconnectWhatsApp,
  };
};
