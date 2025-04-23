
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award } from "lucide-react";

interface Seller {
  id: number;
  name: string;
  value: number;
  percent: number;
  avatarUrl: string;
  initials: string;
}

const sellers: Seller[] = [
  {
    id: 1,
    name: "Ana Silva",
    value: 145000,
    percent: 115,
    avatarUrl: "/placeholder.svg",
    initials: "AS",
  },
  {
    id: 2,
    name: "Carlos Mendes",
    value: 127000,
    percent: 102,
    avatarUrl: "/placeholder.svg",
    initials: "CM",
  },
  {
    id: 3,
    name: "Bruno Costa",
    value: 113000,
    percent: 98,
    avatarUrl: "/placeholder.svg",
    initials: "BC",
  },
  {
    id: 4,
    name: "Maria Oliveira",
    value: 92000,
    percent: 84,
    avatarUrl: "/placeholder.svg",
    initials: "MO",
  },
  {
    id: 5,
    name: "Rafael Santos",
    value: 85000,
    percent: 78,
    avatarUrl: "/placeholder.svg",
    initials: "RS",
  },
];

const TopSellers = () => {
  return (
    <Card className="card-hover h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <Award className="h-5 w-5 text-primary" />
        <CardTitle>Top Vendedores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sellers.map((seller, index) => (
            <div
              key={seller.id}
              className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {index === 0 && (
                    <div className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-yellow-400 text-white flex items-center justify-center text-[10px] font-bold">
                      1
                    </div>
                  )}
                  <Avatar>
                    <AvatarImage src={seller.avatarUrl} alt={seller.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {seller.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="font-medium">{seller.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {seller.percent}% da meta
                  </p>
                </div>
              </div>

              <p className="font-semibold tabular-nums">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(seller.value)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopSellers;
