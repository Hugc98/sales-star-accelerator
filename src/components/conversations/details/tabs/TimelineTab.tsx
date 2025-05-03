
import React from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InteractionTimeline } from "../InteractionTimeline";
import { Interaction } from "@/types/crm";

interface TimelineTabProps {
  interactions: Interaction[];
  contactName: string;
}

export const TimelineTab = ({ interactions, contactName }: TimelineTabProps) => {
  return (
    <>
      <div className="p-4 border-b">
        <h3 className="font-medium mb-1">Timeline de interações</h3>
        <p className="text-sm text-muted-foreground">
          Histórico completo de comunicações com {contactName}
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
    </>
  );
};
