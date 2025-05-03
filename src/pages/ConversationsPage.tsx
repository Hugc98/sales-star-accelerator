
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import ConversationsSidebar from "@/components/conversations/ConversationsSidebar";
import ConversationPanel from "@/components/conversations/ConversationPanel";
import ConversationDetails from "@/components/conversations/ConversationDetails";
import { Contact } from "@/types/crm";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ConversationsPage = () => {
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("messages");
  const isMobile = useIsMobile();

  // Reset to messages tab when contact changes on mobile
  useEffect(() => {
    if (isMobile && activeContact) {
      setActiveTab("messages");
    }
  }, [activeContact, isMobile]);

  const toggleDetails = () => {
    setDetailsExpanded(!detailsExpanded);
  };

  // Handle going back to contact list on mobile
  const handleBackToList = () => {
    setActiveContact(null);
  };

  const renderMobileView = () => {
    if (!activeContact) {
      return (
        <ConversationsSidebar 
          onSelectContact={setActiveContact} 
          activeContactId={activeContact?.id} 
        />
      );
    }

    return (
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex flex-col h-full w-full"
      >
        <div className="flex items-center justify-between border-b p-2">
          <TabsList className="grid w-[260px] grid-cols-2">
            <TabsTrigger value="messages">Conversa</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToList}
            className="rounded-full h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <TabsContent value="messages" className="flex-1 m-0 h-full overflow-hidden">
          <ConversationPanel contact={activeContact} />
        </TabsContent>
        
        <TabsContent value="details" className="flex-1 m-0 h-full overflow-hidden">
          <ConversationDetails contact={activeContact} />
        </TabsContent>
      </Tabs>
    );
  };

  const renderDesktopView = () => {
    return (
      <div className="flex h-full w-full">
        <ConversationsSidebar 
          onSelectContact={setActiveContact} 
          activeContactId={activeContact?.id} 
          className="h-full w-[300px] flex-shrink-0"
        />
        {activeContact ? (
          <div className="flex flex-1 overflow-hidden relative">
            <div className={`flex-1 ${detailsExpanded ? 'w-[calc(100%-300px)]' : 'w-full'} overflow-hidden`}>
              <ConversationPanel contact={activeContact} />
            </div>
            {detailsExpanded && (
              <div className="w-[300px] flex-shrink-0 border-l overflow-auto">
                <ConversationDetails contact={activeContact} />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDetails}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-background border border-r-0 rounded-l-lg rounded-r-none h-12"
              style={{ right: detailsExpanded ? '300px' : '0' }}
            >
              {detailsExpanded ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
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
    );
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-120px)] overflow-hidden bg-background rounded-lg border relative">
        {isMobile ? renderMobileView() : renderDesktopView()}
      </div>
    </AppLayout>
  );
};

export default ConversationsPage;
