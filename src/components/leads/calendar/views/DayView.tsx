
import React from 'react';
import { format, isSameDay, parseISO, addHours, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent } from '../LeadCalendar';

interface DayViewProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onEventClick: (event: CalendarEvent) => void;
}

const DayView: React.FC<DayViewProps> = ({ events, selectedDate, onEventClick }) => {
  // Gerar horas do dia (das 8h às 20h)
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);
  
  // Filtrar eventos para o dia selecionado
  const dayEvents = events.filter(event => 
    isSameDay(parseISO(event.startTime), selectedDate)
  );
  
  // Função para calcular posição e altura do evento na grade
  const getEventPosition = (event: CalendarEvent) => {
    const start = parseISO(event.startTime);
    const end = parseISO(event.endTime);
    
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
      {/* Cabeçalho com o dia selecionado */}
      <div className="p-4 text-center border-b">
        <h2 className="text-lg font-medium">
          {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: ptBR })}
        </h2>
      </div>
      
      {/* Grade de horas */}
      <div className="flex flex-1">
        {/* Coluna das horas */}
        <div className="w-20 text-center border-r">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b text-sm font-medium flex items-start justify-center pt-1">
              {`${hour}:00`}
            </div>
          ))}
        </div>
        
        {/* Coluna dos eventos */}
        <div className="flex-1 relative">
          {/* Grade de horas */}
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b"></div>
          ))}
          
          {/* Eventos */}
          {dayEvents.map((event) => {
            const position = getEventPosition(event);
            
            return (
              <div
                key={event.id}
                className="absolute left-0 right-0 mx-2 rounded overflow-hidden cursor-pointer hover:opacity-90"
                style={{
                  top: position.top,
                  height: position.height,
                  backgroundColor: event.color || '#9b87f5',
                }}
                onClick={() => onEventClick(event)}
              >
                <div className="p-2 text-white">
                  {position.isContinued && <div className="text-[11px]">↑ continua de antes</div>}
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm">
                    {format(parseISO(event.startTime), 'HH:mm')} - 
                    {format(parseISO(event.endTime), 'HH:mm')}
                  </div>
                  {event.description && (
                    <div className="text-sm mt-1 opacity-90">{event.description}</div>
                  )}
                  {event.location && (
                    <div className="text-sm mt-1 opacity-90">📍 {event.location}</div>
                  )}
                  {position.willContinue && <div className="text-[11px] mt-1">↓ continua depois</div>}
                </div>
              </div>
            );
          })}
          
          {/* Mensagem se não houver eventos */}
          {dayEvents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              Nenhum evento agendado para este dia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayView;
