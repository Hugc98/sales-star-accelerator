
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck } from "lucide-react";

interface Goal {
  id: number;
  title: string;
  current: number;
  target: number;
  unit: string;
  percentComplete: number;
}

const goals: Goal[] = [
  {
    id: 1,
    title: "Meta mensal da equipe",
    current: 820000,
    target: 1000000,
    unit: "R$",
    percentComplete: 82,
  },
  {
    id: 2,
    title: "Novos clientes",
    current: 34,
    target: 50,
    unit: "clientes",
    percentComplete: 68,
  },
  {
    id: 3,
    title: "Propostas enviadas",
    current: 85,
    target: 100,
    unit: "propostas",
    percentComplete: 85,
  },
];

const SalesGoalsProgress = () => {
  return (
    <Card className="card-hover h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <ClipboardCheck className="h-5 w-5 text-primary" />
        <CardTitle>Progresso das Metas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => {
            const formattedCurrent = goal.unit === "R$" 
              ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(goal.current)
              : goal.current;
              
            const formattedTarget = goal.unit === "R$"
              ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(goal.target)
              : goal.target;

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{goal.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formattedCurrent} de {formattedTarget} {goal.unit !== "R$" ? goal.unit : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{goal.percentComplete}%</p>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div 
                    className={`h-full progress-bar-gradient ${goal.percentComplete >= 100 ? "animate-pulse-subtle" : ""}`}
                    style={{ width: `${Math.min(goal.percentComplete, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesGoalsProgress;
