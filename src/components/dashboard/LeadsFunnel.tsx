
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Leads",
    value: 120,
    fill: "#c4b5fd",
  },
  {
    name: "Qualificados",
    value: 85,
    fill: "#a78bfa",
  },
  {
    name: "Reuniões",
    value: 60,
    fill: "#8b5cf6",
  },
  {
    name: "Propostas",
    value: 40,
    fill: "#7c3aed",
  },
  {
    name: "Fechados",
    value: 28,
    fill: "#6d28d9",
  },
];

const LeadsFunnel = () => {
  return (
    <Card className="card-hover h-full">
      <CardHeader>
        <CardTitle>Funil de Vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip 
                formatter={(value) => [`${value} leads`, ""]}
                labelFormatter={() => ""}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2 text-center text-sm">
          {data.map((stage, index) => (
            <div key={stage.name} className="flex flex-col">
              <span className="font-medium">{stage.value}</span>
              <span className="text-xs text-muted-foreground">{stage.name}</span>
              {index < data.length - 1 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((data[index + 1].value / stage.value) * 100)}% →
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadsFunnel;
