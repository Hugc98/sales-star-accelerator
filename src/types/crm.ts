export type ContactSource = "whatsapp" | "instagram" | "facebook" | "email" | "telefone";
export type ContactStatus = "novo" | "em andamento" | "qualificado" | "convertido" | "perdido";
export type MessageType = "text" | "image" | "file" | "audio" | "video" | "location" | "call";

export interface Contact {
  id: number;
  name: string;
  avatar: string;
  initials: string;
  company?: string;
  email?: string;
  phone?: string;
  sources: ContactSource[];
  status: ContactStatus;
  lastMessage?: Message;
  unreadCount: number;
  lastActivity: string; // ISO date string
  tags?: string[];
  agent?: string; // Added missing property
  waitingTime?: string; // Added missing property
}

export interface Message {
  id: number;
  contactId: number;
  type: MessageType;
  content: string;
  sender: "user" | "contact";
  timestamp: string; // ISO date string
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  source: ContactSource;
  attachments?: Attachment[];
}

export interface Attachment {
  id: number;
  name: string;
  type: string;
  url: string;
  size?: number;
  preview?: string;
}

export interface Interaction {
  id: number;
  contactId: number;
  type: "message" | "call" | "email" | "meeting" | "note" | "task" | "deal";
  subtype?: string;
  content?: string;
  timestamp: string; // ISO date string
  duration?: number; // in seconds for calls
  agent?: string;
  source: ContactSource;
  status?: string;
  relatedItems?: any[];
}

export interface Team {
  id: number;
  name: string;
  leader: number; // user ID
  members: number[]; // user IDs
  createdAt: string; // ISO date string
  targets?: any;
  performance?: any;
}

export interface Goal {
  id: number;
  title: string;
  description?: string;
  target: number;
  current: number;
  unit: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  userId?: number; // if assigned to a specific user
  teamId?: number; // if assigned to a team
  status: "active" | "completed" | "failed";
  category: "sales" | "leads" | "calls" | "meetings" | "revenue";
}

export interface Bonus {
  id: number;
  name: string;
  description: string;
  threshold: number; // percentage of goal to earn bonus
  amount: number; // bonus amount
  currency: string;
  goalId: number;
  userId?: number;
  teamId?: number;
  earned: boolean;
  paidDate?: string; // ISO date string
}
