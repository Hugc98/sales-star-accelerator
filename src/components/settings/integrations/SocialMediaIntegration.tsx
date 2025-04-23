
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
import { Instagram, Facebook, Link, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface SocialAccount {
  id: string;
  type: "instagram" | "facebook";
  name: string;
  username: string;
  connected: boolean;
  features: {
    messages: boolean;
    comments: boolean;
  };
}

const initialAccounts: SocialAccount[] = [
  {
    id: "1",
    type: "instagram",
    name: "Minha Empresa",
    username: "@minhaempresa",
    connected: true,
    features: {
      messages: true,
      comments: false,
    },
  },
  {
    id: "2",
    type: "facebook",
    name: "Página Empresa",
    username: "Minha Empresa Oficial",
    connected: false,
    features: {
      messages: false,
      comments: false,
    },
  },
];

const SocialMediaIntegration = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<SocialAccount[]>(initialAccounts);
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setConnecting(id);
    setTimeout(() => {
      setAccounts(accounts.map(account => 
        account.id === id 
          ? { ...account, connected: true, features: { messages: true, comments: true } }
          : account
      ));
      setConnecting(null);
      toast({
        title: "Conta conectada",
        description: "A conta foi conectada com sucesso.",
      });
    }, 1500);
  };

  const handleDisconnect = (id: string) => {
    setAccounts(accounts.map(account => 
      account.id === id 
        ? { ...account, connected: false, features: { messages: false, comments: false } }
        : account
    ));
    toast({
      title: "Conta desconectada",
      description: "A conta foi desconectada com sucesso.",
    });
  };

  const toggleFeature = (id: string, feature: keyof SocialAccount["features"]) => {
    setAccounts(accounts.map(account => 
      account.id === id 
        ? { 
            ...account, 
            features: { 
              ...account.features, 
              [feature]: !account.features[feature] 
            } 
          }
        : account
    ));
    toast({
      title: "Configuração atualizada",
      description: `A configuração foi atualizada com sucesso.`,
    });
  };

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <Card key={account.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {account.type === "instagram" ? (
                  <Instagram className="h-5 w-5 text-purple-600" />
                ) : (
                  <Facebook className="h-5 w-5 text-blue-600" />
                )}
                <CardTitle>
                  {account.type === "instagram" ? "Instagram" : "Facebook"} - {account.name}
                </CardTitle>
              </div>
              {account.connected ? (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Conectado</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <XCircle className="h-4 w-4" />
                  <span>Desconectado</span>
                </div>
              )}
            </div>
            <CardDescription>
              {account.username} · {account.type === "instagram" ? "Perfil de negócios" : "Página comercial"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {account.connected ? (
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Mensagens Diretas</h4>
                    <p className="text-sm text-muted-foreground">
                      Receba e responda mensagens do {account.type === "instagram" ? "Instagram Direct" : "Messenger"}
                    </p>
                  </div>
                  <Switch 
                    checked={account.features.messages}
                    onCheckedChange={() => toggleFeature(account.id, "messages")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Comentários</h4>
                    <p className="text-sm text-muted-foreground">
                      Gerencie comentários de posts e anúncios
                    </p>
                  </div>
                  <Switch 
                    checked={account.features.comments}
                    onCheckedChange={() => toggleFeature(account.id, "comments")}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <Link className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-center mb-4">
                  Conecte sua conta para receber mensagens e gerenciar comentários
                </p>
                <Button 
                  onClick={() => handleConnect(account.id)}
                  disabled={connecting === account.id}
                  className="flex items-center gap-2"
                >
                  {connecting === account.id ? (
                    "Conectando..."
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4" />
                      Conectar Conta
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-end">
            {account.connected && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDisconnect(account.id)}
              >
                Desconectar
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" className="flex items-center gap-2">
          <Link className="h-4 w-4" />
          Adicionar outra conta
        </Button>
      </div>
    </div>
  );
};

export default SocialMediaIntegration;
