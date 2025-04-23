
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Key, 
  RefreshCw, 
  Copy, 
  Webhook, 
  FileJson, 
  HelpCircle, 
  Database,
  Code
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dados de exemplo
const apiKeys = [
  {
    id: "key_1",
    name: "Produção",
    key: "sk_live_xxxxxxxxxxxxxxxxxxxx",
    createdAt: "20/01/2025",
    lastUsed: "23/04/2025"
  },
  {
    id: "key_2",
    name: "Desenvolvimento",
    key: "sk_test_xxxxxxxxxxxxxxxxxxxx",
    createdAt: "20/01/2025",
    lastUsed: "22/04/2025"
  }
];

const webhooks = [
  {
    id: "wh_1",
    url: "https://meusite.com/webhook/novos-leads",
    event: "leads.created",
    status: "Ativo",
    lastTriggered: "23/04/2025 15:30"
  },
  {
    id: "wh_2",
    url: "https://meusite.com/webhook/atualizacoes",
    event: "leads.updated",
    status: "Ativo",
    lastTriggered: "22/04/2025 10:15"
  }
];

const DeveloperSection = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("api-keys");
  const [newWebhook, setNewWebhook] = useState({ url: "", event: "" });
  const [isCreating, setIsCreating] = useState(false);

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Chave copiada",
      description: "A chave de API foi copiada para a área de transferência.",
    });
  };

  const handleRegenerateKey = (id: string) => {
    toast({
      title: "Chave regenerada",
      description: "Uma nova chave de API foi gerada com sucesso.",
    });
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWebhook.url || !newWebhook.event) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      setNewWebhook({ url: "", event: "" });
      toast({
        title: "Webhook criado",
        description: "O webhook foi configurado com sucesso.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Avançado / Desenvolvedor</h2>
        <p className="text-muted-foreground">
          Ferramentas e recursos para desenvolvedores e integrações avançadas.
        </p>
      </div>
      
      <Tabs defaultValue="api-keys" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span>Chaves de API</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            <span>Webhooks</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            <span>Logs</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>Chaves de API</CardTitle>
              <CardDescription>
                Gerencie suas chaves de API para integrar com o sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md bg-muted/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">Como usar</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use estas chaves para autenticar suas solicitações de API. Nunca compartilhe suas chaves de API ou as armazene em locais públicos.
                  </p>
                  <pre className="mt-2 rounded-md bg-muted p-2 overflow-x-auto text-xs">
                    <code>
                      curl https://api.salesstar.com/v1/leads \<br />
                      &nbsp;&nbsp;-H "Authorization: Bearer sua_chave_aqui" \<br />
                      &nbsp;&nbsp;-H "Content-Type: application/json"
                    </code>
                  </pre>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Chave</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Último uso</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell className="font-medium">{apiKey.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{apiKey.key}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => handleCopyApiKey(apiKey.key)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{apiKey.createdAt}</TableCell>
                        <TableCell>{apiKey.lastUsed}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRegenerateKey(apiKey.id)}
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1" />
                            Regenerar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>
                Configure webhooks para receber notificações de eventos em tempo real.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md bg-muted/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">Como funcionam os webhooks</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Os webhooks permitem que seu aplicativo receba notificações em tempo real quando eventos específicos ocorrem no sistema.
                  </p>
                </div>
                
                <form onSubmit={handleCreateWebhook} className="space-y-4 border rounded-md p-4">
                  <h4 className="font-medium">Criar novo webhook</h4>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="webhook-url">URL do webhook</Label>
                      <Input 
                        id="webhook-url" 
                        placeholder="https://"
                        value={newWebhook.url}
                        onChange={(e) => setNewWebhook({...newWebhook, url: e.target.value})}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        URL para onde enviaremos as notificações.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="webhook-event">Evento</Label>
                      <select 
                        id="webhook-event"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newWebhook.event}
                        onChange={(e) => setNewWebhook({...newWebhook, event: e.target.value})}
                        required
                      >
                        <option value="">Selecione um evento</option>
                        <option value="leads.created">Novo lead criado</option>
                        <option value="leads.updated">Lead atualizado</option>
                        <option value="messages.received">Nova mensagem recebida</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          Criando...
                        </>
                      ) : "Criar Webhook"}
                    </Button>
                  </div>
                </form>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>Evento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último disparo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.map((webhook) => (
                      <TableRow key={webhook.id}>
                        <TableCell className="font-mono text-sm">{webhook.url}</TableCell>
                        <TableCell>{webhook.event}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {webhook.status}
                          </span>
                        </TableCell>
                        <TableCell>{webhook.lastTriggered}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs de atividade</CardTitle>
              <CardDescription>
                Visualize logs de chamadas de API e eventos do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <select 
                      className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      defaultValue="all"
                    >
                      <option value="all">Todos os tipos</option>
                      <option value="api">Chamadas de API</option>
                      <option value="webhook">Eventos de webhook</option>
                      <option value="auth">Autenticação</option>
                    </select>
                    <select 
                      className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      defaultValue="24h"
                    >
                      <option value="24h">Últimas 24 horas</option>
                      <option value="7d">Últimos 7 dias</option>
                      <option value="30d">Últimos 30 dias</option>
                    </select>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <RefreshCw className="h-4 w-4" />
                    Atualizar
                  </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted p-2 border-b flex items-center justify-between text-xs font-medium">
                    <span>Data/Hora</span>
                    <span>Método</span>
                    <span>Caminho</span>
                    <span>Status</span>
                    <span>Detalhes</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i}
                        className="p-2 border-b text-xs flex items-center justify-between hover:bg-muted/50"
                      >
                        <span className="text-muted-foreground">
                          {new Date(Date.now() - i * 3600000).toLocaleString()}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-sm ${
                          ['GET', 'POST', 'PUT', 'DELETE'][i % 4] === 'GET' 
                            ? 'bg-blue-100 text-blue-800' 
                            : ['GET', 'POST', 'PUT', 'DELETE'][i % 4] === 'POST'
                            ? 'bg-green-100 text-green-800'
                            : ['GET', 'POST', 'PUT', 'DELETE'][i % 4] === 'PUT'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {['GET', 'POST', 'PUT', 'DELETE'][i % 4]}
                        </span>
                        <span className="font-mono">/api/v1/{['leads', 'users', 'messages', 'campaigns'][i % 4]}</span>
                        <span className={`px-1.5 py-0.5 rounded-sm ${
                          [200, 201, 400, 404, 500][i % 5] < 300
                            ? 'bg-green-100 text-green-800'
                            : [200, 201, 400, 404, 500][i % 5] < 500
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {[200, 201, 400, 404, 500][i % 5]}
                        </span>
                        <Button variant="ghost" size="sm" className="h-5 text-xs">
                          Ver
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button variant="link" className="text-xs">
                    Carregar mais logs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeveloperSection;
