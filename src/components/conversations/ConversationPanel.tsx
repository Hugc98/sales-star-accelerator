
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Paperclip, Send, Smile, Image, Phone, Video, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Contact, Message } from "@/types/crm";
import { mockMessages } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

// Constantes de configuração
const MESSAGES_PER_PAGE = 20;
const MAX_MESSAGE_LENGTH = 1000;

interface ConversationPanelProps {
  contact: Contact;
}

const ConversationPanel = ({ contact }: ConversationPanelProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Carregamento segmentado de mensagens para performance
  const loadMessages = useCallback(() => {
    setIsLoading(true);
    
    // Simula carregamento paginado com delay para melhor UX
    setTimeout(() => {
      const filteredMessages = mockMessages.filter(msg => msg.contactId === contact.id);
      const startIndex = 0;
      const endIndex = page * MESSAGES_PER_PAGE;
      
      // Limita o número de mensagens carregadas por vez
      const pagedMessages = filteredMessages.slice(startIndex, endIndex);
      setMessages(pagedMessages);
      
      // Verifica se há mais mensagens para carregar
      setHasMoreMessages(endIndex < filteredMessages.length);
      setIsLoading(false);
    }, 300);
  }, [contact.id, page]);

  // Carrega mensagens quando o contato muda
  useEffect(() => {
    setPage(1); // Reinicia a paginação
    loadMessages();
  }, [contact.id, loadMessages]);

  // Carrega mais mensagens antigas quando solicitado
  const loadMoreMessages = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Scroll para a última mensagem quando mensagens mudam
  useEffect(() => {
    if (!isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Monitoramento de scroll para carregar mais mensagens antigas
  useEffect(() => {
    const container = messagesContainerRef.current;
    
    if (!container) return;
    
    const handleScroll = () => {
      // Se rolar para o topo e tiver mais mensagens, carrega mais
      if (container.scrollTop === 0 && hasMoreMessages && !isLoading) {
        loadMoreMessages();
      }
    };
    
    container.addEventListener('scroll', handleScroll);
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMoreMessages, isLoading]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    // Valida tamanho da mensagem
    if (newMessage.length > MAX_MESSAGE_LENGTH) {
      toast({
        title: "Mensagem muito longa",
        description: `A mensagem não pode exceder ${MAX_MESSAGE_LENGTH} caracteres.`,
        variant: "destructive",
      });
      return;
    }
    
    const newMsg: Message = {
      id: Math.max(0, ...messages.map(m => m.id)) + 1,
      contactId: contact.id,
      type: "text",
      content: newMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sending",
      source: "whatsapp",
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
    
    // Simula envio de mensagem com estado intermediário
    setTimeout(() => {
      setMessages(current => 
        current.map(m => 
          m.id === newMsg.id ? { ...m, status: "delivered" } : m
        )
      );
      
      // Simula confirmação de leitura após um tempo
      setTimeout(() => {
        setMessages(current => 
          current.map(m => 
            m.id === newMsg.id ? { ...m, status: "read" } : m
          )
        );
      }, 3000);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 flex flex-col border-r">
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback>{contact.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{contact.name}</p>
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="h-5 px-1.5">
                {contact.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                via {getSourceIcon(contact.sources[0])}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full md:hidden">
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {isLoading && page > 1 && (
          <div className="text-center py-2">
            <span className="text-xs text-muted-foreground">Carregando mensagens anteriores...</span>
          </div>
        )}
        
        {hasMoreMessages && !isLoading && (
          <div className="text-center py-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadMoreMessages}
              className="text-xs"
            >
              Carregar mensagens anteriores
            </Button>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-t-lg rounded-bl-lg"
                  : "bg-muted rounded-t-lg rounded-br-lg"
              } p-3 space-y-1`}
            >
              {message.type === "text" && <p>{message.content}</p>}
              
              <div className="flex items-center justify-end gap-1 text-xs">
                <span className={message.sender === "user" ? "text-primary-foreground/80" : "text-muted-foreground"}>
                  {formatMessageTime(message.timestamp)}
                </span>
                {message.sender === "user" && (
                  <span>
                    {message.status === "read" ? "✓✓" : message.status === "delivered" ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Image className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Textarea
              placeholder="Digite uma mensagem..."
              className="resize-none min-h-[40px] max-h-[120px] py-2 pr-10 overflow-y-auto"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              maxLength={MAX_MESSAGE_LENGTH}
            />
            <div className="absolute right-1.5 top-1.5 flex gap-1">
              {newMessage.length > MAX_MESSAGE_LENGTH * 0.8 && (
                <span className={`text-xs ${
                  newMessage.length > MAX_MESSAGE_LENGTH ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {newMessage.length}/{MAX_MESSAGE_LENGTH}
                </span>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full h-7 w-7 p-0"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            disabled={newMessage.trim() === "" || newMessage.length > MAX_MESSAGE_LENGTH} 
            onClick={handleSendMessage} 
            size="icon"
            className="rounded-full"
            aria-label="Enviar mensagem"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationPanel;
