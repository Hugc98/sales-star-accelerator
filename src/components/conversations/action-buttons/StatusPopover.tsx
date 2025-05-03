
import React from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact } from "@/types/crm";

interface StatusPopoverProps {
  contact: Contact;
  onUpdateContact?: (updatedContact: Partial<Contact>) => void;
}

const StatusPopover = ({ contact, onUpdateContact }: StatusPopoverProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Flag className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Atualizar status</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-72 p-0">
          <div className="p-3 border-b">
            <h4 className="font-medium">Status do lead</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Atualize o status deste contato no funil
            </p>
          </div>
          <div className="p-2">
            <Tabs defaultValue={contact.status}>
              <TabsList className="w-full">
                <TabsTrigger value="novo">Novo</TabsTrigger>
                <TabsTrigger value="em andamento">Andamento</TabsTrigger>
                <TabsTrigger value="qualificado">Qualificado</TabsTrigger>
                <TabsTrigger value="convertido">Convertido</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default StatusPopover;
