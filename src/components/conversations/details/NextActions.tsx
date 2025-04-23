
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const NextActions = () => {
  return (
    <div className="pt-2">
      <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
        Próximas ações
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </h4>
      <Separator className="mb-3" />
      <div className="space-y-2">
        <div className="bg-muted p-2 rounded-md text-sm flex items-start justify-between">
          <div>
            <p className="font-medium">Enviar proposta comercial</p>
            <p className="text-xs text-muted-foreground">Amanhã às 10:00</p>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="bg-muted p-2 rounded-md text-sm flex items-start justify-between">
          <div>
            <p className="font-medium">Agendar reunião de follow-up</p>
            <p className="text-xs text-muted-foreground">27/04/2023 às 14:00</p>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
