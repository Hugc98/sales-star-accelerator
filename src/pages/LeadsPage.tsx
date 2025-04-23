
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MessageSquare,
  Upload,
  ChevronDown,
  Calendar
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import LeadForm from "@/components/leads/LeadForm";
import LeadImport from "@/components/leads/LeadImport";
import LeadCalendar from "@/components/leads/calendar/LeadCalendar";

// Dados de exemplo
const leads = [
  {
    id: 1,
    name: "Fernanda Carvalho",
    company: "Tech Solutions Ltda",
    email: "fernanda@techsolutions.com",
    phone: "(11) 98765-4321",
    status: "novo",
    source: "facebook",
    createdAt: "22/04/2023",
    assignedTo: "Ana Silva",
    avatarUrl: "/placeholder.svg",
    initials: "FC"
  },
  {
    id: 2,
    name: "Ricardo Mendes",
    company: "Inovação Digital S.A.",
    email: "ricardo@inovacaodigital.com",
    phone: "(11) 98765-1234",
    status: "contatado",
    source: "instagram",
    createdAt: "22/04/2023",
    assignedTo: "Bruno Costa",
    avatarUrl: "/placeholder.svg",
    initials: "RM"
  },
  {
    id: 3,
    name: "Juliana Costa",
    company: "Estrela Marketing",
    email: "juliana@estrelamarketing.com",
    phone: "(11) 91234-5678",
    status: "qualificado",
    source: "indicação",
    createdAt: "21/04/2023",
    assignedTo: "Carlos Mendes",
    avatarUrl: "/placeholder.svg",
    initials: "JC"
  },
  {
    id: 4,
    name: "Marcos Oliveira",
    company: "Soluções Empresariais",
    email: "marcos@solucoesempresariais.com",
    phone: "(11) 92345-6789",
    status: "negociação",
    source: "google",
    createdAt: "20/04/2023",
    assignedTo: "Ana Silva",
    avatarUrl: "/placeholder.svg",
    initials: "MO"
  },
  {
    id: 5,
    name: "Patricia Santos",
    company: "Gráfica Moderna",
    email: "patricia@graficamoderna.com",
    phone: "(11) 93456-7890",
    status: "negociação",
    source: "site",
    createdAt: "19/04/2023",
    assignedTo: "Maria Oliveira",
    avatarUrl: "/placeholder.svg",
    initials: "PS"
  },
  {
    id: 6,
    name: "Roberto Lima",
    company: "Consultoria Financeira",
    email: "roberto@consultoriafinanceira.com",
    phone: "(11) 94567-8901",
    status: "qualificado",
    source: "facebook",
    createdAt: "19/04/2023",
    assignedTo: "Bruno Costa",
    avatarUrl: "/placeholder.svg",
    initials: "RL"
  },
  {
    id: 7,
    name: "Sandra Ferreira",
    company: "Arquitetura Moderna",
    email: "sandra@arquiteturamoderna.com",
    phone: "(11) 95678-9012",
    status: "contatado",
    source: "indicação",
    createdAt: "18/04/2023",
    assignedTo: "Carlos Mendes",
    avatarUrl: "/placeholder.svg",
    initials: "SF"
  },
  {
    id: 8,
    name: "Thiago Alves",
    company: "IT Solutions",
    email: "thiago@itsolutions.com",
    phone: "(11) 96789-0123",
    status: "novo",
    source: "instagram",
    createdAt: "18/04/2023",
    assignedTo: "Rafael Santos",
    avatarUrl: "/placeholder.svg",
    initials: "TA"
  },
  {
    id: 9,
    name: "Vanessa Campos",
    company: "Educação Digital",
    email: "vanessa@educacaodigital.com",
    phone: "(11) 97890-1234",
    status: "novo",
    source: "google",
    createdAt: "17/04/2023",
    assignedTo: "Ana Silva",
    avatarUrl: "/placeholder.svg",
    initials: "VC"
  },
];

// Cores para os status
const statusColors: Record<string, string> = {
  novo: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  contatado: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  qualificado: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  negociação: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  fechado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  perdido: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

// Cores para as fontes
const sourceIcons: Record<string, string> = {
  facebook: "bg-blue-500",
  instagram: "bg-pink-500",
  indicação: "bg-green-500",
  google: "bg-red-500",
  site: "bg-gray-500",
};

const LeadsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("lista");
  const [openLeadFormDialog, setOpenLeadFormDialog] = useState<boolean>(false);
  const [openImportDialog, setOpenImportDialog] = useState<boolean>(false);
  const { toast } = useToast();

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">
            Gerencie seus leads e oportunidades
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Lead <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setOpenLeadFormDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar manualmente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenImportDialog(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Importar leads (.csv)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="lista" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="lista">Lista de Leads</TabsTrigger>
          <TabsTrigger value="calendario">
            <Calendar className="mr-2 h-4 w-4" />
            Calendário
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="lista" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, empresa, email..."
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Origem</TableHead>
                  <TableHead className="hidden lg:table-cell">Data</TableHead>
                  <TableHead className="hidden lg:table-cell">Responsável</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={lead.avatarUrl} alt={lead.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {lead.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <div className="flex gap-2 text-sm text-muted-foreground">
                            <span>{lead.company}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[lead.status]}>{lead.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full ${sourceIcons[lead.source]} mr-1.5`}></div>
                        <span>{lead.source}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{lead.createdAt}</TableCell>
                    <TableCell className="hidden lg:table-cell">{lead.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Atualizar status</DropdownMenuItem>
                            <DropdownMenuItem>Alterar responsável</DropdownMenuItem>
                            <DropdownMenuItem>Adicionar tarefa</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Excluir lead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="calendario">
          <LeadCalendar />
        </TabsContent>
      </Tabs>
      
      {/* Modal para adicionar lead manualmente */}
      <Dialog open={openLeadFormDialog} onOpenChange={setOpenLeadFormDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Lead</DialogTitle>
          </DialogHeader>
          <LeadForm 
            onSubmit={(data) => {
              toast({
                title: "Lead adicionado",
                description: `${data.name} foi adicionado com sucesso.`
              });
              setOpenLeadFormDialog(false);
            }}
            onCancel={() => setOpenLeadFormDialog(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Modal para importar leads */}
      <Dialog open={openImportDialog} onOpenChange={setOpenImportDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Importar Leads</DialogTitle>
          </DialogHeader>
          <LeadImport
            onComplete={(count) => {
              toast({
                title: "Importação concluída",
                description: `${count} leads foram importados com sucesso.`
              });
              setOpenImportDialog(false);
            }}
            onCancel={() => setOpenImportDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default LeadsPage;
