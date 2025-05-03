
import React from "react";
import { Users } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contact } from "@/types/crm";

interface AssignPopoverProps {
  contact: Contact;
  onUpdateContact?: (updatedContact: Partial<Contact>) => void;
}

const AssignPopover = ({ contact, onUpdateContact }: AssignPopoverProps) => {
  // Sample team members
  const teamMembers = [
    { id: 1, name: "João Silva", avatar: "/lovable-uploads/fea6b9a8-edba-4b60-9a9a-9564b8335d22.png" },
    { id: 2, name: "Maria Oliveira", avatar: "" },
    { id: 3, name: "Carlos Santos", avatar: "" },
    { id: 4, name: "Beatriz Lima", avatar: "" },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Users className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Atribuir a</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-72 p-0" align="end">
          <div className="p-3 border-b">
            <h4 className="font-medium">Atribuir a</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Escolha um membro da equipe para atribuir este contato
            </p>
          </div>
          <ScrollArea className="max-h-64">
            <div className="p-2">
              {teamMembers.map(member => (
                <Button 
                  key={member.id}
                  variant="ghost" 
                  className="w-full justify-start h-12 px-2 mb-1"
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      {member.avatar ? (
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {member.name.split(' ').map(n => n.charAt(0)).join('')}
                        </span>
                      )}
                    </div>
                    <span>{member.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default AssignPopover;
