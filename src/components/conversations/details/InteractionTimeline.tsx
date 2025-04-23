
import { MessageSquare, PhoneCall, Calendar, FileText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Interaction } from "@/types/crm";

interface InteractionTimelineProps {
  interactions: Interaction[];
}

export const InteractionTimeline = ({ interactions }: InteractionTimelineProps) => {
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
    <div className="relative pl-6 space-y-6">
      <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
      
      {interactions.map((interaction) => (
        <div key={interaction.id} className="relative">
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
  );
};
