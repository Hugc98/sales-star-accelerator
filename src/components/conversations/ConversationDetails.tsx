
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Contact, Interaction } from "@/types/crm";
import { mockInteractions } from "@/data/mockData";
import { ContactHeader } from "./details/ContactHeader";
import { ContactInfo } from "./details/ContactInfo";
import { ContactNotes } from "./details/ContactNotes";
import { NextActions } from "./details/NextActions";
import { InteractionTimeline } from "./details/InteractionTimeline";

interface ConversationDetailsProps {
  contact: Contact;
}

const ConversationDetails = ({ contact }: ConversationDetailsProps) => {
  const [activeTab, setActiveTab] = useState("info");
  const [interactions, setInteractions] = useState<Interaction[]>(
    mockInteractions.filter(i => i.contactId === contact.id)
  );

  // Update interactions when contact changes
  React.useEffect(() => {
    setInteractions(mockInteractions.filter(i => i.contactId === contact.id));
  }, [contact.id]);

  return (
    <div className="w-80 bg-background flex flex-col h-full">
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-3 border-b">
          <TabsList>
            <TabsTrigger value="info">Detalhes</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          <Button variant="ghost" size="icon" className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="info" className="p-4 space-y-6 m-0">
            <ContactHeader contact={contact} />
            <ContactInfo contact={contact} />
            <ContactNotes />
            <NextActions />
          </TabsContent>
          
          <TabsContent value="timeline" className="p-0 m-0 h-full">
            <div className="p-4 border-b">
              <h3 className="font-medium mb-1">Timeline de interações</h3>
              <p className="text-sm text-muted-foreground">
                Histórico completo de comunicações com {contact.name}
              </p>
            </div>
            
            <div className="p-4">
              <InteractionTimeline interactions={interactions} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ConversationDetails;
