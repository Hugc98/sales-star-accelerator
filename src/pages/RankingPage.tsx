
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, TrendingUp, DollarSign } from "lucide-react";

interface Seller {
  id: number;
  name: string;
  value: number;
  percentOfTarget: number;
  deals: number;
  conversionRate: number;
  avatarUrl: string;
  initials: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
  badges: string[];
  rank: number;
}

const sellers: Seller[] = [
  {
    id: 1,
    name: "Ana Silva",
    value: 348000,
    percentOfTarget: 116,
    deals: 24,
    conversionRate: 32,
    avatarUrl: "/placeholder.svg",
    initials: "AS",
    trend: "up",
    trendValue: 12,
    badges: ["Superstar", "Meta 3x"],
    rank: 1
  },
  {
    id: 2,
    name: "Carlos Mendes",
    value: 305000,
    percentOfTarget: 101,
    deals: 19,
    conversionRate: 25,
    avatarUrl: "/placeholder.svg",
    initials: "CM",
    trend: "up",
    trendValue: 5,
    badges: ["Consistente"],
    rank: 2
  },
  {
    id: 3,
    name: "Bruno Costa",
    value: 287000,
    percentOfTarget: 96,
    deals: 22,
    conversionRate: 31,
    avatarUrl: "/placeholder.svg",
    initials: "BC",
    trend: "down",
    trendValue: 2,
    badges: [],
    rank: 3
  },
  {
    id: 4,
    name: "Maria Oliveira",
    value: 245000,
    percentOfTarget: 82,
    deals: 17,
    conversionRate: 28,
    avatarUrl: "/placeholder.svg",
    initials: "MO",
    trend: "up",
    trendValue: 8,
    badges: ["Maior crescimento"],
    rank: 4
  },
  {
    id: 5,
    name: "Rafael Santos",
    value: 210000,
    percentOfTarget: 70,
    deals: 15,
    conversionRate: 24,
    avatarUrl: "/placeholder.svg",
    initials: "RS",
    trend: "down",
    trendValue: 4,
    badges: [],
    rank: 5
  },
  {
    id: 6,
    name: "Juliana Costa",
    value: 195000,
    percentOfTarget: 65,
    deals: 14,
    conversionRate: 22,
    avatarUrl: "/placeholder.svg",
    initials: "JC",
    trend: "stable",
    trendValue: 0,
    badges: [],
    rank: 6
  },
  {
    id: 7,
    name: "Ricardo Almeida",
    value: 180000,
    percentOfTarget: 60,
    deals: 12,
    conversionRate: 18,
    avatarUrl: "/placeholder.svg",
    initials: "RA",
    trend: "up",
    trendValue: 3,
    badges: [],
    rank: 7
  },
];

