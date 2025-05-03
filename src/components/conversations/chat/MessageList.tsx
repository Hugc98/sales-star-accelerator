
import React, { useRef } from "react";
import { Message } from "@/types/crm";
import MessageGroup from "./MessageGroup";

interface MessageListProps {
  messageGroups: { [key: string]: Message[] };
  contact: any;
  isTyping: boolean;
  isLoading: boolean;
  page: number;
  hasMoreMessages: boolean;
  loadMoreMessages: () => void;
  getDateLabel: (dateStr: string) => string;
}

const MessageList = ({
  messageGroups,
  contact,
  isTyping,
  isLoading,
  page,
  hasMoreMessages,
  loadMoreMessages,
  getDateLabel,
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {isLoading && page > 1 && (
        <div className="text-center py-2">
          <span className="text-xs text-muted-foreground">Carregando mensagens anteriores...</span>
        </div>
      )}
      
      {hasMoreMessages && !isLoading && (
        <div className="text-center py-2">
          <button 
            className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
            onClick={loadMoreMessages}
          >
            Carregar mensagens anteriores
          </button>
        </div>
      )}
      
      {/* Messages grouped by date */}
      {Object.entries(messageGroups).map(([date, msgs]) => (
        <MessageGroup 
          key={date} 
          date={date} 
          messages={msgs}
          contact={contact}
          getDateLabel={getDateLabel}
        />
      ))}
      
      {/* Typing indicator */}
      {isTyping && (
        <TypingIndicator contact={contact} />
      )}
      
      <div ref={messagesEndRef} />
    </>
  );
};

// Typing indicator component extracted for cleaner code
const TypingIndicator = ({ contact }: { contact: any }) => (
  <div className="flex justify-start">
    <div className="flex items-start">
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
  </div>
);

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default MessageList;
