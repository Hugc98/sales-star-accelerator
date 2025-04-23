
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, parseISO, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Plus, CalendarPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EventForm from './EventForm';
import EventDetails from './EventDetails';
import { CalendarViewSelector } from './CalendarViewSelector';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import DayView from './views/DayView';
import WeekView from './views/WeekView';
import MonthView from './views/MonthView';

// Tipos
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  location?: string;
  leadId?: number;
  leadName?: string;
  attendees: {
    id: string;
    name: string;
    email: string;
    status: 'accepted' | 'pending' | 'declined';
    type: 'team' | 'lead' | 'other';
  }[];
  color?: string;
  type: 'meeting' | 'task' | 'reminder' | 'deadline';
  syncWithGoogle?: boolean;
}

// Eventos de exemplo
const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Reunião com Fernanda',
    description: 'Apresentação da proposta comercial',
    startTime: '2025-04-23T10:00:00',
    endTime: '2025-04-23T11:00:00',
    location: 'Google Meet',
    leadId: 1,
    leadName: 'Fernanda Carvalho',
    attendees: [
      { id: 'u1', name: 'Ana Silva', email: 'ana@example.com', status: 'accepted', type: 'team' },
      { id: 'l1', name: 'Fernanda Carvalho', email: 'fernanda@example.com', status: 'pending', type: 'lead' }
    ],
    color: '#9b87f5',
    type: 'meeting',
    syncWithGoogle: true
  },
  {
    id: '2',
    title: 'Follow-up com Ricardo',
    description: 'Verificar feedback da proposta',
    startTime: '2025-04-24T14:30:00',
    endTime: '2025-04-24T15:00:00',
    leadId: 2,
    leadName: 'Ricardo Mendes',
    attendees: [
      { id: 'u2', name: 'Bruno Costa', email: 'bruno@example.com', status: 'accepted', type: 'team' }
    ],
    color: '#33C3F0',
    type: 'task',
    syncWithGoogle: false
  },
  {
    id: '3',
    title: 'Enviar orçamento atualizado',
    description: 'Incluir desconto de 10% conforme negociado',
    startTime: '2025-04-25T09:00:00',
    endTime: '2025-04-25T09:30:00',
    leadId: 3,
    leadName: 'Juliana Costa',
    attendees: [],
    color: '#7E69AB',
    type: 'task',
    syncWithGoogle: false
  }
];

const LeadCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const { toast } = useToast();

  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Math.random().toString(36).substring(2, 9)
    };
    
    setEvents([...events, newEvent]);
    setIsEventFormOpen(false);
    
    toast({
      title: 'Evento adicionado',
      description: `"${event.title}" foi adicionado com sucesso ao calendário.`,
    });
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseEventDetails = () => {
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    setSelectedEvent(null);
    
    toast({
      title: 'Evento removido',
      description: 'O evento foi removido com sucesso.',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setSelectedDate(new Date())}>
            Hoje
          </Button>
          <Button variant="outline" size="icon" onClick={() => view === 'month' ? setSelectedDate(subMonths(selectedDate, 1)) : setSelectedDate(addDays(selectedDate, -7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => view === 'month' ? setSelectedDate(addMonths(selectedDate, 1)) : setSelectedDate(addDays(selectedDate, 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {format(selectedDate, view === 'month' ? 'MMMM yyyy' : view === 'week' ? "'Semana de' d 'de' MMMM" : 'd MMMM yyyy', { locale: ptBR })}
          </h2>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CalendarViewSelector view={view} onChange={setView} />
          <Button onClick={() => setIsEventFormOpen(true)} className="ml-auto sm:ml-0">
            <CalendarPlus className="mr-2 h-4 w-4" /> Novo Evento
          </Button>
        </div>
      </div>
      
      <div className="bg-white border rounded-md">
        {view === 'month' && (
          <MonthView 
            events={events} 
            selectedDate={selectedDate}
            onEventClick={handleEventClick}
            onDateChange={setSelectedDate}
          />
        )}
        
        {view === 'week' && (
          <WeekView 
            events={events} 
            selectedDate={selectedDate}
            onEventClick={handleEventClick}
          />
        )}
        
        {view === 'day' && (
          <DayView 
            events={events} 
            selectedDate={selectedDate}
            onEventClick={handleEventClick}
          />
        )}
      </div>
      
      {/* Modal para adicionar evento */}
      <Dialog open={isEventFormOpen} onOpenChange={setIsEventFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Evento</DialogTitle>
          </DialogHeader>
          <EventForm 
            onSubmit={handleAddEvent}
            onCancel={() => setIsEventFormOpen(false)}
            initialDate={selectedDate}
          />
        </DialogContent>
      </Dialog>
      
      {/* Modal para detalhes do evento */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={handleCloseEventDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalhes do Evento</DialogTitle>
            </DialogHeader>
            <EventDetails 
              event={selectedEvent}
              onClose={handleCloseEventDetails}
              onDelete={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LeadCalendar;
