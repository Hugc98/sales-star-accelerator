
import { useState, useEffect, useCallback, useRef } from "react";
import { Contact, Message } from "@/types/crm";
import { mockMessages } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

// Constants
const MESSAGES_PER_PAGE = 20;
const MAX_MESSAGE_LENGTH = 1000;

export const useConversation = (contact: Contact) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load messages based on contact and page
  const loadMessages = useCallback(() => {
    setIsLoading(true);
    
    // Simulate paginated loading with delay for better UX
    setTimeout(() => {
      const filteredMessages = mockMessages.filter(msg => msg.contactId === contact.id);
      const startIndex = 0;
      const endIndex = page * MESSAGES_PER_PAGE;
      
      // Limit the number of loaded messages per page
      const pagedMessages = filteredMessages.slice(startIndex, endIndex);
      setMessages(pagedMessages);
      
      // Check if there are more messages to load
      setHasMoreMessages(endIndex < filteredMessages.length);
      setIsLoading(false);
    }, 300);
  }, [contact.id, page]);

  // Load more messages when requested
  const loadMoreMessages = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Reset and load messages when contact changes
  useEffect(() => {
    setPage(1); // Reset pagination
    loadMessages();
  }, [contact.id, loadMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const container = messagesContainerRef.current;
      if (container) {
        const shouldScrollToBottom = container.scrollHeight - container.scrollTop <= 
          container.clientHeight + 100;
        
        if (shouldScrollToBottom) {
          scrollToBottom();
        }
      }
    }
  }, [messages, isLoading]);

  // Monitor scroll to show/hide scroll to bottom button
  useEffect(() => {
    const container = messagesContainerRef.current;
    
    if (!container) return;
    
    const handleScroll = () => {
      // Load more messages when scrolled to top
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

  // Simulate contact typing and response
  useEffect(() => {
    if (messages.length > 0 && Math.random() > 0.7) {
      const timeoutId = setTimeout(() => {
        setIsTyping(true);
        
        const typingDuration = 1000 + Math.random() * 3000;
        const messageTimeoutId = setTimeout(() => {
          setIsTyping(false);
          
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

  // Send new message
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    // Validate message length
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
    
    // Simulate message sending with intermediate states
    setTimeout(() => {
      setMessages(current => 
        current.map(m => 
          m.id === newMsg.id ? { ...m, status: "delivered" } : m
        )
      );
      
      // Simulate read confirmation after some time
      setTimeout(() => {
        setMessages(current => 
          current.map(m => 
            m.id === newMsg.id ? { ...m, status: "read" } : m
          )
        );
      }, 3000);
    }, 1000);
    
    // Scroll to bottom after sending
    setTimeout(scrollToBottom, 100);
  };

  // Handle keyboard shortcuts for sending messages
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle quick reply selection
  const handleQuickReply = (replyContent: string) => {
    setNewMessage(replyContent);
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Group messages by date for better display
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

  // Format date labels for message groups
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

  // Return all necessary conversation state and handlers
  return {
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    isTyping,
    showScrollToBottom,
    page,
    hasMoreMessages,
    messagesContainerRef,
    messagesEndRef,
    groupMessagesByDate,
    getDateLabel,
    loadMoreMessages,
    handleSendMessage,
    handleKeyDown,
    handleQuickReply,
    scrollToBottom,
    MAX_MESSAGE_LENGTH,
  };
};
