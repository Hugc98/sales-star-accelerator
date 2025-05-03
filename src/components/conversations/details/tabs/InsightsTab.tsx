
import React from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export const InsightsTab = () => {
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium">Insights do Lead</h3>
      
      <Card className="border shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <BarChart3 className="h-4 w-4 mr-1 text-primary" />
            Engajamento
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Tempo de resposta</span>
              <span className="text-sm font-medium">14min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Taxa de abertura</span>
              <span className="text-sm font-medium">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Interações</span>
              <span className="text-sm font-medium">32</span>
            </div>
            <div className="h-1 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full w-[75%] progress-bar-gradient rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium">Estágio no Funil</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center gap-1 my-1">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <div className="h-2 w-8 bg-blue-500 rounded-full"></div>
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <div className="h-2 w-12 bg-yellow-500 rounded-full"></div>
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            
            <div className="h-2 w-2 rounded-full bg-muted"></div>
            <div className="h-2 w-12 bg-muted rounded-full"></div>
            <div className="h-2 w-2 rounded-full bg-muted"></div>
            
            <div className="h-2 w-2 rounded-full bg-muted"></div>
            <div className="h-2 w-8 bg-muted rounded-full"></div>
            <div className="h-2 w-2 rounded-full bg-muted"></div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <span>Novo</span>
            <span>Em andamento</span>
            <span>Qualificado</span>
            <span>Fechado</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium">Interesses</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Produto X</span>
              <div className="flex items-center">
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-2">
                  <div className="h-full w-[85%] bg-primary rounded-full"></div>
                </div>
                <span className="text-xs font-medium">85%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Serviço Y</span>
              <div className="flex items-center">
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-2">
                  <div className="h-full w-[40%] bg-primary rounded-full"></div>
                </div>
                <span className="text-xs font-medium">40%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Produto Z</span>
              <div className="flex items-center">
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-2">
                  <div className="h-full w-[25%] bg-primary rounded-full"></div>
                </div>
                <span className="text-xs font-medium">25%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
