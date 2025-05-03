
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Interaction } from "@/types/crm";

interface RecentActivitiesSectionProps {
  showActivities: boolean;
  setShowActivities: (show: boolean) => void;
  interactions: Interaction[];
}

export const RecentActivitiesSection = ({ 
  showActivities, 
  setShowActivities,
  interactions
}: RecentActivitiesSectionProps) => {
  return (
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
                onClick={() => setShowActivities(false)}
              >
                Ver todas as atividades
              </Button>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
