
import React from "react";
import { Message } from "@/types/crm";
import MessageItem from "./MessageItem";

interface MessageGroupProps {
  date: string;
  messages: Message[];
  contact: any;
  getDateLabel: (dateStr: string) => string;
}

const MessageGroup = ({ date, messages, contact, getDateLabel }: MessageGroupProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-4">
        <div className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
          {getDateLabel(date)}
        </div>
      </div>
      
      {messages.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          contact={contact} 
        />
      ))}
    </div>
  );
};

export default MessageGroup;
