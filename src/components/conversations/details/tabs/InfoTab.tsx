
import React, { useState } from "react";
import { Contact } from "@/types/crm";
import { ContactHeader } from "../ContactHeader";
import { ContactInfo } from "../ContactInfo";
import { ContactNotes } from "../ContactNotes";
import { NextActions } from "../NextActions";
import { ProposalsSection } from "../ProposalsSection";
import { RecentActivitiesSection } from "../RecentActivitiesSection";

interface InfoTabProps {
  contact: Contact;
  interactions: any[];
}

export const InfoTab = ({ contact, interactions }: InfoTabProps) => {
  const [showProposals, setShowProposals] = useState(true);
  const [showActivities, setShowActivities] = useState(true);

  return (
    <div className="p-4 space-y-6 m-0">
      <ContactHeader contact={contact} />
      <ContactInfo contact={contact} />
      
      <ProposalsSection 
        showProposals={showProposals} 
        setShowProposals={setShowProposals} 
      />
      
      <RecentActivitiesSection
        showActivities={showActivities}
        setShowActivities={setShowActivities}
        interactions={interactions}
      />
      
      <ContactNotes />
      <NextActions />
    </div>
  );
};
