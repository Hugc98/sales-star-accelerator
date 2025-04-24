
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Play,
  Pause,
  MoreVertical,
  ChevronRight,
  Calendar,
  Mail,
  MessagesSquare,
  MessageSquare,
  Users,
  Bell,
  Phone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Tipo para sequências de automação
type AutomationSequence = {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  messageCount: number;
  totalLeads: number;
  openRate?: number;
  responseRate?: number;
  leadSources: string[];
  leadStatuses: string[];
  createdAt: string;
};

// Tipo para mensagens em uma sequência
type SequenceMessage = {
  id: string;
  sequenceId: string;
  name: string;
  channel: "email" | "sms" | "whatsapp";
  subject?: string;
  content: string;
  delay: {
    value: number;
    unit: "minutes" | "hours" | "days";
  };
  condition?: {
    type: "opened" | "clicked" | "replied" | "none";
    previousMessage?: string;
  };
  order: number;
  stats?: {
    sent: number;
    opened?: number;
    clicked?: number;
    replied?: number;
  };
};

// Dados de exemplo para sequências de automação
const automationSequences: AutomationSequence[] = [
  {
    id: "seq-1",
    name: "Boas-vindas a Novos Leads",
    description: "Sequência de boas-vindas para novos leads captados pelo site",
    status: "active",
    messageCount: 4,
    totalLeads: 127,
    openRate: 68.3,
    responseRate: 23.7,
    leadSources: ["Site", "Landing Page"],
    leadStatuses: ["novo"],
    createdAt: "2023-06-15",
  },
  {
    id: "seq-2",
    name: "Recuperação de Leads Inativos",
    description: "Tentativa de reengajamento para leads sem interação por 30 dias",
    status: "active",
    messageCount: 3,
    totalLeads: 89,
    openRate: 42.1,
    responseRate: 11.5,
    leadSources: ["Todos"],
    leadStatuses: ["qualificado", "negociação"],
    createdAt: "2023-07-22",
  },
  {
    id: "seq-3",
    name: "Sequência Pós-Demonstração",
    description: "Acompanhamento após demonstração de produto",
    status: "paused",
    messageCount: 5,
    totalLeads: 34,
    openRate: 75.2,
    responseRate: 31.0,
    leadSources: ["Demo Agendada"],
    leadStatuses: ["qualificado", "negociação"],
    createdAt: "2023-08-10",
  },
  {
    id: "seq-4",
    name: "Campanha Fim de Ano",
    description: "Ofertas especiais para o fim do ano fiscal",
    status: "draft",
    messageCount: 2,
    totalLeads: 0,
    leadSources: [],
    leadStatuses: [],
    createdAt: "2023-09-05",
  },
];

// Dados de exemplo para mensagens de uma sequência
const sequenceMessages: Record<string, SequenceMessage[]> = {
  "seq-1": [
    {
      id: "msg-1",
      sequenceId: "seq-1",
      name: "Boas-vindas inicial",
      channel: "email",
      subject: "Bem-vindo à Avante Solutions!",
      content: "Olá {nome}, obrigado por se cadastrar em nosso site! Estamos felizes em ter você conosco...",
      delay: {
        value: 0,
        unit: "minutes",
      },
      condition: {
        type: "none",
      },
      order: 0,
      stats: {
        sent: 127,
        opened: 98,
        clicked: 72,
        replied: 18,
      },
    },
    {
      id: "msg-2",
      sequenceId: "seq-1",
      name: "Material educativo",
      channel: "email",
      subject: "Conteúdo exclusivo para você",
      content: "Olá {nome}, preparamos um material exclusivo sobre como aumentar suas vendas...",
      delay: {
        value: 2,
        unit: "days",
      },
      condition: {
        type: "opened",
        previousMessage: "msg-1",
      },
      order: 1,
      stats: {
        sent: 98,
        opened: 76,
        clicked: 41,
        replied: 12,
      },
    },
    {
      id: "msg-3",
      sequenceId: "seq-1",
      name: "WhatsApp de acompanhamento",
      channel: "whatsapp",
      content: "Olá {nome}, notei que você acessou nosso material sobre vendas. Posso ajudar com alguma dúvida?",
      delay: {
        value: 1,
        unit: "days",
      },
      condition: {
        type: "clicked",
        previousMessage: "msg-2",
      },
      order: 2,
      stats: {
        sent: 41,
        replied: 23,
      },
    },
    {
      id: "msg-4",
      sequenceId: "seq-1",
      name: "Oferta especial",
      channel: "email",
      subject: "Uma oferta exclusiva para você!",
      content: "Olá {nome}, como novo cliente, queremos oferecer um desconto especial de 20% no seu primeiro mês...",
      delay: {
        value: 4,
        unit: "days",
      },
      condition: {
        type: "opened",
        previousMessage: "msg-2",
      },
      order: 3,
      stats: {
        sent: 76,
        opened: 54,
        clicked: 32,
        replied: 18,
      },
    },
  ],
};

// Status colors
const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  paused: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

