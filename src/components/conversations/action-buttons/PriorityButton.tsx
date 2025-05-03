
import React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Contact } from "@/types/crm";

interface PriorityButtonProps {
  contact: Contact;
  onUpdateContact?: (updatedContact: Partial<Contact>) => void;
}

const PriorityButton = ({ contact, onUpdateContact }: PriorityButtonProps) => {
  const isPriority = contact.tags?.includes("Prioridade") || false;

  const handleTogglePriority = () => {
    if (onUpdateContact) {
      if (isPriority) {
        // Remove priority tag
        const updatedTags = contact.tags?.filter(tag => tag !== "Prioridade") || [];
        onUpdateContact({ tags: updatedTags });
      } else {
        // Add priority tag
        const updatedTags = [...(contact.tags || []), "Prioridade"];
        onUpdateContact({ tags: updatedTags });
      }
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={isPriority ? "default" : "ghost"} 
            size="icon" 
            className="rounded-full h-8 w-8"
            onClick={handleTogglePriority}
          >
            <Star className={isPriority ? "h-4 w-4 text-white" : "h-4 w-4"} fill={isPriority ? "currentColor" : "none"} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{isPriority ? "Remover prioridade" : "Marcar como prioritário"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PriorityButton;
