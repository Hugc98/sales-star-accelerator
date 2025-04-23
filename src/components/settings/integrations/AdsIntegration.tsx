
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
import { Facebook, Link, ExternalLink, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface AdsAccount {
  id: string;
  platform: "meta" | "google";
  name: string;
  status: "connected" | "disconnected";
  stats?: {
    campaigns: number;
    adSets: number;
    spending: string;
  };
}

const initialAccounts: AdsAccount[] = [
  {
    id: "meta1",
    platform: "meta",
    name: "Meta Ads Principal",
    status: "connected",
    stats: {
      campaigns: 3,
      adSets: 12,
      spending: "R$ 1.250,00"
    }
  },
  {
    id: "google1",
    platform: "google",
    name: "Google Ads",
    status: "disconnected",
  }
];

const AdsIntegration = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<AdsAccount[]>(initialAccounts);
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setConnecting(id);
    setTimeout(() => {
      setAccounts(accounts.map(account => 
        account.id === id 
          ? { 
              ...account, 
              status: "connected",
              stats: {
                campaigns: 2,
                adSets: 5,
                spending: "R$ 540,00"
              }
            }
          : account
      ));
      setConnecting(null);
      toast({
        title: "Conta conectada",
        description: "A conta de anúncios foi conectada com sucesso.",
      });
    }, 1500);
  };

  const handleDisconnect = (id: string) => {
    setAccounts(accounts.map(account => 
      account.id === id 
        ? { 
            ...account, 
            status: "disconnected",
            stats: undefined
          }
        : account
    ));
    toast({
      title: "Conta desconectada",
      description: "A conta de anúncios foi desconectada com sucesso.",
    });
  };

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <Card key={account.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {account.platform === "meta" ? (
                  <Facebook className="h-5 w-5 text-blue-600" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="#4285F4"/>
                    <path d="M9.5 15.5V8.5h.001l4.744 7h2.968v-9h-2.213v7H15l-4.744-7H7.287v9H9.5z" fill="#fff"/>
                  </svg>
                )}
                <CardTitle>
                  {account.name}
                </CardTitle>
              </div>
              <Badge variant={account.status === "connected" ? "outline" : "secondary"}>
                {account.status === "connected" ? "Conectado" : "Desconectado"}
              </Badge>
            </div>
            <CardDescription>
              {account.platform === "meta" ? "Meta Ads (Facebook e Instagram)" : "Google Ads"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {account.status === "connected" && account.stats ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                  <span className="text-sm text-muted-foreground">Campanhas</span>
                  <span className="text-xl font-bold">{account.stats.campaigns}</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                  <span className="text-sm text-muted-foreground">Conjuntos</span>
                  <span className="text-xl font-bold">{account.stats.adSets}</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                  <span className="text-sm text-muted-foreground">Investimento</span>
                  <span className="text-xl font-bold">{account.stats.spending}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-center mb-4">
                  Conecte sua conta para importar campanhas e métricas
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
          <CardFooter className="flex justify-between">
            <div className="text-xs text-muted-foreground">
              {account.status === "connected" && "Última atualização: 23/04/2025 às 16:30"}
            </div>
            {account.status === "connected" && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Ver Campanhas
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDisconnect(account.id)}
                >
                  Desconectar
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" className="flex items-center gap-2">
          <Link className="h-4 w-4" />
          Adicionar outra conta de anúncios
        </Button>
      </div>
    </div>
  );
};

export default AdsIntegration;