const RankingPage = () => {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Ranking de Vendedores</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho e a competição entre os membros da equipe
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium">Abril 2023</p>
          <p className="text-sm text-muted-foreground">Dados atualizados hoje</p>
        </div>
      </div>

      <Tabs defaultValue="vendas" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="vendas">Vendas Totais</TabsTrigger>
          <TabsTrigger value="conversao">Taxa de Conversão</TabsTrigger>
          <TabsTrigger value="negocios">Negócios Fechados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vendas">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            {sellers.slice(0, 3).map((seller) => (
              <Card key={seller.id} className={`border-2 ${seller.rank === 1 ? 'border-primary' : 'border-transparent'} card-hover`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {seller.rank === 1 && (
                        <Award className="h-5 w-5 text-yellow-500" />
                      )}
                      <CardTitle className="text-lg">#{seller.rank}</CardTitle>
                    </div>
                    <div className={`flex items-center gap-1 ${
                      seller.trend === "up" ? "text-green-500" : 
                      seller.trend === "down" ? "text-red-500" : "text-gray-500"
                    }`}>
                      {seller.trend === "up" ? <TrendingUp className="h-4 w-4" /> : 
                       seller.trend === "down" ? <TrendingUp className="h-4 w-4 transform rotate-180" /> : 
                       <span className="h-4 w-4">→</span>}
                      <span>{seller.trendValue > 0 ? "+" : ""}{seller.trendValue}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className={`h-16 w-16 ${seller.rank === 1 ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                        <AvatarImage src={seller.avatarUrl} alt={seller.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                          {seller.initials}
                        </AvatarFallback>
                      </Avatar>
                      {seller.rank <= 3 && (
                        <div className={`absolute -top-1 -right-1 h-6 w-6 rounded-full ${
                          seller.rank === 1 ? 'bg-yellow-500' : 
                          seller.rank === 2 ? 'bg-gray-400' : 'bg-amber-700'
                        } text-white flex items-center justify-center text-xs font-bold border-2 border-white`}>
                          {seller.rank}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{seller.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {seller.badges.map((badge, index) => (
                          <span key={index} className="text-xs px-2 py-0.5 bg-accent text-accent-foreground rounded-full">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted rounded-md p-2">
                      <p className="text-sm text-muted-foreground">Vendas</p>
                      <p className="font-bold text-lg">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          maximumFractionDigits: 0,
                        }).format(seller.value)}
                      </p>
                    </div>
                    <div className="bg-muted rounded-md p-2">
                      <p className="text-sm text-muted-foreground">Meta</p>
                      <p className={`font-bold text-lg ${
                        seller.percentOfTarget >= 100 ? "text-green-500" : ""
                      }`}>
                        {seller.percentOfTarget}%
                      </p>
                    </div>
                    <div className="bg-muted rounded-md p-2">
                      <p className="text-sm text-muted-foreground">Negócios</p>
                      <p className="font-bold text-lg">{seller.deals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="py-3 px-4 text-left">Posição</th>
                  <th className="py-3 px-4 text-left">Vendedor</th>
                  <th className="py-3 px-4 text-right">Vendas</th>
                  <th className="py-3 px-4 text-right hidden md:table-cell">% da Meta</th>
                  <th className="py-3 px-4 text-right hidden md:table-cell">Negócios</th>
                  <th className="py-3 px-4 text-right hidden lg:table-cell">Conversão</th>
                  <th className="py-3 px-4 text-right hidden lg:table-cell">Tendência</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller.id} className="border-t hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span 
                          className={`inline-flex items-center justify-center h-6 w-6 rounded-full mr-2 text-sm font-medium ${
                            seller.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                            seller.rank === 2 ? "bg-gray-100 text-gray-700" :
                            seller.rank === 3 ? "bg-amber-100 text-amber-700" :
                            "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {seller.rank}
                        </span>
                        {seller.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={seller.avatarUrl} alt={seller.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {seller.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{seller.name}</p>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {seller.badges.map((badge, index) => (
                              <span key={index} className="text-xs px-1.5 py-0.5 bg-accent text-accent-foreground rounded-full">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        maximumFractionDigits: 0,
                      }).format(seller.value)}
                    </td>
                    <td className={`py-3 px-4 text-right font-medium hidden md:table-cell ${
                      seller.percentOfTarget >= 100 ? "text-green-500" : ""
                    }`}>
                      {seller.percentOfTarget}%
                    </td>
                    <td className="py-3 px-4 text-right font-medium hidden md:table-cell">
                      {seller.deals}
                    </td>
                    <td className="py-3 px-4 text-right font-medium hidden lg:table-cell">
                      {seller.conversionRate}%
                    </td>
                    <td className="py-3 px-4 text-right hidden lg:table-cell">
                      <div className={`flex items-center justify-end ${
                        seller.trend === "up" ? "text-green-500" : 
                        seller.trend === "down" ? "text-red-500" : "text-gray-500"
                      }`}>
                        {seller.trend === "up" ? <TrendingUp className="h-4 w-4 mr-1" /> : 
                         seller.trend === "down" ? <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" /> : 
                         <span className="h-4 w-4 mr-1">→</span>}
                        <span>{seller.trendValue > 0 ? "+" : ""}{seller.trendValue}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="conversao">
          <div className="p-8 text-center border rounded-lg bg-card">
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ranking por Taxa de Conversão</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              O ranking por taxa de conversão estará disponível na próxima versão do sistema.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="negocios">
          <div className="p-8 text-center border rounded-lg bg-card">
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ranking por Negócios Fechados</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              O ranking por número de negócios fechados estará disponível na próxima versão do sistema.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default RankingPage;
