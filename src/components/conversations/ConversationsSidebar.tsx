
import React, { useState } from "react";
import { Search, Filter, Plus, MessageSquare, Phone, Instagram, Facebook } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Contact } from "@/types/crm";
import { mockContacts } from "@/data/mockData";

interface ConversationsSidebarProps {
  onSelectContact: (contact: Contact) => void;
  activeContactId: number | undefined;
}

const ConversationsSidebar = ({ 
  onSelectContact,
  activeContactId 
}: ConversationsSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredContacts = mockContacts.filter(contact => {
    // Filter by search term
    if (searchTerm && !contact.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by tab selection
    if (activeTab !== "all") {
      return contact.sources.includes(activeTab as any);
    }
    
    return true;
  });

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "whatsapp":
        return <MessageSquare className="h-3.5 w-3.5 text-green-500" />;
      case "instagram":
        return <Instagram className="h-3.5 w-3.5 text-pink-500" />;
      case "facebook":
        return <Facebook className="h-3.5 w-3.5 text-blue-500" />;
      case "telefone":
        return <Phone className="h-3.5 w-3.5 text-gray-500" />;
      default:
        return <MessageSquare className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="w-80 border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Conversas</h2>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contato"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="p-2 border-b">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="whatsapp" className="px-1.5">
              <MessageSquare className="h-4 w-4 text-green-500" />
            </TabsTrigger>
            <TabsTrigger value="instagram" className="px-1.5">
              <Instagram className="h-4 w-4 text-pink-500" />
            </TabsTrigger>
            <TabsTrigger value="facebook" className="px-1.5">
              <Facebook className="h-4 w-4 text-blue-500" />
            </TabsTrigger>
            <TabsTrigger value="telefone" className="px-1.5">
              <Phone className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
              activeContactId === contact.id ? "bg-muted" : ""
            }`}
            onClick={() => onSelectContact(contact)}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className={contact.unreadCount > 0 ? "ring-2 ring-primary" : ""}>
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.initials}</AvatarFallback>
                </Avatar>
                {contact.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <Badge variant="secondary" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {contact.unreadCount}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-medium truncate">{contact.name}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(contact.lastActivity).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                {contact.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {contact.lastMessage.content}
                  </p>
                )}
                
                <div className="flex gap-1 mt-1.5">
                  {contact.sources.slice(0, 2).map((source) => (
                    <div key={source} className="flex items-center">
                      {getSourceIcon(source)}
                    </div>
                  ))}
                  {contact.sources.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{contact.sources.length - 2}
                    </span>
                  )}
                  
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="ml-1.5">
                      <Badge variant="outline" className="text-xs px-1 h-5">
                        {contact.tags[0]}
                      </Badge>
                      {contact.tags.length > 1 && (
                        <span className="text-xs text-muted-foreground ml-1">
                          +{contact.tags.length - 1}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationsSidebar;
