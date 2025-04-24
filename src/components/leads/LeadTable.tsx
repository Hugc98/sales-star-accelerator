
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lead } from "@/types/leads";
import LeadTableRow from "./LeadTableRow";

interface LeadTableProps {
  leads: Lead[];
  onMessageClick: (lead: Lead) => void;
  onDeleteClick: (id: string) => void;
  statusColors: Record<string, string>;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onMessageClick,
  onDeleteClick,
  statusColors,
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lead</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Telefone</TableHead>
            <TableHead className="hidden lg:table-cell">Data</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <LeadTableRow
              key={lead.id}
              lead={lead}
              onMessageClick={onMessageClick}
              onDeleteClick={onDeleteClick}
              statusColors={statusColors}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadTable;
