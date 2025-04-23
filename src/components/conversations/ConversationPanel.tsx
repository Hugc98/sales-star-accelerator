
import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Send, Smile, Image, Phone, Video, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Contact, Message } from "@/types/crm";
import { mockMessages } from "@/data/mockData";

interface ConversationPanelProps {
  contact: Contact;
}

const ConversationPanel = ({ contact }: ConversationPanelProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages for the selected contact
  useEffect(() => {
    setMessages(mockMessages.filter(msg => msg.contactId === contact.id));
  }, [contact.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
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
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    
    // Simulate message being sent
    setTimeout(() => {
      setMessages(current => 
        current.map(m => 
          m.id === newMsg.id ? { ...m, status: "delivered" } : m
        )
      );
    }, 1000);
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
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1.5 top-1.5 rounded-full h-7 w-7 p-0"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            disabled={newMessage.trim() === ""} 
            onClick={handleSendMessage} 
            size="icon"
            className="rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationPanel;
