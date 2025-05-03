
import React from "react";
import { Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Button } from "@/components/ui/button";
import { Contact } from "@/types/crm";

interface TagsPopoverProps {
  contact: Contact;
  onUpdateContact?: (updatedContact: Partial<Contact>) => void;
}

const TagsPopover = ({ contact, onUpdateContact }: TagsPopoverProps) => {
  // Sample tags
  const availableTags = [
    { id: 1, name: "Prioridade", color: "yellow" },
    { id: 2, name: "VIP", color: "purple" },
    { id: 3, name: "Follow-up", color: "blue" },
    { id: 4, name: "Proposta", color: "green" },
    { id: 5, name: "Fechamento", color: "red" }
  ];

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
    <TooltipProvider delayDuration={300}>
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
    </TooltipProvider>
  );
};

export default TagsPopover;
