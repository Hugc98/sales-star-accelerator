
import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { CalendarEvent } from '../LeadCalendar';

interface MonthViewProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onEventClick: (event: CalendarEvent) => void;
  onDateChange: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ events, selectedDate, onEventClick, onDateChange }) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = "EEEEEE";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  // Cabeçalho com os dias da semana
  const daysOfWeekHeader = (
    <div className="grid grid-cols-7 gap-px bg-muted">
      {Array.from({ length: 7 }).map((_, i) => {
        const dayOfWeek = format(addDays(startDate, i), dateFormat, { locale: ptBR });
        return (
          <div key={i} className="py-2 px-1 text-center text-sm font-medium">
            {dayOfWeek.toUpperCase()}
          </div>
        );
      })}
    </div>
  );

  // Construir as células do calendário
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;
      const isToday = isSameDay(day, new Date());
      const isSelected = isSameDay(day, selectedDate);
      
      // Filtrar eventos para o dia atual
      const dayEvents = events.filter(event => 
        isSameDay(parseISO(event.startTime), day)
      );

      days.push(
        <div
          key={day.toString()}
          className={`min-h-[100px] p-1 border-t ${
            !isSameMonth(day, monthStart)
              ? "bg-muted/50 text-muted-foreground"
              : isToday
              ? "bg-blue-50"
              : isSelected
              ? "bg-primary/5"
              : ""
          }`}
          onClick={() => onDateChange(cloneDay)}
        >
          <div className="flex justify-between items-start">
            <span
              className={`text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full ${
                isToday
                  ? "bg-primary text-white"
                  : ""
              }`}
            >
              {formattedDate}
            </span>
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded-sm truncate cursor-pointer hover:opacity-80`}
                style={{ backgroundColor: event.color || '#9b87f5', color: 'white' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-muted-foreground text-right">
                + {dayEvents.length - 3} mais
              </div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-px">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="bg-white">
      {daysOfWeekHeader}
      <div className="divide-y">{rows}</div>
    </div>
  );
};

export default MonthView;
