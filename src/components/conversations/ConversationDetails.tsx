
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contact, Interaction } from "@/types/crm";
import { mockInteractions } from "@/data/mockData";
import { TabHeader } from "./details/TabHeader";
import { InfoTab } from "./details/tabs/InfoTab";
import { TimelineTab } from "./details/tabs/TimelineTab";
import { InsightsTab } from "./details/tabs/InsightsTab";

interface ConversationDetailsProps {
  contact: Contact;
}

const ConversationDetails = ({ contact }: ConversationDetailsProps) => {
  const [activeTab, setActiveTab] = useState("info");
  const [interactions, setInteractions] = useState<Interaction[]>(
    mockInteractions.filter(i => i.contactId === contact.id)
  );

  // Update interactions when contact changes
  useEffect(() => {
    setInteractions(mockInteractions.filter(i => i.contactId === contact.id));
  }, [contact.id]);

  return (
    <div className="w-80 bg-white flex flex-col h-full">
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabHeader activeTab={activeTab} onTabChange={setActiveTab} />
        
        <ScrollArea className="flex-1">
          <TabsContent value="info" className="m-0">
            <InfoTab contact={contact} interactions={interactions} />
          </TabsContent>
          
          <TabsContent value="timeline" className="p-0 m-0 h-full">
            <TimelineTab interactions={interactions} contactName={contact.name} />
          </TabsContent>
          
          <TabsContent value="insights" className="m-0">
            <InsightsTab />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default ConversationDetails;
