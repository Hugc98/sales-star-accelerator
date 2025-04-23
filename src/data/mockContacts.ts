
import { Contact } from "@/types/crm";

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
