
import { CalendarPlus, Plus, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const NextActions = () => {
  return (
    <div className="pt-2">
      <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
        <span>Próximas ações</span>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-7 gap-1">
            <CalendarPlus className="h-3.5 w-3.5" />
            <span>Agendar</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </h4>
      <Separator className="mb-3" />
      <div className="space-y-2">
        <div className="bg-muted p-2 rounded-md text-sm flex items-start justify-between group">
          <div>
            <div className="flex items-center gap-1">
              <p className="font-medium">Enviar proposta comercial</p>
              <Badge priority="high" />
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Amanhã às 10:00</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2 opacity-0 group-hover:opacity-100">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="bg-muted p-2 rounded-md text-sm flex items-start justify-between group">
          <div>
            <div className="flex items-center gap-1">
              <p className="font-medium">Agendar reunião de follow-up</p>
              <Badge priority="medium" />
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">27/04/2023 às 14:00</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2 opacity-0 group-hover:opacity-100">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Priority badge component for visual indicators
interface BadgeProps {
  priority: 'low' | 'medium' | 'high';
}

const Badge = ({ priority }: BadgeProps) => {
  return (
    <span className={cn(
      "inline-block h-2 w-2 rounded-full",
      priority === 'high' && "bg-destructive",
      priority === 'medium' && "bg-amber-500",
      priority === 'low' && "bg-blue-500"
    )} />
  );
};
