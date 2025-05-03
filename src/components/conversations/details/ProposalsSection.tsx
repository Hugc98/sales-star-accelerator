
import React from "react";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ProposalsSectionProps {
  showProposals: boolean;
  setShowProposals: (show: boolean) => void;
}

export const ProposalsSection = ({ showProposals, setShowProposals }: ProposalsSectionProps) => {
  const proposals = [
    { 
      id: 1, 
      title: 'Serviço Mensal', 
      date: '15/03/2023', 
      value: 'R$ 1.500,00', 
      status: 'Enviado' 
    },
    { 
      id: 2, 
      title: 'Projeto Website', 
      date: '22/04/2023', 
      value: 'R$ 5.000,00', 
      status: 'Visualizado' 
    }
  ];

  return (
    <Collapsible 
      open={showProposals} 
      onOpenChange={setShowProposals}
      className="border rounded-md"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center p-3">
        <h4 className="text-sm font-medium">Propostas</h4>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          {showProposals ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t px-3 py-2 space-y-2">
          {proposals.map(proposal => (
            <div key={proposal.id} className="flex flex-col border-b pb-2 last:border-0 last:pb-0 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{proposal.title}</span>
                <span>{proposal.value}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{proposal.date}</span>
                <span className="text-blue-600">{proposal.status}</span>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Nova proposta
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
