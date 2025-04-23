
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhoneIcon, MailIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "novo" | "contatado" | "qualificado" | "negociação" | "fechado" | "perdido";
  source: "facebook" | "instagram" | "indicação" | "google" | "site";
  createdAt: string;
  avatarUrl: string;
  initials: string;
}

const statusColors: Record<string, string> = {
  novo: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  contatado: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  qualificado: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  negociação: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  fechado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  perdido: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const sourceIcons: Record<string, string> = {
  facebook: "bg-blue-500",
  instagram: "bg-pink-500",
  indicação: "bg-green-500",
  google: "bg-red-500",
  site: "bg-gray-500",
};

const recentLeads: Lead[] = [
  {
    id: 1,
    name: "Fernanda Carvalho",
    company: "Tech Solutions Ltda",
    email: "fernanda@techsolutions.com",
    phone: "(11) 98765-4321",
    status: "novo",
    source: "facebook",
    createdAt: "2023-04-22T14:30:00",
    avatarUrl: "/placeholder.svg",
    initials: "FC",
  },
  {
    id: 2,
    name: "Ricardo Mendes",
    company: "Inovação Digital S.A.",
    email: "ricardo@inovacaodigital.com",
    phone: "(11) 98765-1234",
    status: "contatado",
    source: "instagram",
    createdAt: "2023-04-22T11:20:00",
    avatarUrl: "/placeholder.svg",
    initials: "RM",
  },
  {
    id: 3,
    name: "Juliana Costa",
    company: "Estrela Marketing",
    email: "juliana@estrelamarketing.com",
    phone: "(11) 91234-5678",
    status: "qualificado",
    source: "indicação",
    createdAt: "2023-04-21T16:45:00",
    avatarUrl: "/placeholder.svg",
    initials: "JC",
  },
  {
    id: 4,
    name: "Marcos Oliveira",
    company: "Soluções Empresariais",
    email: "marcos@solucoesempresariais.com",
    phone: "(11) 92345-6789",
    status: "negociação",
    source: "google",
    createdAt: "2023-04-20T09:15:00",
    avatarUrl: "/placeholder.svg",
    initials: "MO",
  },
];

const RecentLeads = () => {
  return (
    <Card className="card-hover h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Leads Recentes</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            Ver todos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentLeads.map((lead) => (
            <div
              key={lead.id}
              className="flex flex-col space-y-3 border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={lead.avatarUrl} alt={lead.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {lead.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.company}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <Badge className={statusColors[lead.status]}>{lead.status}</Badge>
                  <div className="flex items-center mt-1">
                    <div className={`h-2.5 w-2.5 rounded-full ${sourceIcons[lead.source]} mr-1.5`}></div>
                    <span className="text-xs text-muted-foreground">{lead.source}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <PhoneIcon className="h-3.5 w-3.5 mr-2" />
                  Ligar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <MailIcon className="h-3.5 w-3.5 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentLeads;
