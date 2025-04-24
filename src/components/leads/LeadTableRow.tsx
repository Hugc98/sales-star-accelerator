
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Lead } from "@/types/leads";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Phone, Mail, MessageSquare } from "lucide-react";

interface LeadTableRowProps {
  lead: Lead;
  onMessageClick: (lead: Lead) => void;
  onDeleteClick: (id: string) => void;
  statusColors: Record<string, string>;
}

const LeadTableRow: React.FC<LeadTableRowProps> = ({
  lead,
  onMessageClick,
  onDeleteClick,
  statusColors,
}) => {
  return (
    <TableRow key={lead.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {lead.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{lead.name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={statusColors[lead.status]}>{lead.status}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{lead.email}</TableCell>
      <TableCell className="hidden lg:table-cell">{lead.phone}</TableCell>
      <TableCell className="hidden lg:table-cell">
        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Phone className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => onMessageClick(lead)}
          >
            <Mail className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Alterar status
              </DropdownMenuItem>
              <DropdownMenuItem>
                Adicionar tarefa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir este lead?')) {
                    onDeleteClick(lead.id);
                  }
                }}
              >
                Excluir lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default LeadTableRow;
