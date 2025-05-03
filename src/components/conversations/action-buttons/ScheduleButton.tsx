
import React from "react";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

const ScheduleButton = () => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <CalendarClock className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Agendar evento</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ScheduleButton;
