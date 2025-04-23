
export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: 'novo' | 'contatado' | 'qualificado' | 'negociação' | 'fechado' | 'perdido';
  created_at: string;
  updated_at: string;
}

export interface LeadInput {
  name: string;
  email?: string;
  phone?: string;
  status: Lead['status'];
}