// Componente para renderizar o ícone do canal
const ChannelIcon = ({ channel }: { channel: string }) => {
  switch (channel) {
    case "email":
      return <Mail className="h-4 w-4" />;
    case "sms":
      return <MessageSquare className="h-4 w-4" />;
    case "whatsapp":
      return <MessagesSquare className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

const MarketingAutomationPage: React.FC = () => {
  const [activeSequence, setActiveSequence] = useState<AutomationSequence | null>(null);
  const [isSequenceDetailOpen, setIsSequenceDetailOpen] = useState(false);

  const openSequenceDetail = (sequence: AutomationSequence) => {
    setActiveSequence(sequence);
    setIsSequenceDetailOpen(true);
  };

  // Componente para exibir o status da sequência
  const SequenceStatusBadge = ({ status }: { status: string }) => {
    const labels = {
      active: "Ativa",
      paused: "Pausada",
      draft: "Rascunho",
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Automação de Marketing</h1>
          <p className="text-muted-foreground">
            Gerencie suas sequências de mensagens automáticas
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nova Sequência
        </Button>
      </div>

      <Tabs defaultValue="sequences" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sequences">Sequências</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sequences" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {automationSequences.map((sequence) => (
              <Card key={sequence.id} className="hover-scale">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{sequence.name}</CardTitle>
                    <SequenceStatusBadge status={sequence.status} />
                  </div>
                  <CardDescription>{sequence.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Mensagens:</span>
                    <span className="font-medium">{sequence.messageCount}</span>
                  </div>
                  
                  {sequence.status !== 'draft' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Leads ativos:</span>
                        <span className="font-medium">{sequence.totalLeads}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Taxa de abertura:</span>
                          <span className="font-medium">{sequence.openRate}%</span>
                        </div>
                        <Progress value={sequence.openRate} className="h-1" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Taxa de resposta:</span>
                          <span className="font-medium">{sequence.responseRate}%</span>
                        </div>
                        <Progress value={sequence.responseRate} className="h-1" />
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs"
                      onClick={() => openSequenceDetail(sequence)}
                    >
                      Ver detalhes <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                    
                    <div className="flex space-x-1">
                      {sequence.status === 'active' ? (
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Editar sequência</DropdownMenuItem>
                          <DropdownMenuItem>Duplicar sequência</DropdownMenuItem>
                          <DropdownMenuItem>Ver estatísticas</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Excluir sequência
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full py-8">
                <Button variant="ghost" size="lg" className="h-20 w-20 rounded-full mb-4">
                  <Plus className="h-8 w-8" />
                </Button>
                <h3 className="font-medium">Nova Sequência</h3>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Crie uma sequência automatizada de mensagens para seus leads
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Mensagens</CardTitle>
              <CardDescription>
                Crie e gerencie templates para usar em suas sequências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Funcionalidade em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Desempenho</CardTitle>
              <CardDescription>
                Métricas e estatísticas das suas automações de marketing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Funcionalidade em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de detalhes da sequência */}
      <Dialog open={isSequenceDetailOpen} onOpenChange={setIsSequenceDetailOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">
                {activeSequence?.name}
              </DialogTitle>
              {activeSequence && (
                <SequenceStatusBadge status={activeSequence.status} />
              )}
            </div>
            <DialogDescription>
              {activeSequence?.description}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="pr-4 max-h-[60vh]">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Detalhes da Sequência</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total de mensagens</p>
                    <p className="font-medium">{activeSequence?.messageCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Leads ativos</p>
                    <p className="font-medium">{activeSequence?.totalLeads}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Taxa de abertura</p>
                    <p className="font-medium">{activeSequence?.openRate}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Taxa de resposta</p>
                    <p className="font-medium">{activeSequence?.responseRate}%</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Mensagens da Sequência</h3>
                  <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Adicionar Mensagem
                  </Button>
                </div>
                
                {activeSequence && sequenceMessages[activeSequence.id] ? (
                  <div className="space-y-4">
                    {sequenceMessages[activeSequence.id].map((message, index) => (
                      <Card key={message.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <div className="bg-accent w-6 h-6 rounded-full flex items-center justify-center">
                                <ChannelIcon channel={message.channel} />
                              </div>
                              <h4 className="font-medium">{message.name}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              {index === 0 ? (
                                <Badge variant="outline">Inicial</Badge>
                              ) : (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {message.delay.value} {message.delay.unit}
                                  </span>
                                </div>
                              )}
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Editar</DropdownMenuItem>
                                  <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          <div className="pl-8">
                            {message.channel === "email" && message.subject && (
                              <p className="text-sm font-medium">Assunto: {message.subject}</p>
                            )}
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {message.content}
                            </p>
                            
                            {message.condition && message.condition.type !== "none" && (
                              <div className="mt-2 text-xs bg-muted p-2 rounded-md">
                                <span className="font-medium">Condição: </span>
                                {message.condition.type === "opened"
                                  ? "Enviado se o lead abriu a mensagem anterior"
                                  : message.condition.type === "clicked"
                                  ? "Enviado se o lead clicou na mensagem anterior"
                                  : "Enviado se o lead respondeu à mensagem anterior"}
                              </div>
                            )}
                            
                            {message.stats && (
                              <div className="grid grid-cols-4 gap-4 mt-3 pt-3 border-t">
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground">Enviados</p>
                                  <p className="font-medium">{message.stats.sent}</p>
                                </div>
                                {message.stats.opened !== undefined && (
                                  <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Abertos</p>
                                    <p className="font-medium">{message.stats.opened}</p>
                                  </div>
                                )}
                                {message.stats.clicked !== undefined && (
                                  <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Cliques</p>
                                    <p className="font-medium">{message.stats.clicked}</p>
                                  </div>
                                )}
                                {message.stats.replied !== undefined && (
                                  <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Respostas</p>
                                    <p className="font-medium">{message.stats.replied}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">
                        Esta sequência não possui mensagens configuradas
                      </p>
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar a primeira mensagem
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Segmentação</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Fontes de lead</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeSequence?.leadSources && activeSequence.leadSources.length > 0 ? (
                        activeSequence.leadSources.map((source) => (
                          <Badge key={source} variant="secondary">
                            {source}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">Todas as fontes</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Status do lead</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeSequence?.leadStatuses && activeSequence.leadStatuses.length > 0 ? (
                        activeSequence.leadStatuses.map((status) => (
                          <Badge key={status} variant="secondary">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">Todos os status</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline">Fechar</Button>
            <Button>Editar Sequência</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default MarketingAutomationPage;
