
import React, { useState } from "react";
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

const WhatsAppIntegration = () => {
  const { toast } = useToast();
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Função simulada para gerar um QR Code (em produção seria chamada da API)
  const generateQrCode = () => {
    setLoading(true);
    setTimeout(() => {
      setQrCodeVisible(true);
      setLoading(false);
    }, 1500);
  };

  // Função simulada para conectar o WhatsApp (em produção seria via websocket)
  const simulateConnection = () => {
    toast({
      title: "WhatsApp conectado",
      description: "Seu número +55 11 98765-4321 foi conectado com sucesso.",
    });
    setQrCodeVisible(false);
    setConnected(true);
  };

  // Função para desconectar
  const handleDisconnect = () => {
    setConnected(false);
    toast({
      title: "WhatsApp desconectado",
      description: "Sua conta do WhatsApp foi desconectada.",
    });
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
              <p className="font-medium">+55 11 98765-4321</p>
              <p className="text-sm text-muted-foreground">Conexão realizada em 23/04/2025 às 15:42</p>
            </div>
          </div>
        ) : qrCodeVisible ? (
          <div className="flex flex-col items-center p-6 border rounded-md">
            <h3 className="text-lg font-medium mb-4">Escaneie o QR Code</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Abra o WhatsApp no seu celular, toque em Menu ou Configurações e selecione WhatsApp Web
            </p>
            <div className="bg-white p-3 rounded-md mb-4">
              {/* Placeholder para o QR Code */}
              <div 
                className="w-64 h-64 bg-gray-100 flex items-center justify-center cursor-pointer"
                onClick={simulateConnection}
              >
                <QrCode className="w-32 h-32 text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Clique no QR Code para simular a conexão
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
