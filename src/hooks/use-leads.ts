
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Lead, LeadInput } from '@/types/leads';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useLeads() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        toast({
          title: 'Erro ao carregar leads',
          description: 'Não foi possível carregar a lista de leads.',
          variant: 'destructive',
        });
        return [];
      }

      return data as Lead[];
    },
  });

  const createLead = useMutation({
    mutationFn: async (newLead: LeadInput) => {
      const { data, error } = await supabase
        .from('leads')
        .insert([newLead])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: 'Lead adicionado',
        description: 'O lead foi adicionado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error creating lead:', error);
      toast({
        title: 'Erro ao criar lead',
        description: 'Não foi possível criar o lead.',
        variant: 'destructive',
      });
    },
  });

  const updateLeadStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Lead['status'] }) => {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: 'Status atualizado',
        description: 'O status do lead foi atualizado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error updating lead status:', error);
      toast({
        title: 'Erro ao atualizar status',
        description: 'Não foi possível atualizar o status do lead.',
        variant: 'destructive',
      });
    },
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: 'Lead removido',
        description: 'O lead foi removido com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error deleting lead:', error);
      toast({
        title: 'Erro ao remover lead',
        description: 'Não foi possível remover o lead.',
        variant: 'destructive',
      });
    },
  });

  return {
    leads,
    isLoading,
    createLead,
    updateLeadStatus,
    deleteLead,
  };
}
