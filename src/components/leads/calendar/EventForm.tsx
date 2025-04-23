
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { format, addHours, addMinutes } from "date-fns";
import { CalendarEvent } from "./LeadCalendar";
import { CheckIcon, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Exemplos de leads para a lista de seleção
const leads = [
  { id: 1, name: "Fernanda Carvalho", company: "Tech Solutions Ltda" },
  { id: 2, name: "Ricardo Mendes", company: "Inovação Digital S.A." },
  { id: 3, name: "Juliana Costa", company: "Estrela Marketing" },
  { id: 4, name: "Marcos Oliveira", company: "Soluções Empresariais" },
  { id: 5, name: "Patricia Santos", company: "Gráfica Moderna" },
];

// Exemplos de membros da equipe para a lista de seleção
const teamMembers = [
  { id: 'u1', name: 'Ana Silva', email: 'ana@example.com' },
  { id: 'u2', name: 'Bruno Costa', email: 'bruno@example.com' },
  { id: 'u3', name: 'Carlos Mendes', email: 'carlos@example.com' },
  { id: 'u4', name: 'Diana Oliveira', email: 'diana@example.com' },
  { id: 'u5', name: 'Eduardo Santos', email: 'eduardo@example.com' },
];

// Cores para os eventos
const eventColors = [
  { name: 'Roxo', value: '#9b87f5' },
  { name: 'Azul', value: '#33C3F0' },
  { name: 'Verde', value: '#27ae60' },
  { name: 'Laranja', value: '#f39c12' },
  { name: 'Vermelho', value: '#e74c3c' },
  { name: 'Cinza', value: '#7f8c8d' },
];

const eventFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  startDate: z.date(),
  startTime: z.string().regex(/\d{2}:\d{2}/, "Formato de hora inválido"),
  endDate: z.date(),
  endTime: z.string().regex(/\d{2}:\d{2}/, "Formato de hora inválido"),
  location: z.string().optional(),
  leadId: z.number().optional(),
  type: z.enum(["meeting", "task", "reminder", "deadline"]),
  color: z.string(),
  syncWithGoogle: z.boolean().default(false),
  notifyAttendees: z.boolean().default(false),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  onSubmit: (event: Omit<CalendarEvent, "id">) => void;
  onCancel: () => void;
  initialDate?: Date;
}

const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  onCancel,
  initialDate = new Date(),
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<typeof teamMembers>([]);
  const [showLeadSearch, setShowLeadSearch] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: initialDate,
      startTime: format(initialDate, "HH:mm"),
      endDate: initialDate,
      endTime: format(addHours(initialDate, 1), "HH:mm"),
      location: "",
      type: "meeting",
      color: '#9b87f5',
      syncWithGoogle: true,
      notifyAttendees: true,
    },
  });

  const handleFormSubmit = (data: EventFormValues) => {
    // Combinar data e hora para criar timestamps ISO
    const startTime = new Date(data.startDate);
    const [startHours, startMinutes] = data.startTime.split(':').map(Number);
    startTime.setHours(startHours, startMinutes);
    
    const endTime = new Date(data.endDate);
    const [endHours, endMinutes] = data.endTime.split(':').map(Number);
    endTime.setHours(endHours, endMinutes);
    
    // Encontrar o lead selecionado
    const selectedLead = leads.find(lead => lead.id === selectedLeadId);
    
    // Criar lista de participantes
    const attendees = [
      ...selectedTeamMembers.map(member => ({
        id: member.id,
        name: member.name,
        email: member.email,
        status: 'accepted' as const,
        type: 'team' as const
      })),
      ...(selectedLead ? [{
        id: `lead-${selectedLead.id}`,
        name: selectedLead.name,
        email: `${selectedLead.name.toLowerCase().replace(' ', '.')}@example.com`,
        status: 'pending' as const,
        type: 'lead' as const
      }] : [])
    ];
    
    const event: Omit<CalendarEvent, "id"> = {
      title: data.title,
      description: data.description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      location: data.location,
      leadId: selectedLeadId || undefined,
      leadName: selectedLead?.name,
      attendees,
      color: data.color,
      type: data.type,
      syncWithGoogle: data.syncWithGoogle,
    };
    
    onSubmit(event);
  };

  const toggleTeamMember = (member: typeof teamMembers[0]) => {
    if (selectedTeamMembers.some(m => m.id === member.id)) {
      setSelectedTeamMembers(selectedTeamMembers.filter(m => m.id !== member.id));
    } else {
      setSelectedTeamMembers([...selectedTeamMembers, member]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Reunião com cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "P")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de início</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de término</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "P")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de término</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalhes sobre o evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local</FormLabel>
              <FormControl>
                <Input placeholder="Escritório, Google Meet, Zoom, etc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div>
            <FormLabel>Lead relacionado (opcional)</FormLabel>
            <Popover open={showLeadSearch} onOpenChange={setShowLeadSearch}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={showLeadSearch}
                  className="w-full justify-between"
                >
                  {selectedLeadId
                    ? leads.find((lead) => lead.id === selectedLeadId)?.name
                    : "Selecionar um lead"}
                  <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar lead..." />
                  <CommandEmpty>Nenhum lead encontrado.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {leads.map((lead) => (
                      <CommandItem
                        key={lead.id}
                        value={lead.name}
                        onSelect={() => {
                          setSelectedLeadId(lead.id === selectedLeadId ? null : lead.id);
                          setShowLeadSearch(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedLeadId === lead.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div>
                          <p>{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.company}</p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <FormLabel>Participantes da equipe</FormLabel>
            <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`member-${member.id}`}
                    checked={selectedTeamMembers.some(m => m.id === member.id)}
                    onChange={() => toggleTeamMember(member)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`member-${member.id}`} className="text-sm flex-grow">
                    {member.name}
                  </label>
                  <span className="text-xs text-muted-foreground">{member.email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de evento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="meeting">Reunião</SelectItem>
                    <SelectItem value="task">Tarefa</SelectItem>
                    <SelectItem value="reminder">Lembrete</SelectItem>
                    <SelectItem value="deadline">Prazo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {eventColors.map(color => (
                      <SelectItem value={color.value} key={color.value}>
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2" 
                            style={{ backgroundColor: color.value }}
                          ></div>
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="syncWithGoogle"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Sincronizar com Google Calendar</FormLabel>
                  <FormDescription>
                    Adicionar este evento também ao Google Calendar
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notifyAttendees"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Notificar participantes</FormLabel>
                  <FormDescription>
                    Enviar notificações por email/WhatsApp aos participantes
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar Evento
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
