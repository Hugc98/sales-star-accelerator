
import React from 'react';
import { format, startOfWeek, endOfWeek, addDays, isSameDay, parseISO, addHours, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent } from '../LeadCalendar';

interface WeekViewProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onEventClick: (event: CalendarEvent) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ events, selectedDate, onEventClick }) => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
  
  // Gerar horas do dia (das 8h às 20h)
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);
  
  // Gerar dias da semana
  const daysOfWeek = [];
  let day = weekStart;
  while (day <= weekEnd) {
    daysOfWeek.push(day);
    day = addDays(day, 1);
  }

  // Posicionar um evento na grade
  const getEventPosition = (event: CalendarEvent, dayDate: Date) => {
    const start = parseISO(event.startTime);
    const end = parseISO(event.endTime);
    
    // Verificar se o evento é neste dia
    if (!isSameDay(start, dayDate)) return null;
    
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    
    // Se o evento começar antes das 8h, ajustar para 8h
    const displayStartHour = Math.max(8, startHour);
    // Se o evento terminar depois das 20h, ajustar para 20h
    const displayEndHour = Math.min(20, endHour);
    
    // Calcular posição e altura
    const top = (displayStartHour - 8) * 60; // 60px por hora
    const height = (displayEndHour - displayStartHour) * 60;
    
    return {
      top: `${top}px`,
      height: `${Math.max(30, height)}px`, // Garantir uma altura mínima
      isContinued: startHour < 8, // Evento continuado de antes das 8h
      willContinue: endHour > 20 // Evento continua depois das 20h
    };
  };

  return (
    <div className="flex flex-col">
      {/* Cabeçalho com os dias da semana */}
      <div className="grid grid-cols-8 border-b">
        <div className="p-2 text-center border-r font-medium"></div>
        {daysOfWeek.map((date, i) => {
          const isToday = isSameDay(date, new Date());
          return (
            <div 
              key={i} 
              className={`p-2 text-center border-r last:border-r-0 ${
                isToday ? "bg-blue-50" : ""
              }`}
            >
              <div className="font-medium">{format(date, 'EEEE', { locale: ptBR })}</div>
              <div 
                className={`text-sm inline-flex h-7 w-7 items-center justify-center rounded-full ${
                  isToday ? "bg-primary text-white" : ""
                }`}
              >
                {format(date, 'd')}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Grade de horas e eventos */}
      <div className="grid grid-cols-8 relative min-h-[700px] divide-x">
        {/* Coluna das horas */}
        <div className="text-center">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b text-sm font-medium flex items-start justify-center pt-1">
              {`${hour}:00`}
            </div>
          ))}
        </div>
        
        {/* Colunas dos dias */}
        {daysOfWeek.map((dayDate, dayIndex) => {
          // Filtrar eventos para este dia
          const dayEvents = events.filter(event => 
            isSameDay(parseISO(event.startTime), dayDate)
          );
          
          return (
            <div key={dayIndex} className="relative">
              {/* Grade de horas */}
              {hours.map((hour) => (
                <div key={hour} className="h-[60px] border-b"></div>
              ))}
              
              {/* Eventos */}
              {dayEvents.map((event) => {
                const position = getEventPosition(event, dayDate);
                if (!position) return null;
                
                return (
                  <div
                    key={event.id}
                    className="absolute left-0 right-0 mx-1 rounded overflow-hidden cursor-pointer hover:opacity-90"
                    style={{
                      top: position.top,
                      height: position.height,
                      backgroundColor: event.color || '#9b87f5',
                    }}
                    onClick={() => onEventClick(event)}
                  >
                    <div className="p-1 text-white text-xs">
                      {position.isContinued && <div className="text-[10px]">↑ continua</div>}
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="truncate">
                        {format(parseISO(event.startTime), 'HH:mm')} - 
                        {format(parseISO(event.endTime), 'HH:mm')}
                      </div>
                      {position.willContinue && <div className="text-[10px]">↓ continua</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
