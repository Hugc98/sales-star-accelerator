
import { Interaction } from "@/types/crm";

export const mockInteractions: Interaction[] = [
  {
    id: 1,
    contactId: 1,
    type: "message",
    content: "Cliente entrou em contato interessado nos planos empresariais.",
    timestamp: "2023-04-23T10:10:00",
    source: "whatsapp",
    status: "respondido"
  },
  {
    id: 2,
    contactId: 1,
    type: "call",
    content: "Ligação para detalhar os planos empresariais.",
    timestamp: "2023-04-22T14:30:00",
    duration: 480,
    agent: "João Paulo",
    source: "telefone",
    status: "concluído"
  },
  {
    id: 3,
    contactId: 1,
    type: "meeting",
    content: "Apresentação inicial dos serviços via Zoom.",
    timestamp: "2023-04-20T11:00:00",
    duration: 1800,
    agent: "Ana Silva",
    source: "email",
    status: "concluído"
  },
  {
    id: 4,
    contactId: 1,
    type: "note",
    content: "Cliente mostrou maior interesse no plano Premium, mas ainda está avaliando o orçamento com a diretoria.",
    timestamp: "2023-04-20T11:35:00",
    agent: "Ana Silva",
    source: "email",
    status: "informativo"
  },
  {
    id: 5,
    contactId: 3,
    type: "message",
    content: "Cliente perguntou sobre prazos de entrega do projeto.",
    timestamp: "2023-04-22T16:30:00",
    source: "whatsapp",
    status: "pendente"
  },
  {
    id: 6,
    contactId: 5,
    type: "message",
    content: "Solicitação de informações sobre preços e agendamento de demonstração.",
    timestamp: "2023-04-22T11:05:00",
    source: "instagram",
    status: "pendente"
  }
];
