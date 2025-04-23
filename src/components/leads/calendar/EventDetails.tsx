
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, Users, Trash, Edit, ExternalLink, Mail, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarEvent } from './LeadCalendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface EventDetailsProps {
  event: CalendarEvent;
  onClose: () => void;
  onDelete: () => void;
}

// Mapear tipos de eventos para seus rótulos em português
const eventTypeLabels: Record<string, string> = {
  'meeting': 'Reunião',
  'task': 'Tarefa',
  'reminder': 'Lembrete',
  'deadline': 'Prazo'
};

const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose, onDelete }) => {
  const startDate = parseISO(event.startTime);
  const endDate = parseISO(event.endTime);
  
  // Estado para controlar o diálogo de confirmação de exclusão
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              className="font-normal"
              style={{ 
                backgroundColor: event.color || '#9b87f5',
                color: 'white' 
              }}
            >
              {eventTypeLabels[event.type]}
            </Badge>
            
            {event.syncWithGoogle && (
              <Badge variant="outline" className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="h-3 w-3">
                  <path fill="#4285F4" d="M21.56 10.738c-.145-.681-.382-1.336-.693-1.946H12v3.767h5.362a4.57 4.57 0 01-1.983 3.016v2.499h3.196c1.873-1.726 2.955-4.265 2.985-7.336z"/>
                  <path fill="#34A853" d="M12 22c2.7 0 4.964-.895 6.617-2.417l-3.196-2.5c-.924.598-2.01.966-3.42.966-2.621 0-4.84-1.77-5.631-4.153H3.06v2.59A9.996 9.996 0 0012 22z"/>
                  <path fill="#FBBC05" d="M6.369 13.896A5.988 5.988 0 016 12c0-.659.133-1.293.369-1.896V7.513H3.06A9.996 9.996 0 002 12c0 1.614.386 3.142 1.06 4.487l3.309-2.59z"/>
                  <path fill="#EA4335" d="M12 5.85c1.466 0 2.792.504 3.832 1.495l2.837-2.837C16.954 2.92 14.69 2 12 2A9.996 9.996 0 003.06 7.513l3.309 2.591C7.16 7.62 9.38 5.85 12 5.85z"/>
                </svg>
                Google Calendar
              </Badge>
            )}
          </div>
          
          <h2 className="text-xl font-semibold">{event.title}</h2>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Informações de data e hora */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="font-medium">
              {format(startDate, "EEEE',' d 'de' MMMM", { locale: ptBR })}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(startDate, "HH:mm", { locale: ptBR })} - {format(endDate, "HH:mm", { locale: ptBR })}
            </div>
          </div>
        </div>
        
        {/* Local */}
        {event.location && (
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>{event.location}</div>
          </div>
        )}
      </div>
      
      {/* Descrição */}
      {event.description && (
        <div className="bg-muted/50 p-3 rounded-md">
          {event.description}
        </div>
      )}
      
      {/* Lead relacionado */}
      {event.leadId && event.leadName && (
        <div className="border rounded-md p-3">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <User className="h-4 w-4" /> Lead relacionado
          </h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt={event.leadName} />
                <AvatarFallback>{event.leadName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{event.leadName}</div>
                <div className="text-sm text-muted-foreground">ID #{event.leadId}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Participantes */}
      {event.attendees && event.attendees.length > 0 && (
        <div className="border rounded-md p-3">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Users className="h-4 w-4" /> Participantes ({event.attendees.length})
          </h3>
          <div className="space-y-3">
            {event.attendees.map((attendee) => (
              <div key={attendee.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{attendee.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{attendee.name}</div>
                    <div className="text-xs text-muted-foreground">{attendee.email}</div>
                  </div>
                </div>
                <Badge 
                  variant={
                    attendee.status === 'accepted' ? 'default' : 
                    attendee.status === 'declined' ? 'destructive' : 'outline'
                  }
                  className="text-[10px] h-5"
                >
                  {attendee.status === 'accepted' ? 'Confirmado' :
                   attendee.status === 'declined' ? 'Recusado' : 'Pendente'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end gap-2 pt-4">
        {event.syncWithGoogle && (
          <Button variant="outline" className="gap-1">
            <ExternalLink className="h-4 w-4" />
            Ver no Google Calendar
          </Button>
        )}
        <Button variant="default" onClick={onClose}>
          Fechar
        </Button>
      </div>
      
      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDelete();
                setShowDeleteConfirm(false);
              }}
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetails;
