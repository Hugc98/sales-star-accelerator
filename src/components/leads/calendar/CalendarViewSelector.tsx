
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, LayoutGrid, List } from "lucide-react";

interface CalendarViewSelectorProps {
  view: 'day' | 'week' | 'month';
  onChange: (view: 'day' | 'week' | 'month') => void;
}

export const CalendarViewSelector: React.FC<CalendarViewSelectorProps> = ({
  view,
  onChange
}) => {
  return (
    <div className="flex border rounded-md overflow-hidden">
      <Button
        variant={view === 'day' ? 'default' : 'ghost'}
        className={`rounded-none ${view === 'day' ? '' : 'hover:bg-muted'}`}
        size="sm"
        onClick={() => onChange('day')}
      >
        <List className="h-4 w-4 mr-2" />
        Dia
      </Button>
      <Button
        variant={view === 'week' ? 'default' : 'ghost'}
        className={`rounded-none ${view === 'week' ? '' : 'hover:bg-muted'}`}
        size="sm"
        onClick={() => onChange('week')}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Semana
      </Button>
      <Button
        variant={view === 'month' ? 'default' : 'ghost'}
        className={`rounded-none ${view === 'month' ? '' : 'hover:bg-muted'}`}
        size="sm"
        onClick={() => onChange('month')}
      >
        <Calendar className="h-4 w-4 mr-2" />
        Mês
      </Button>
    </div>
  );
};
