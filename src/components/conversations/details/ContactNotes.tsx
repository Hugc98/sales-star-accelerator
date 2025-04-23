
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const ContactNotes = () => {
  return (
    <div className="pt-2">
      <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
        Notas
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Edit className="h-4 w-4" />
        </Button>
      </h4>
      <Separator className="mb-3" />
      <p className="text-sm text-muted-foreground">
        Cliente interessado em planos empresariais. Agendar reunião para próxima semana.
      </p>
    </div>
  );
};
