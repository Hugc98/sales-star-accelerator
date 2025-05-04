
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, RefreshCw, Smartphone, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/lib/auth";
import { Progress } from "@/components/ui/progress";

// URL do servidor WhatsApp
const WHATSAPP_SERVER_URL = "http://localhost:3001"; // Altere para a URL de produção quando estiver pronto

const WhatsAppIntegration = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [connectionInfo, setConnectionInfo] = useState({ 
    phoneNumber: '', 
    connectionTime: '' 
  });
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Inicializar Socket.IO e verificar status da conexão ao montar o componente
  useEffect(() => {
    if (!user?.id) return;

    // Inicializar Socket.IO
    const socketInstance = io(WHATSAPP_SERVER_URL);
    setSocket(socketInstance);

    // Entrar na sala do usuário
    socketInstance.emit('join', user.id);

    // Configurar listeners do Socket.IO
    socketInstance.on('whatsapp:qr', ({ qrCode }) => {
      setQrCodeUrl(qrCode);
      setLoading(false);
    });

    socketInstance.on('whatsapp:ready', (data) => {
      setConnected(true);
      setQrCodeUrl(null);
      setLoading(false);
      setConnectionInfo({
        phoneNumber: data.phoneNumber,
        connectionTime: new Date(data.connectionTime).toLocaleString('pt-BR')
      });
      toast({
        title: "WhatsApp conectado",
        description: `Seu número ${data.phoneNumber} foi conectado com sucesso.`,
      });
    });

    socketInstance.on('whatsapp:authenticated', () => {
      toast({
        title: "WhatsApp autenticado",
        description: "Aguarde enquanto finalizamos a conexão...",
      });
    });

    socketInstance.on('whatsapp:auth_failure', ({ message }) => {
      setError(`Falha na autenticação: ${message}`);
      setLoading(false);
      toast({
        title: "Erro de autenticação",
        description: "Não foi possível autenticar com o WhatsApp. Tente novamente.",
        variant: "destructive"
      });
    });

    socketInstance.on('whatsapp:disconnected', ({ reason }) => {
      setConnected(false);
      setQrCodeUrl(null);
      setError(null);
      toast({
        title: "WhatsApp desconectado",
        description: reason || "A conexão com WhatsApp foi encerrada.",
      });
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Erro ao conectar com o Socket.IO:', err);
      setError('Não foi possível conectar ao servidor WhatsApp. Verifique se o servidor está em execução.');
    });

    // Verificar status atual da conexão
    checkConnectionStatus(user.id);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.id, toast]);

  // Função para verificar o status atual da conexão
  const checkConnectionStatus = async (userId: string) => {
    try {
      setCheckingStatus(true);
      const response = await fetch(`${WHATSAPP_SERVER_URL}/api/whatsapp/status/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'connected') {
          setConnected(true);
          setConnectionInfo({
            phoneNumber: data.phoneNumber,
            connectionTime: data.connectionTime ? new Date(data.connectionTime).toLocaleString('pt-BR') : 'Informação não disponível'
          });
        } else if (data.status === 'qr_ready' && data.qrCode) {
          setQrCodeUrl(data.qrCode);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  // Função para inicializar o cliente WhatsApp e gerar QR Code
  const generateQrCode = async () => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para conectar o WhatsApp.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
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

      // Solicitar QR code via Socket.IO, caso não chegue automaticamente
      if (socket) {
        socket.emit('whatsapp:requestQR', user.id);
      }
      
      // O QR code será recebido via evento WebSocket
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
      setError('Não foi possível gerar o QR Code. Verifique se o servidor WhatsApp está em execução.');
      setLoading(false);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o QR Code. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Função para desconectar
  const handleDisconnect = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`${WHATSAPP_SERVER_URL}/api/whatsapp/disconnect/${user.id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Não foi possível desconectar o WhatsApp');
      }

      setConnected(false);
      setQrCodeUrl(null);
      setError(null);
      toast({
        title: "WhatsApp desconectado",
        description: "Sua conta do WhatsApp foi desconectada.",
      });
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível desconectar. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Quando estiver verificando o status inicial
  if (checkingStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conectar WhatsApp</CardTitle>
          <CardDescription>
            Verificando status da conexão...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Progress value={80} className="w-3/4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conectar WhatsApp</CardTitle>
        <CardDescription>
          Integre seu WhatsApp para enviar e receber mensagens diretamente pelo sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-md flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {connected ? (
          <div className="flex flex-col items-center p-6 border rounded-md bg-muted/30">
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">WhatsApp Conectado</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Smartphone className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-center mb-2">
              <p className="font-medium">{connectionInfo.phoneNumber}</p>
              <p className="text-sm text-muted-foreground">Conexão realizada em {connectionInfo.connectionTime}</p>
            </div>
          </div>
        ) : qrCodeUrl ? (
          <div className="flex flex-col items-center p-6 border rounded-md">
            <h3 className="text-lg font-medium mb-4">Escaneie o QR Code</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Abra o WhatsApp no seu celular, toque em Menu ou Configurações e selecione WhatsApp Web
            </p>
            <div className="bg-white p-3 rounded-md mb-4">
              <img 
                src={qrCodeUrl} 
                alt="QR Code WhatsApp" 
                className="w-64 h-64"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              O QR code expira após 60 segundos
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center p-6 border rounded-md">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">WhatsApp não conectado</span>
            </div>
            <p className="text-center text-sm mb-4">
              Para usar o WhatsApp no sistema, você precisa conectar seu número de telefone escaneando um QR Code.
            </p>
            <Button 
              onClick={generateQrCode} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Gerando QR Code...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4" />
                  Gerar QR Code
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {connected && "Funcionalidade ativa: envio e recebimento de mensagens"}
        </div>
        {connected && (
          <Button variant="outline" onClick={handleDisconnect}>
            Desconectar WhatsApp
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WhatsAppIntegration;
