
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronDown, Settings } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PipelineCustomization, { PipelineStage } from "@/components/pipeline/PipelineCustomization";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";

interface Deal {
  id: number;
  title: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
  contact: {
    name: string;
    avatarUrl: string;
    initials: string;
  };
  owner: {
    name: string;
    avatarUrl: string;
    initials: string;
  };
  expectedCloseDate: string;
  tags: string[];
}

// Dados de exemplo para o pipeline
const initialPipelineData = {
  stages: [
    { id: "stage-1", name: "Prospecção", color: "#007BFF", order: 0, autoAdvance: false },
    { id: "stage-2", name: "Qualificação", color: "#6C5CE7", order: 1, autoAdvance: false },
    { id: "stage-3", name: "Proposta", color: "#FDCB6E", order: 2, autoAdvance: false },
    { id: "stage-4", name: "Negociação", color: "#FF7675", order: 3, autoAdvance: false },
    { id: "stage-5", name: "Fechado", color: "#00B894", order: 4, autoAdvance: false },
  ],
  deals: [
    {
      id: 1,
      title: "Implementação de CRM",
      company: "Tech Solutions",
      value: 85000,
      stage: "Prospecção",
      probability: 20,
      contact: {
        name: "Fernanda Carvalho",
        avatarUrl: "/placeholder.svg",
        initials: "FC"
      },
      owner: {
        name: "Ana Silva",
        avatarUrl: "/placeholder.svg",
        initials: "AS"
      },
      expectedCloseDate: "15/05/2023",
      tags: ["Software", "Enterprise"]
    },
    {
      id: 2,
      title: "Consultoria Marketing Digital",
      company: "Inovação Digital",
      value: 45000,
      stage: "Qualificação",
      probability: 40,
      contact: {
        name: "Ricardo Mendes",
        avatarUrl: "/placeholder.svg",
        initials: "RM"
      },
      owner: {
        name: "Bruno Costa",
        avatarUrl: "/placeholder.svg",
        initials: "BC"
      },
      expectedCloseDate: "10/05/2023",
      tags: ["Marketing", "Médio Porte"]
    },
    {
      id: 3,
      title: "Campanha de Mídia Social",
      company: "Estrela Marketing",
      value: 28000,
      stage: "Proposta",
      probability: 60,
      contact: {
        name: "Juliana Costa",
        avatarUrl: "/placeholder.svg",
        initials: "JC"
      },
      owner: {
        name: "Carlos Mendes",
        avatarUrl: "/placeholder.svg",
        initials: "CM"
      },
      expectedCloseDate: "05/05/2023",
      tags: ["Mídia Social"]
    },
    {
      id: 4,
      title: "Consultoria Financeira",
      company: "Soluções Empresariais",
      value: 120000,
      stage: "Negociação",
      probability: 80,
      contact: {
        name: "Marcos Oliveira",
        avatarUrl: "/placeholder.svg",
        initials: "MO"
      },
      owner: {
        name: "Ana Silva",
        avatarUrl: "/placeholder.svg",
        initials: "AS"
      },
      expectedCloseDate: "30/04/2023",
      tags: ["Financeiro", "Enterprise"]
    },
    {
      id: 5,
      title: "Desenvolvimento de Website",
      company: "Gráfica Moderna",
      value: 32000,
      stage: "Proposta",
      probability: 60,
      contact: {
        name: "Patricia Santos",
        avatarUrl: "/placeholder.svg",
        initials: "PS"
      },
      owner: {
        name: "Maria Oliveira",
        avatarUrl: "/placeholder.svg",
        initials: "MO"
      },
      expectedCloseDate: "12/05/2023",
      tags: ["Website", "Design"]
    },
    {
      id: 6,
      title: "Plano de Investimentos",
      company: "Consultoria Financeira",
      value: 75000,
      stage: "Qualificação",
      probability: 40,
      contact: {
        name: "Roberto Lima",
        avatarUrl: "/placeholder.svg",
        initials: "RL"
      },
      owner: {
        name: "Bruno Costa",
        avatarUrl: "/placeholder.svg",
        initials: "BC"
      },
      expectedCloseDate: "20/05/2023",
      tags: ["Financeiro"]
    },
    {
      id: 7,
      title: "Projeto de Design",
      company: "Arquitetura Moderna",
      value: 56000,
      stage: "Qualificação",
      probability: 30,
      contact: {
        name: "Sandra Ferreira",
        avatarUrl: "/placeholder.svg",
        initials: "SF"
      },
      owner: {
        name: "Carlos Mendes",
        avatarUrl: "/placeholder.svg",
        initials: "CM"
      },
      expectedCloseDate: "25/05/2023",
      tags: ["Design"]
    },
    {
      id: 8,
      title: "Serviços de Cloud",
      company: "IT Solutions",
      value: 98000,
      stage: "Prospecção",
      probability: 20,
      contact: {
        name: "Thiago Alves",
        avatarUrl: "/placeholder.svg",
        initials: "TA"
      },
      owner: {
        name: "Rafael Santos",
        avatarUrl: "/placeholder.svg",
        initials: "RS"
      },
      expectedCloseDate: "03/06/2023",
      tags: ["Cloud", "Enterprise"]
    },
    {
      id: 9,
      title: "Sistema de E-learning",
      company: "Educação Digital",
      value: 67000,
      stage: "Fechado",
      probability: 100,
      contact: {
        name: "Vanessa Campos",
        avatarUrl: "/placeholder.svg",
        initials: "VC"
      },
      owner: {
        name: "Ana Silva",
        avatarUrl: "/placeholder.svg",
        initials: "AS"
      },
      expectedCloseDate: "15/04/2023",
      tags: ["Educação", "Software"]
    },
    {
      id: 10,
      title: "Automação de Marketing",
      company: "Empreendimentos Globais",
      value: 52000,
      stage: "Negociação",
      probability: 75,
      contact: {
        name: "Lucas Martins",
        avatarUrl: "/placeholder.svg",
        initials: "LM"
      },
      owner: {
        name: "Maria Oliveira",
        avatarUrl: "/placeholder.svg",
        initials: "MO"
      },
      expectedCloseDate: "28/04/2023",
      tags: ["Marketing", "Automação"]
    },
    {
      id: 11,
      title: "Renovação de Licenças",
      company: "Tech Solutions",
      value: 36000,
      stage: "Fechado",
      probability: 100,
      contact: {
        name: "Fernanda Carvalho",
        avatarUrl: "/placeholder.svg",
        initials: "FC"
      },
      owner: {
        name: "Bruno Costa",
        avatarUrl: "/placeholder.svg",
        initials: "BC"
      },
      expectedCloseDate: "10/04/2023",
      tags: ["Software", "Renovação"]
    },
  ]
};

