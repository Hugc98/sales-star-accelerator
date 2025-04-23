
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PerformanceCardProps {
  title: string;
  value: string | number;
  trend: number;
  description: string;
  variant?: "default" | "outline";
}

const PerformanceCard = ({
  title,
  value,
  trend,
  description,
  variant = "default",
}: PerformanceCardProps) => {
  const isPositive = trend >= 0;
  const trendText = `${isPositive ? "+" : ""}${trend}%`;

  return (
    <Card className={`card-hover ${variant === "outline" ? "border border-border bg-card/50" : ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-1">
          <span className="text-2xl font-bold">{value}</span>
          <div className="flex items-center gap-1 text-sm">
            <span
              className={`inline-flex items-center gap-1 ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {trendText}
            </span>
            <span className="text-muted-foreground">{description}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
