
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import ConversationsSidebar from "@/components/conversations/ConversationsSidebar";
import ConversationPanel from "@/components/conversations/ConversationPanel";
import ConversationDetails from "@/components/conversations/ConversationDetails";
import { Contact } from "@/types/crm";

const ConversationsPage = () => {
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-120px)] overflow-hidden bg-background rounded-lg border">
        <ConversationsSidebar 
          onSelectContact={setActiveContact} 
          activeContactId={activeContact?.id} 
        />
        {activeContact ? (
          <>
            <ConversationPanel contact={activeContact} />
            <ConversationDetails contact={activeContact} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-2">Selecione uma conversa</h2>
              <p className="text-muted-foreground">
                Escolha um contato no painel lateral para visualizar a conversa
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ConversationsPage;
