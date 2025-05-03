
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TypingIndicatorProps {
  contact: any;
}

const TypingIndicator = ({ contact }: TypingIndicatorProps) => (
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

export default TypingIndicator;
