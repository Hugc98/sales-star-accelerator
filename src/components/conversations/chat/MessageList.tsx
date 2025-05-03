
import React, { useRef } from "react";
import { Message } from "@/types/crm";
import MessageGroup from "./MessageGroup";
import TypingIndicator from "./TypingIndicator";

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

export default MessageList;
