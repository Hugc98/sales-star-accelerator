
import { Message } from "@/types/crm";

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
