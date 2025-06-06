
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Lead } from "@/types/leads";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LeadForm from "@/components/leads/LeadForm";
import LeadImport from "@/components/leads/LeadImport";
import { useLeads } from "@/hooks/use-leads";
import { useLeadMessages } from "@/hooks/use-lead-messages";
import MessageForm from "@/components/leads/messages/MessageForm";
import LeadHeader from "@/components/leads/LeadHeader";
import LeadSearch from "@/components/leads/LeadSearch";
import LeadTable from "@/components/leads/LeadTable";
import { Loader2 } from "lucide-react";

// Status colors reused from the original file
const statusColors: Record<string, string> = {
  novo: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  contatado: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  qualificado: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  negociação: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  fechado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  perdido: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const LeadsPage = () => {
  // Using separate state variables for each dialog to ensure they're independent
  const [leadFormDialogOpen, setLeadFormDialogOpen] = useState<boolean>(false);
  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { leads, isLoading, createLead, updateLeadStatus, deleteLead } = useLeads();
  const { createMessage } = useLeadMessages(selectedLead?.id || '');

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const handleMessageClick = (lead: Lead) => {
    setSelectedLead(lead);
    setMessageDialogOpen(true);
  };

  return (
    <AppLayout>
      <LeadHeader
        onNewLeadClick={() => setLeadFormDialogOpen(true)}
        onImportClick={() => setImportDialogOpen(true)}
      />
      <LeadSearch />
      <LeadTable
        leads={leads}
        onMessageClick={handleMessageClick}
        onDeleteClick={(id) => deleteLead.mutate(id)}
        statusColors={statusColors}
      />
      
      {/* Modal for adding lead manually */}
      <Dialog open={leadFormDialogOpen} onOpenChange={setLeadFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Lead</DialogTitle>
          </DialogHeader>
          <LeadForm 
            onSubmit={(data) => {
              createLead.mutate(data);
              setLeadFormDialogOpen(false);
            }}
            onCancel={() => setLeadFormDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Modal for importing leads */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Importar Leads</DialogTitle>
          </DialogHeader>
          <LeadImport
            onComplete={(count) => {
              setImportDialogOpen(false);
            }}
            onCancel={() => setImportDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal for sending message */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Enviar Mensagem para {selectedLead?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <MessageForm
              onSubmit={(data) => {
                createMessage.mutate({
                  lead_id: selectedLead.id,
                  message: data.message,
                  subject: data.subject,
                  channel: data.channel,
                });
                setMessageDialogOpen(false);
              }}
              onCancel={() => setMessageDialogOpen(false)}
              isSubmitting={createMessage.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default LeadsPage;
