
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface LeadMessage {
  id: string;
  lead_id: string;
  subject: string | null;
  message: string;
  channel: string;
  status: string;
  created_at: string;
  sent_at: string | null;
}

interface CreateLeadMessageInput {
  lead_id: string;
  subject?: string;
  message: string;
  channel: string;
}

export function useLeadMessages(leadId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['lead-messages', leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_messages')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lead messages:', error);
        toast({
          title: 'Erro ao carregar mensagens',
          description: 'Não foi possível carregar o histórico de mensagens.',
          variant: 'destructive',
        });
        return [];
      }

      return data as LeadMessage[];
    },
  });

  const createMessage = useMutation({
    mutationFn: async (newMessage: CreateLeadMessageInput) => {
      const { data, error } = await supabase
        .from('lead_messages')
        .insert([newMessage])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-messages', leadId] });
      toast({
        title: 'Mensagem enviada',
        description: 'A mensagem foi enviada com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error creating message:', error);
      toast({
        title: 'Erro ao enviar mensagem',
        description: 'Não foi possível enviar a mensagem.',
        variant: 'destructive',
      });
    },
  });

  return {
    messages,
    isLoading,
    createMessage,
  };
}
