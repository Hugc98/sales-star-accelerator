
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

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
const pipelineData = {
  stages: ["Prospecção", "Qualificação", "Proposta", "Negociação", "Fechado"],
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

// Função para obter as negociações de cada estágio
const getDealsByStage = (stage: string) => {
  return pipelineData.deals.filter(deal => deal.stage === stage);
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
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pipeline de Vendas</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie suas oportunidades de negócio
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Nova Oportunidade
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
        {pipelineData.stages.map((stage) => {
          const stageDeals = getDealsByStage(stage);
          const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
          
          return (
            <div key={stage} className="flex flex-col h-full min-w-[280px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{stage}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{stageDeals.length}</Badge>
                  <span className="text-sm text-muted-foreground">{formatCurrency(totalValue)}</span>
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                {stageDeals.map((deal) => (
                  <Card key={deal.id} className="card-hover">
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
                ))}
                
                {stageDeals.length === 0 && (
                  <div className="border border-dashed rounded-lg p-4 flex items-center justify-center text-center h-24">
                    <p className="text-sm text-muted-foreground">
                      Sem oportunidades nesse estágio
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default PipelinePage;
