
import { Contact, Message, Interaction } from "@/types/crm";

export const mockContacts: Contact[] = [
  {
    id: 1,
    name: "Maria Silva",
    avatar: "/placeholder.svg",
    initials: "MS",
    company: "Tech Solutions",
    email: "maria@techsolutions.com.br",
    phone: "(11) 98765-4321",
    sources: ["whatsapp", "email"],
    status: "qualificado",
    unreadCount: 3,
    lastActivity: "2023-04-23T10:15:00",
    tags: ["Interessado", "Produto A"]
  },
  {
    id: 2,
    name: "João Oliveira",
    avatar: "/placeholder.svg",
    initials: "JO",
    company: "Construções Oliveira",
    email: "joao@oliveiraconstrucoes.com.br",
    phone: "(11) 91234-5678",
    sources: ["whatsapp", "telefone", "instagram"],
    status: "em andamento",
    unreadCount: 0,
    lastActivity: "2023-04-23T09:45:00",
    tags: ["Orçamento"]
  },
  {
    id: 3,
    name: "Ana Costa",
    avatar: "/placeholder.svg",
    initials: "AC",
    company: "Digitalize ME",
    email: "ana.costa@digitalizeme.com.br",
    phone: "(11) 99876-5432",
    sources: ["whatsapp", "facebook"],
    status: "novo",
    unreadCount: 1,
    lastActivity: "2023-04-22T16:30:00",
    tags: ["Lead Quente"]
  },
  {
    id: 4,
    name: "Carlos Mendes",
    avatar: "/placeholder.svg",
    initials: "CM",
    company: "Financeira Segura",
    email: "carlos@financeirasegura.com.br",
    phone: "(11) 98765-8765",
    sources: ["telefone", "email"],
    status: "convertido",
    unreadCount: 0,
    lastActivity: "2023-04-22T13:20:00"
  },
  {
    id: 5,
    name: "Fernanda Souza",
    avatar: "/placeholder.svg",
    initials: "FS",
    company: "Educação Avançada",
    email: "fernanda@educacaoavancada.com.br",
    phone: "(11) 95555-4444",
    sources: ["instagram", "whatsapp"],
    status: "qualificado",
    unreadCount: 2,
    lastActivity: "2023-04-22T11:05:00",
    tags: ["Educação", "Orçamento"]
  },
  {
    id: 6,
    name: "Ricardo Santos",
    avatar: "/placeholder.svg",
    initials: "RS",
    company: "Frota Executiva",
    email: "ricardo@frotaexecutiva.com.br",
    phone: "(11) 94444-3333",
    sources: ["whatsapp"],
    status: "em andamento",
    unreadCount: 0,
    lastActivity: "2023-04-21T17:30:00",
    tags: ["Reunião Agendada"]
  },
  {
    id: 7,
    name: "Luciana Almeida",
    avatar: "/placeholder.svg",
    initials: "LA",
    company: "Saúde Total",
    email: "luciana@saudetotal.com.br",
    phone: "(11) 93333-2222",
    sources: ["facebook", "email"],
    status: "perdido",
    unreadCount: 0,
    lastActivity: "2023-04-20T09:15:00"
  }
];

export const mockMessages: Message[] = [
  {
    id: 1,
    contactId: 1,
    type: "text",
    content: "Boa tarde! Tenho interesse nos serviços da sua empresa.",
    sender: "contact",
    timestamp: "2023-04-23T10:10:00",
    status: "read",
    source: "whatsapp"
  },
  {
    id: 2,
    contactId: 1,
    type: "text",
    content: "Olá Maria, tudo bem? Obrigado pelo contato! Em que posso ajudar?",
    sender: "user",
    timestamp: "2023-04-23T10:12:00",
    status: "read",
    source: "whatsapp"
  },
  {
    id: 3,
    contactId: 1,
    type: "text",
    content: "Gostaria de saber mais sobre o plano empresarial.",
    sender: "contact",
    timestamp: "2023-04-23T10:13:00",
    status: "read",
    source: "whatsapp"
  },
  {
    id: 4,
    contactId: 1,
    type: "text",
    content: "Claro! Temos várias opções de planos empresariais. Quantos colaboradores sua empresa possui?",
    sender: "user",
    timestamp: "2023-04-23T10:14:00",
    status: "read",
    source: "whatsapp"
  },
  {
    id: 5,
    contactId: 1,
    type: "text",
    content: "Temos 25 funcionários atualmente.",
    sender: "contact",
    timestamp: "2023-04-23T10:15:00",
    status: "delivered",
    source: "whatsapp"
  },
  {
    id: 6,
    contactId: 3,
    type: "text",
    content: "Bom dia! Vi o anúncio de vocês no Instagram e gostaria de mais informações.",
    sender: "contact",
    timestamp: "2023-04-22T16:30:00",
    status: "delivered",
    source: "whatsapp"
  },
  {
    id: 7,
    contactId: 5,
    type: "text",
    content: "Olá, quando podemos agendar a demonstração do sistema?",
    sender: "contact",
    timestamp: "2023-04-22T11:05:00",
    status: "delivered",
    source: "instagram"
  },
  {
    id: 8,
    contactId: 5,
    type: "text",
    content: "Podemos conversar sobre os valores do projeto também?",
    sender: "contact",
    timestamp: "2023-04-22T11:07:00",
    status: "delivered",
    source: "instagram"
  }
];

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
    duration: 480, // 8 minutes
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
    duration: 1800, // 30 minutes
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
