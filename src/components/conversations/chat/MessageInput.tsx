
import React, { useRef, useEffect } from "react";
import { Paperclip, Send, Smile, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import QuickReplyMenu from "../QuickReplyMenu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleQuickReply: (content: string) => void;
  maxLength: number;
}

const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleKeyDown,
  handleQuickReply,
  maxLength,
}: MessageInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [newMessage]);

  return (
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
            maxLength={maxLength}
          />
          <div className="absolute right-1.5 top-1.5 flex gap-1">
            {newMessage.length > maxLength * 0.8 && (
              <span className={cn(
                "text-xs px-1 rounded bg-background",
                newMessage.length > maxLength ? 'text-destructive' : 'text-muted-foreground'
              )}>
                {newMessage.length}/{maxLength}
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
          disabled={newMessage.trim() === "" || newMessage.length > maxLength} 
          onClick={handleSendMessage} 
          size="icon"
          className="rounded-full h-10 w-10"
          aria-label="Enviar mensagem"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
