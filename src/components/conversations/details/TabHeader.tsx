
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onClose?: () => void;
}

export const TabHeader = ({ activeTab, onTabChange, onClose }: TabHeaderProps) => {
  return (
    <div className="flex justify-between items-center p-3 border-b">
      <TabsList>
        <TabsTrigger value="info" onClick={() => onTabChange("info")}>Detalhes</TabsTrigger>
        <TabsTrigger value="timeline" onClick={() => onTabChange("timeline")}>Timeline</TabsTrigger>
        <TabsTrigger value="insights" onClick={() => onTabChange("insights")}>Insights</TabsTrigger>
      </TabsList>
      {onClose && (
        <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
