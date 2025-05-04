
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
import { QrCode, RefreshCw, Smartphone, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WhatsAppIntegration = () => {
  const { toast } = useToast();
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState({ 
    phoneNumber: '', 
    connectionTime: '' 
  });

  useEffect(() => {
    // Ao montar o componente, verificar status da conexão
    checkConnectionStatus();
  }, []);

  // Função para verificar o status atual da conexão
  const checkConnectionStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp', {
        body: { action: 'checkStatus' }
      });

      if (error) throw new Error(error.message);
      
      if (data.status === 'connected') {
        setConnected(true);
        setConnectionInfo({
          phoneNumber: data.phoneNumber,
          connectionTime: new Date(data.connectionTime).toLocaleString('pt-BR')
        });
        setQrCodeVisible(false);
      } else {
        setConnected(false);
        setQrCodeVisible(false);
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      setConnected(false);
      setQrCodeVisible(false);
    }
  };

  // Função para gerar QR Code
  const generateQrCode = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp', {
        body: { action: 'getQRCode' }
      });

      if (error) throw new Error(error.message);
      
      setQrCodeVisible(true);
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o QR Code. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Função simulada para conectar o WhatsApp 
  // (em uma implementação real, isso seria feito pela edge function)
  const simulateConnection = () => {
    toast({
      title: "WhatsApp conectado",
      description: "Seu número +55 11 98765-4321 foi conectado com sucesso.",
    });
    setQrCodeVisible(false);
    setConnected(true);
    setConnectionInfo({
      phoneNumber: '+55 11 98765-4321',
      connectionTime: new Date().toLocaleString('pt-BR')
    });
  };

  // Função para desconectar
  const handleDisconnect = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp', {
        body: { action: 'disconnect' }
      });

      if (error) throw new Error(error.message);
      
      setConnected(false);
      setQrCodeVisible(false);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conectar WhatsApp</CardTitle>
        <CardDescription>
          Integre seu WhatsApp para enviar e receber mensagens diretamente pelo sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
        ) : qrCodeVisible ? (
          <div className="flex flex-col items-center p-6 border rounded-md">
            <h3 className="text-lg font-medium mb-4">Escaneie o QR Code</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Abra o WhatsApp no seu celular, toque em Menu ou Configurações e selecione WhatsApp Web
            </p>
            <div className="bg-white p-3 rounded-md mb-4">
              {/* QR Code (simulação para o MVP) */}
              <div 
                className="w-64 h-64 flex items-center justify-center cursor-pointer"
                onClick={simulateConnection}
              >
                <img 
                  src="data:image/png;base64,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" 
                  alt="QR Code WhatsApp" 
                  className="w-full h-full"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Clique no QR Code para simular a conexão (somente para testes)
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
