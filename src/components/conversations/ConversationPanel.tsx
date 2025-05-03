
import React from "react";
import { Contact } from "@/types/crm";
import ConversationHeader from "./chat/ConversationHeader";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import ScrollToBottomButton from "./chat/ScrollToBottomButton";
import { useConversation } from "./chat/useConversation";

interface ConversationPanelProps {
  contact: Contact;
}

const ConversationPanel = ({ contact }: ConversationPanelProps) => {
  const {
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
  } = useConversation(contact);

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ConversationHeader contact={contact} />
      
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 relative"
      >
        <MessageList 
          messageGroups={messageGroups}
          contact={contact}
          isTyping={isTyping}
          isLoading={isLoading}
          page={page}
          hasMoreMessages={hasMoreMessages}
          loadMoreMessages={loadMoreMessages}
          getDateLabel={getDateLabel}
        />
      </div>
      
      <ScrollToBottomButton 
        visible={showScrollToBottom} 
        onClick={scrollToBottom} 
      />
      
      <MessageInput 
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        handleKeyDown={handleKeyDown}
        handleQuickReply={handleQuickReply}
        maxLength={MAX_MESSAGE_LENGTH}
      />
    </div>
  );
};

export default ConversationPanel;
