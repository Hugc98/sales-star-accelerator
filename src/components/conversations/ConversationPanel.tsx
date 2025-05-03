
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Paperclip, Send, Smile, Image, Phone, Video, Info, ArrowDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Contact, Message } from "@/types/crm";
import { mockMessages } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ActionButtons from "./ActionButtons";
import QuickReplyMenu from "./QuickReplyMenu";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  // Scroll para a última mensagem quando mensagens mudam ou quando novas mensagens são adicionadas
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const shouldScrollToBottom = messagesContainerRef.current && 
        (messagesContainerRef.current.scrollHeight - messagesContainerRef.current.scrollTop <= 
          messagesContainerRef.current.clientHeight + 100);
      
      if (shouldScrollToBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, isLoading]);

  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set the height to scrollHeight to fit content
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [newMessage]);

  // Monitoramento de scroll para carregar mais mensagens antigas
  useEffect(() => {
    const container = messagesContainerRef.current;
    
    if (!container) return;
    
    const handleScroll = () => {
      // Se rolar para o topo e tiver mais mensagens, carrega mais
      if (container.scrollTop === 0 && hasMoreMessages && !isLoading) {
        loadMoreMessages();
      }

      // Show scroll to bottom button when scrolled up
      const isScrolledUp = container.scrollHeight - container.scrollTop > container.clientHeight + 300;
      setShowScrollToBottom(isScrolledUp);
    };
    
    container.addEventListener('scroll', handleScroll);
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMoreMessages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Simulate contact typing
  useEffect(() => {
    // Randomly show typing indicator
    if (messages.length > 0 && Math.random() > 0.7) {
      const timeoutId = setTimeout(() => {
        setIsTyping(true);
        
        // After some random time, add a new message
        const typingDuration = 1000 + Math.random() * 3000;
        const messageTimeoutId = setTimeout(() => {
          setIsTyping(false);
          
          // Add a sample response
          const responses = [
            "Claro, entendi. Vou verificar isso para você.",
            "Obrigado pelas informações. Podemos agendar uma reunião essa semana?",
            "Perfeito! Vou preparar a proposta conforme solicitado.",
            "Entendi suas necessidades. Vou encaminhar para o departamento responsável.",
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          const newMsg: Message = {
            id: Math.max(0, ...messages.map(m => m.id)) + 1,
            contactId: contact.id,
            type: "text",
            content: randomResponse,
            sender: "contact",
            timestamp: new Date().toISOString(),
            status: "read",
            source: "whatsapp",
          };
          
          setMessages(prev => [...prev, newMsg]);
        }, typingDuration);
        
        return () => clearTimeout(messageTimeoutId);
      }, 5000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [contact.id, messages]);

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

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    // Scroll to bottom after sending a message
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = (replyContent: string) => {
    setNewMessage(replyContent);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
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
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if the message is from today
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } 
    // Check if the message is from yesterday
    else if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } 
    // For other dates, show the full date
    else {
      return messageDate.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString('pt-BR');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const getDateLabel = (dateStr: string) => {
    const messageDate = new Date(dateStr.split('/').reverse().join('-'));
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return dateStr;
    }
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full overflow-hidden">
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
      
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 relative"
      >
        {isLoading && page > 1 && (
          <div className="text-center py-2">
            <span className="text-xs text-muted-foreground">Carregando mensagens anteriores...</span>
          </div>
        )}
        
        {hasMoreMessages && !isLoading && (
          <div className="text-center py-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadMoreMessages}
              className="text-xs"
            >
              Carregar mensagens anteriores
            </Button>
          </div>
        )}
        
        {/* Messages grouped by date */}
        {Object.entries(messageGroups).map(([date, msgs]) => (
          <div key={date} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
                {getDateLabel(date)}
              </div>
            </div>
            
            {msgs.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "contact" && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                      {contact.initials}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={cn(
                    "max-w-[75%] sm:max-w-[70%] space-y-1 animate-fade-in",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-t-lg rounded-bl-lg"
                      : "bg-white border rounded-t-lg rounded-br-lg shadow-sm"
                  )}
                >
                  <div className="p-3">
                    {message.type === "text" && <p className="whitespace-pre-line">{message.content}</p>}
                    
                    <div className="flex items-center justify-end gap-1 text-xs mt-1">
                      <span className={message.sender === "user" ? "text-primary-foreground/80" : "text-muted-foreground"}>
                        {formatMessageTime(message.timestamp)}
                      </span>
                      {message.sender === "user" && (
                        <span>
                          {message.status === "read" ? (
                            <div className="text-primary-foreground/80">✓✓</div>
                          ) : message.status === "delivered" ? (
                            <div className="text-primary-foreground/80">✓✓</div>
                          ) : (
                            <div className="text-primary-foreground/80">✓</div>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <Avatar className="h-8 w-8 mr-2 mt-1">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback>{contact.initials}</AvatarFallback>
            </Avatar>
            <div className="bg-white border rounded-lg p-3 py-5 max-w-[70%] min-w-[60px] flex justify-center">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Scroll to bottom button - Always visible when scrolled up */}
      {showScrollToBottom && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          className="absolute bottom-20 right-4 h-10 w-10 rounded-full shadow-lg opacity-90 z-10"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      )}
      
      <div className="border-t p-3 bg-white flex-shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex items-center gap-1 h-8">
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <Paperclip className="h-4 w-4" />
            </Button>
            {!isMobile && (
              <>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Image className="h-4 w-4" />
                </Button>
                <QuickReplyMenu onSelectReply={handleQuickReply} />
              </>
            )}
          </div>
          
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              placeholder="Digite uma mensagem..."
              className="resize-none min-h-[40px] max-h-[120px] py-2 pr-10 overflow-y-auto rounded-2xl"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              maxLength={MAX_MESSAGE_LENGTH}
            />
            <div className="absolute right-1.5 top-1.5 flex gap-1">
              {newMessage.length > MAX_MESSAGE_LENGTH * 0.8 && (
                <span className={cn(
                  "text-xs px-1 rounded bg-background",
                  newMessage.length > MAX_MESSAGE_LENGTH ? 'text-destructive' : 'text-muted-foreground'
                )}>
                  {newMessage.length}/{MAX_MESSAGE_LENGTH}
                </span>
              )}
              {isMobile && (
                <QuickReplyMenu onSelectReply={handleQuickReply} />
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
            className="rounded-full h-10 w-10"
            aria-label="Enviar mensagem"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationPanel;
