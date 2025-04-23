
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import LeadsFunnel from "@/components/dashboard/LeadsFunnel";
import TopSellers from "@/components/dashboard/TopSellers";
import SalesGoalsProgress from "@/components/dashboard/SalesGoalsProgress";
import RecentLeads from "@/components/dashboard/RecentLeads";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Acompanhe seu desempenho e da sua equipe
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium">Abril 2023</p>
          <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <PerformanceCard
          title="Vendas totais"
          value={new Intl.NumberFormat("pt-BR", { 
            style: "currency", 
            currency: "BRL" 
          }).format(820000)}
          trend={12.5}
          description="vs. mês passado"
        />
        <PerformanceCard
          title="Leads gerados"
          value={293}
          trend={8.2}
          description="vs. mês passado"
        />
        <PerformanceCard
          title="Taxa de conversão"
          value="18.3%"
          trend={2.1}
          description="vs. mês passado"
        />
        <PerformanceCard
          title="Ticket médio"
          value={new Intl.NumberFormat("pt-BR", { 
            style: "currency", 
            currency: "BRL" 
          }).format(28500)}
          trend={-3.6}
          description="vs. mês passado"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LeadsFunnel />
          <SalesGoalsProgress />
        </div>
        <div className="space-y-6">
          <TopSellers />
          <RecentLeads />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