// Cores para as tags
const tagColors: Record<string, string> = {
  Software: "bg-blue-100 text-blue-800",
  Enterprise: "bg-purple-100 text-purple-800",
  Marketing: "bg-pink-100 text-pink-800",
  "Médio Porte": "bg-gray-100 text-gray-800",
  "Mídia Social": "bg-indigo-100 text-indigo-800",
  Financeiro: "bg-green-100 text-green-800",
  Website: "bg-amber-100 text-amber-800",
  Design: "bg-orange-100 text-orange-800",
  Cloud: "bg-cyan-100 text-cyan-800",
  Educação: "bg-red-100 text-red-800",
  Automação: "bg-lime-100 text-lime-800",
  Renovação: "bg-violet-100 text-violet-800",
};

// Função para formatar valores monetários
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const PipelinePage = () => {
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(initialPipelineData.stages);
  const [deals, setDeals] = useState<Deal[]>(initialPipelineData.deals);
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
  const { toast } = useToast();

  // Função para obter as negociações de cada etapa
  const getDealsByStage = (stageName: string) => {
    return deals.filter(deal => deal.stage === stageName);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    // Handle moving deals between stages
    if (result.type === "DEAL") {
      const sourceStage = source.droppableId;
      const destStage = destination.droppableId;
      
      if (sourceStage !== destStage) {
        // Find the deal and update its stage
        const updatedDeals = deals.map(deal => {
          if (deal.id.toString() === result.draggableId) {
            return { ...deal, stage: destStage };
          }
          return deal;
        });
        
        setDeals(updatedDeals);
        
        toast({
          title: "Oportunidade movida",
          description: `A oportunidade foi movida para a etapa "${destStage}".`,
        });
      }
    }
  };

  const handleStagesChange = (newStages: PipelineStage[]) => {
    setPipelineStages(newStages);
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pipeline de Vendas</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie suas oportunidades de negócio
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isCustomizeDialogOpen} onOpenChange={setIsCustomizeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Personalizar Pipeline
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Personalizar Pipeline</DialogTitle>
              </DialogHeader>
              <PipelineCustomization
                stages={pipelineStages}
                onStagesChange={handleStagesChange}
              />
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Oportunidade
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Adicionar oportunidade</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                Criar do zero
              </DropdownMenuItem>
              <DropdownMenuItem>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2V6M8 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 14L11 17L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                De um lead existente
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
          {pipelineStages.map((stage) => {
            const stageDeals = getDealsByStage(stage.name);
            const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
            
            return (
              <div key={stage.id} className="flex flex-col h-full min-w-[280px]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: stage.color }}
                    />
                    <h3 className="font-semibold">{stage.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{stageDeals.length}</Badge>
                    <span className="text-sm text-muted-foreground">{formatCurrency(totalValue)}</span>
                  </div>
                </div>
                
                <Droppable droppableId={stage.name} type="DEAL">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 min-h-[200px] p-2 rounded-md transition-colors ${
                        snapshot.isDraggingOver ? 'bg-secondary/50' : ''
                      }`}
                    >
                      {stageDeals.map((deal, index) => (
                        <Draggable
                          key={deal.id.toString()}
                          draggableId={deal.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="card-hover animate-fade-in"
                            >
                              <CardContent className="p-3">
                                <div className="space-y-3">
                                  <div>
                                    <h4 className="font-medium">{deal.title}</h4>
                                    <p className="text-sm text-muted-foreground">{deal.company}</p>
                                  </div>
                                  
                                  <div className="flex justify-between">
                                    <span className="font-medium">{formatCurrency(deal.value)}</span>
                                    <Badge variant="outline">{deal.probability}%</Badge>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-1">
                                    {deal.tags.map((tag, index) => (
                                      <span 
                                        key={index} 
                                        className={`text-xs px-1.5 py-0.5 rounded ${tagColors[tag]}`}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  
                                  <div className="flex justify-between items-center pt-2 border-t">
                                    <div className="text-xs text-muted-foreground">
                                      Previsão: {deal.expectedCloseDate}
                                    </div>
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={deal.owner.avatarUrl} alt={deal.owner.name} />
                                      <AvatarFallback className="text-xs">{deal.owner.initials}</AvatarFallback>
                                    </Avatar>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {stageDeals.length === 0 && (
                        <div className="border border-dashed rounded-lg p-4 flex items-center justify-center text-center h-24">
                          <p className="text-sm text-muted-foreground">
                            Sem oportunidades nesse estágio
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </AppLayout>
  );
};

export default PipelinePage;
