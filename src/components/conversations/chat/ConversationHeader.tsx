
import React from "react";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Contact } from "@/types/crm";
import ActionButtons from "../ActionButtons";

interface ConversationHeaderProps {
  contact: Contact;
}

const ConversationHeader = ({ contact }: ConversationHeaderProps) => {
  const getSourceIcon = (source: string) => {
    switch (source) {
      case "whatsapp":
        return "WhatsApp";
      case "instagram":
        return "Instagram";
      case "facebook":
        return "Facebook";
      case "telefone":
        return "Telefone";
      default:
        return source;
    }
  };

  return (
    <div className="p-3 border-b flex items-center justify-between bg-white flex-shrink-0">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">{contact.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium flex items-center gap-1">
            {contact.name}
            {contact.tags?.includes("Prioridade") && (
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            )}
          </p>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "h-2 w-2 rounded-full",
              contact.status === "novo" && "bg-blue-500",
              contact.status === "em andamento" && "bg-yellow-500",
              contact.status === "qualificado" && "bg-purple-500",
              contact.status === "convertido" && "bg-success"
            )} />
            <Badge variant="outline" className="h-5 px-1.5 capitalize">
              {contact.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              via {getSourceIcon(contact.sources[0])}
            </span>
          </div>
        </div>
      </div>
      
      <ActionButtons contact={contact} />
    </div>
  );
};

export default ConversationHeader;
