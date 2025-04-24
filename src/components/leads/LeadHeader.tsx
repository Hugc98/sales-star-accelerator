
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LeadHeaderProps {
  onNewLeadClick: () => void;
  onImportClick: () => void;
}

const LeadHeader: React.FC<LeadHeaderProps> = ({ onNewLeadClick, onImportClick }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Leads</h1>
        <p className="text-muted-foreground">
          Gerencie seus leads e oportunidades
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Lead <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onNewLeadClick}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar manualmente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onImportClick}>
            <Upload className="mr-2 h-4 w-4" />
            Importar leads (.csv)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LeadHeader;
