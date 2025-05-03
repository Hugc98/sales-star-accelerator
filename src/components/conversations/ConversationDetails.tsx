
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, Flag, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Contact, Interaction } from "@/types/crm";
import { mockInteractions } from "@/data/mockData";
import { ContactHeader } from "./details/ContactHeader";
import { ContactInfo } from "./details/ContactInfo";
import { ContactNotes } from "./details/ContactNotes";
import { NextActions } from "./details/NextActions";
import { InteractionTimeline } from "./details/InteractionTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ConversationDetailsProps {
  contact: Contact;
}

const ConversationDetails = ({ contact }: ConversationDetailsProps) => {
  const [activeTab, setActiveTab] = useState("info");
  const [interactions, setInteractions] = useState<Interaction[]>(
    mockInteractions.filter(i => i.contactId === contact.id)
  );
  const [showProposals, setShowProposals] = useState(true);
  const [showActivities, setShowActivities] = useState(true);

  // Update interactions when contact changes
  React.useEffect(() => {
    setInteractions(mockInteractions.filter(i => i.contactId === contact.id));
  }, [contact.id]);

  const proposals = [
    { 
      id: 1, 
      title: 'Serviço Mensal', 
      date: '15/03/2023', 
      value: 'R$ 1.500,00', 
      status: 'Enviado' 
    },
    { 
      id: 2, 
      title: 'Projeto Website', 
      date: '22/04/2023', 
      value: 'R$ 5.000,00', 
      status: 'Visualizado' 
    }
  ];

  return (
    <div className="w-80 bg-white flex flex-col h-full">
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-3 border-b">
          <TabsList>
            <TabsTrigger value="info">Detalhes</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <Button variant="ghost" size="icon" className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <TabsContent value="info" className="p-4 space-y-6 m-0">
            <ContactHeader contact={contact} />
            <ContactInfo contact={contact} />
            
            <Collapsible 
              open={showProposals} 
              onOpenChange={setShowProposals}
              className="border rounded-md"
            >
              <CollapsibleTrigger className="flex w-full justify-between items-center p-3">
                <h4 className="text-sm font-medium">Propostas</h4>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {showProposals ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t px-3 py-2 space-y-2">
                  {proposals.map(proposal => (
                    <div key={proposal.id} className="flex flex-col border-b pb-2 last:border-0 last:pb-0 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{proposal.title}</span>
                        <span>{proposal.value}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{proposal.date}</span>
                        <span className="text-blue-600">{proposal.status}</span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Nova proposta
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible 
              open={showActivities} 
              onOpenChange={setShowActivities}
              className="border rounded-md"
            >
              <CollapsibleTrigger className="flex w-full justify-between items-center p-3">
                <h4 className="text-sm font-medium">Atividades Recentes</h4>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {showActivities ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t px-3 py-2">
                  <div className="space-y-3">
                    {interactions.slice(0, 3).map((interaction) => (
                      <div key={interaction.id} className="text-sm border-b pb-2 last:border-0 last:pb-0">
                        <p className="font-medium">{interaction.type === "message" ? "Mensagem" : interaction.type}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{interaction.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs">via {interaction.source}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(interaction.timestamp).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {interactions.length > 3 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-xs"
                        onClick={() => setActiveTab("timeline")}
                      >
                        Ver todas as atividades
                      </Button>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <ContactNotes />
            <NextActions />
          </TabsContent>
          
          <TabsContent value="timeline" className="p-0 m-0 h-full">
            <div className="p-4 border-b">
              <h3 className="font-medium mb-1">Timeline de interações</h3>
              <p className="text-sm text-muted-foreground">
                Histórico completo de comunicações com {contact.name}
              </p>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Filtrar por tipo</h4>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-7 text-xs">Mensagens</Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">Reuniões</Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">Notas</Button>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
              <InteractionTimeline interactions={interactions} />
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="p-4 m-0">
            <div className="space-y-4">
              <h3 className="font-medium">Insights do Lead</h3>
              
              <Card className="border shadow-none">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1 text-primary" />
                    Engajamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tempo de resposta</span>
                      <span className="text-sm font-medium">14min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Taxa de abertura</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Interações</span>
                      <span className="text-sm font-medium">32</span>
                    </div>
                    <div className="h-1 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <div className="h-full w-[75%] progress-bar-gradient rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border shadow-none">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Estágio no Funil</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center gap-1 my-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="h-2 w-8 bg-blue-500 rounded-full"></div>
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="h-2 w-12 bg-yellow-500 rounded-full"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    
                    <div className="h-2 w-2 rounded-full bg-muted"></div>
                    <div className="h-2 w-12 bg-muted rounded-full"></div>
                    <div className="h-2 w-2 rounded-full bg-muted"></div>
                    
                    <div className="h-2 w-2 rounded-full bg-muted"></div>
                    <div className="h-2 w-8 bg-muted rounded-full"></div>
                    <div className="h-2 w-2 rounded-full bg-muted"></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span>Novo</span>
                    <span>Em andamento</span>
                    <span>Qualificado</span>
                    <span>Fechado</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border shadow-none">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Interesses</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Produto X</span>
                      <div className="flex items-center">
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-2">
                          <div className="h-full w-[85%] bg-primary rounded-full"></div>
                        </div>
                        <span className="text-xs font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Serviço Y</span>
                      <div className="flex items-center">
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-2">
                          <div className="h-full w-[40%] bg-primary rounded-full"></div>
                        </div>
                        <span className="text-xs font-medium">40%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Produto Z</span>
                      <div className="flex items-center">
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-2">
                          <div className="h-full w-[25%] bg-primary rounded-full"></div>
                        </div>
                        <span className="text-xs font-medium">25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default ConversationDetails;
