
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  User,
  Building,
  Phone,
  Mail,
  Tag,
  Clock,
  Edit,
  Plus,
  MessageSquare,
  PhoneCall,
  Calendar,
  FileText,
  X
} from "lucide-react";
import { Contact, Interaction } from "@/types/crm";
import { mockInteractions } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationDetailsProps {
  contact: Contact;
}

const ConversationDetails = ({ contact }: ConversationDetailsProps) => {
  const [activeTab, setActiveTab] = useState("info");
  const [interactions, setInteractions] = useState<Interaction[]>(
    mockInteractions.filter(i => i.contactId === contact.id)
  );

  // Update interactions when contact changes
  React.useEffect(() => {
    setInteractions(mockInteractions.filter(i => i.contactId === contact.id));
  }, [contact.id]);

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "call":
        return <PhoneCall className="h-4 w-4" />;
      case "meeting":
        return <Calendar className="h-4 w-4" />;
      case "note":
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Hoje às ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem às ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit',
        month: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="w-80 bg-background flex flex-col h-full">
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-3 border-b">
          <TabsList>
            <TabsTrigger value="info">Detalhes</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          <Button variant="ghost" size="icon" className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="info" className="p-4 space-y-6 m-0">
            <div className="text-center">
              <Avatar className="h-16 w-16 mx-auto mb-3">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback className="text-lg">{contact.initials}</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">{contact.name}</h3>
              {contact.company && (
                <p className="text-muted-foreground text-sm">{contact.company}</p>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p className="text-sm">{contact.phone || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm">{contact.email || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Building className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Empresa</p>
                  <p className="text-sm">{contact.company || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Tag className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {contact.tags && contact.tags.length > 0 ? (
                      contact.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm">Nenhuma tag</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
                Notas
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              </h4>
              <Separator className="mb-3" />
              <p className="text-sm text-muted-foreground">
                Cliente interessado em planos empresariais. Agendar reunião para próxima semana.
              </p>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
                Próximas ações
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </h4>
              <Separator className="mb-3" />
              <div className="space-y-2">
                <div className="bg-muted p-2 rounded-md text-sm flex items-start justify-between">
                  <div>
                    <p className="font-medium">Enviar proposta comercial</p>
                    <p className="text-xs text-muted-foreground">Amanhã às 10:00</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2">
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="bg-muted p-2 rounded-md text-sm flex items-start justify-between">
                  <div>
                    <p className="font-medium">Agendar reunião de follow-up</p>
                    <p className="text-xs text-muted-foreground">27/04/2023 às 14:00</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2">
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="p-0 m-0 h-full">
            <div className="p-4 border-b">
              <h3 className="font-medium mb-1">Timeline de interações</h3>
              <p className="text-sm text-muted-foreground">
                Histórico completo de comunicações com {contact.name}
              </p>
            </div>
            
            <div className="p-4">
              <div className="relative pl-6 space-y-6">
                {/* Timeline line */}
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
                
                {interactions.map((interaction) => (
                  <div key={interaction.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-6 mt-1.5 h-4 w-4 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      {getInteractionIcon(interaction.type)}
                    </div>
                    <div className="bg-card/50 border rounded-md p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-medium flex items-center gap-1">
                          {interaction.type === "message" && "Mensagem"}
                          {interaction.type === "call" && "Ligação"}
                          {interaction.type === "note" && "Nota"}
                          {interaction.type === "meeting" && "Reunião"}
                          {interaction.subtype && <span>({interaction.subtype})</span>}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(interaction.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm">{interaction.content}</p>
                      
                      {interaction.source && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            via {interaction.source}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ConversationDetails;
