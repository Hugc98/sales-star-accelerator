
import React, { useState } from "react";
import { Search, Filter, Plus, MessageSquare, Phone, Instagram, Facebook, Star, Clock, X, Check, Users, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Contact } from "@/types/crm";
import { mockContacts } from "@/data/mockData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ConversationsSidebarProps {
  onSelectContact: (contact: Contact) => void;
  activeContactId?: number;
  className?: string; // Add this line to fix the type error
}

const ConversationsSidebar = ({ 
  onSelectContact,
  activeContactId 
}: ConversationsSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showPrioritized, setShowPrioritized] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [filterAgents, setFilterAgents] = useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);

  const handleAgentFilterChange = (agent: string) => {
    if (filterAgents.includes(agent)) {
      setFilterAgents(filterAgents.filter(a => a !== agent));
    } else {
      setFilterAgents([...filterAgents, agent]);
    }
  };

  const handleStatusFilterChange = (status: string) => {
    if (filterStatuses.includes(status)) {
      setFilterStatuses(filterStatuses.filter(s => s !== status));
    } else {
      setFilterStatuses([...filterStatuses, status]);
    }
  };

  const prioritizedContacts = mockContacts
    .map(contact => ({
      ...contact,
      isPriority: contact.tags?.includes("Prioridade") || false
    }));

  const filteredContacts = prioritizedContacts.filter(contact => {
    // Filter by search term
    if (searchTerm && !contact.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by source tab
    if (activeTab !== "all") {
      if (!contact.sources.includes(activeTab as any)) {
        return false;
      }
    }
    
    // Filter by priority
    if (showPrioritized && !contact.isPriority) {
      return false;
    }
    
    // Filter by agent
    if (filterAgents.length > 0) {
      const agent = contact.agent || "Não atribuído";
      if (!filterAgents.includes(agent)) {
        return false;
      }
    }
    
    // Filter by status
    if (filterStatuses.length > 0) {
      if (!filterStatuses.includes(contact.status)) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort contacts based on selected sort option
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      case "priority":
        return (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0);
      case "unread":
        return b.unreadCount - a.unreadCount;
      default:
        return 0;
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "novo":
        return "bg-blue-500";
      case "em andamento":
        return "bg-yellow-500";
      case "qualificado":
        return "bg-purple-500";
      case "convertido":
        return "bg-success";
      case "perdido":
        return "bg-destructive";
      default:
        return "bg-gray-400";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffMins < 24 * 60) {
      return `${Math.round(diffMins / 60)}h`;
    } else {
      return `${Math.round(diffMins / (60 * 24))}d`;
    }
  };

  return (
    <div className="w-80 border-r flex flex-col bg-white">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Conversas</h2>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" title="Alternar visualização" className="h-8 w-8"
              onClick={() => setViewMode(viewMode === "list" ? "card" : "list")}>
              <SortDesc className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4" side="bottom" align="end">
                <div className="space-y-4">
                  <h3 className="font-medium">Filtros</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="priority-filter">Apenas prioridades</Label>
                      <Switch 
                        id="priority-filter" 
                        checked={showPrioritized}
                        onCheckedChange={setShowPrioritized}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Ordenar por</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="recent">Mais recentes</SelectItem>
                            <SelectItem value="priority">Prioridade</SelectItem>
                            <SelectItem value="unread">Não lidas</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["novo", "em andamento", "qualificado", "convertido", "perdido"].map(status => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`status-${status}`}
                              checked={filterStatuses.includes(status)}
                              onCheckedChange={() => handleStatusFilterChange(status)}
                            />
                            <Label htmlFor={`status-${status}`} className="text-sm capitalize">
                              {status}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Atribuído a</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["João", "Maria", "Carlos", "Não atribuído"].map(agent => (
                          <div key={agent} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`agent-${agent}`}
                              checked={filterAgents.includes(agent)}
                              onCheckedChange={() => handleAgentFilterChange(agent)}
                            />
                            <Label htmlFor={`agent-${agent}`} className="text-sm">
                              {agent}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setFilterAgents([]);
                        setFilterStatuses([]);
                        setShowPrioritized(false);
                        setSortBy("recent");
                      }}
                    >
                      Limpar filtros
                    </Button>
                    <Button size="sm">Aplicar</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
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
      
      <ScrollArea className="flex-1">
        {sortedContacts.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-center p-4">
            <p className="text-muted-foreground text-sm">
              Nenhuma conversa encontrada com os filtros aplicados
            </p>
          </div>
        ) : (
          <div>
            {viewMode === "list" ? (
              // List view
              sortedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={cn(
                    "p-3 border-b cursor-pointer transition-colors",
                    activeContactId === contact.id 
                      ? "bg-primary/5" 
                      : contact.unreadCount > 0 
                        ? "bg-blue-50/50 hover:bg-muted/70" 
                        : "hover:bg-muted/50"
                  )}
                  onClick={() => onSelectContact(contact)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="relative">
                        <Avatar className={contact.unreadCount > 0 ? "ring-2 ring-primary" : ""}>
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {contact.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className={cn(
                          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                          getStatusColor(contact.status)
                        )} />
                      </div>
                      {contact.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1">
                          <Badge variant="secondary" className="h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-white">
                            {contact.unreadCount}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className={cn(
                          "truncate",
                          contact.unreadCount > 0 ? "font-bold" : "font-medium"
                        )}>
                          {contact.name}
                          {contact.isPriority && (
                            <Star className="inline-flex ml-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                          )}
                        </p>
                        <div className="flex items-center">
                          {contact.agent && (
                            <Avatar className="h-5 w-5 mr-1">
                              <AvatarFallback className="text-[10px] bg-secondary">
                                {contact.agent.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {getTimeAgo(contact.lastActivity)}
                          </span>
                        </div>
                      </div>
                      
                      {contact.lastMessage && (
                        <p className={cn(
                          "text-sm truncate mt-0.5",
                          contact.unreadCount > 0 ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {contact.lastMessage.content.length > 40 
                            ? `${contact.lastMessage.content.substring(0, 40)}...` 
                            : contact.lastMessage.content}
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
                        
                        <div className="ml-auto flex gap-1">
                          {contact.tags && contact.tags.length > 0 && (
                            <div>
                              <Badge variant="outline" className={cn(
                                "text-xs px-1 h-5",
                                contact.tags[0].toLowerCase() === "prioridade" && "bg-yellow-100 border-yellow-200 text-yellow-800"
                              )}>
                                {contact.tags[0]}
                              </Badge>
                              {contact.tags.length > 1 && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  +{contact.tags.length - 1}
                                </span>
                              )}
                            </div>
                          )}
                          {contact.waitingTime && (
                            <div className="flex items-center text-xs">
                              <Clock className="h-3 w-3 text-amber-500 mr-0.5" />
                              <span className="text-amber-600">{contact.waitingTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Card view
              <div className="grid grid-cols-1 gap-2 p-2">
                {sortedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={cn(
                      "rounded-lg border p-3 cursor-pointer transition-all hover:shadow-md",
                      activeContactId === contact.id
                        ? "bg-primary/5 border-primary/30"
                        : contact.unreadCount > 0
                          ? "bg-blue-50/50"
                          : "bg-card"
                    )}
                    onClick={() => onSelectContact(contact)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="relative mr-3">
                          <Avatar>
                            <AvatarImage src={contact.avatar} alt={contact.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {contact.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className={cn(
                            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                            getStatusColor(contact.status)
                          )} />
                          {contact.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1">
                              <Badge variant="secondary" className="h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-white">
                                {contact.unreadCount}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={cn(
                            "font-medium flex items-center",
                            contact.unreadCount > 0 && "font-bold"
                          )}>
                            {contact.name}
                            {contact.isPriority && (
                              <Star className="ml-1 h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                            )}
                          </p>
                          <div className="flex items-center mt-0.5">
                            {contact.company && (
                              <span className="text-xs text-muted-foreground mr-2">{contact.company}</span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {getTimeAgo(contact.lastActivity)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex">
                          {contact.sources.slice(0, 1).map((source) => (
                            <div key={source} className="flex items-center ml-1">
                              {getSourceIcon(source)}
                            </div>
                          ))}
                          {contact.agent && (
                            <Avatar className="h-5 w-5 ml-1">
                              <AvatarFallback className="text-[10px] bg-secondary">
                                {contact.agent.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        {contact.waitingTime && (
                          <div className="flex items-center text-xs mt-1">
                            <Clock className="h-3 w-3 text-amber-500 mr-0.5" />
                            <span className="text-amber-600">{contact.waitingTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {contact.lastMessage && (
                      <p className={cn(
                        "text-sm mt-2 line-clamp-2",
                        contact.unreadCount > 0 ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {contact.lastMessage.content}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-1">
                        {contact.tags && contact.tags.length > 0 && contact.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className={cn(
                            "text-xs",
                            tag.toLowerCase() === "prioridade" && "bg-yellow-100 border-yellow-200 text-yellow-800"
                          )}>
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags && contact.tags.length > 2 && (
                          <span className="text-xs text-muted-foreground">+{contact.tags.length - 2}</span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Star className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Users className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationsSidebar;
