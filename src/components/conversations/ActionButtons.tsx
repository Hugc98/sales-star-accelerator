
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  CalendarClock, 
  Tag, 
  Star,
  Clock,
  Flag,
  Send,
  Users
} from "lucide-react";
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
import { Contact } from "@/types/crm";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActionButtonsProps {
  contact: Contact;
  onUpdateContact?: (updatedContact: Partial<Contact>) => void;
}

const ActionButtons = ({ contact, onUpdateContact }: ActionButtonsProps) => {
  // Sample team members
  const teamMembers = [
    { id: 1, name: "João Silva", avatar: "/lovable-uploads/fea6b9a8-edba-4b60-9a9a-9564b8335d22.png" },
    { id: 2, name: "Maria Oliveira", avatar: "" },
    { id: 3, name: "Carlos Santos", avatar: "" },
    { id: 4, name: "Beatriz Lima", avatar: "" },
  ];

  // Sample tags
  const availableTags = [
    { id: 1, name: "Prioridade", color: "yellow" },
    { id: 2, name: "VIP", color: "purple" },
    { id: 3, name: "Follow-up", color: "blue" },
    { id: 4, name: "Proposta", color: "green" },
    { id: 5, name: "Fechamento", color: "red" }
  ];

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

  const getTagColor = (color: string) => {
    switch (color) {
      case "yellow": return "bg-yellow-100 border-yellow-200 text-yellow-800";
      case "purple": return "bg-purple-100 border-purple-200 text-purple-800";
      case "blue": return "bg-blue-100 border-blue-200 text-blue-800";
      case "green": return "bg-green-100 border-green-200 text-green-800";
      case "red": return "bg-red-100 border-red-200 text-red-800";
      default: return "";
    }
  };

  return (
    <div className="flex gap-1">
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

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <CalendarClock className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Agendar evento</p>
          </TooltipContent>
        </Tooltip>

        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Tag className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Gerenciar tags</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-72 p-0">
            <div className="p-3 border-b">
              <h4 className="font-medium">Gerenciar tags</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Adicione tags para categorizar este contato
              </p>
            </div>
            <div className="p-3">
              <Input placeholder="Buscar ou criar tag..." className="mb-2" />
              <div className="flex flex-wrap gap-1 mb-3">
                {contact.tags?.map(tag => (
                  <Badge key={tag} variant="outline" className="flex gap-1 items-center">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" />
                  </Badge>
                ))}
              </div>
              <div className="border-t pt-2">
                <p className="text-xs text-muted-foreground mb-2">Tags populares</p>
                <div className="flex flex-wrap gap-1">
                  {availableTags.map(tag => (
                    <Badge 
                      key={tag.id} 
                      variant="outline" 
                      className={`cursor-pointer ${getTagColor(tag.color)}`}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

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
    </div>
  );
};

export default ActionButtons;
