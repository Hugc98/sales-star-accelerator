
import React from "react";
import { Message } from "@/types/crm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
  contact: any;
}

const MessageItem = ({ message, contact }: MessageItemProps) => {
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

  return (
    <div
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
  );
};

export default MessageItem;
