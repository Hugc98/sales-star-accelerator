
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Don't show back button on root path
  if (location.pathname === "/") return null;

  return (
    <Button
      variant="ghost"
      size={isMobile ? "icon" : "sm"}
      className={className}
      onClick={() => navigate(-1)}
      aria-label="Voltar"
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      {!isMobile && "Voltar"}
    </Button>
  );
}
