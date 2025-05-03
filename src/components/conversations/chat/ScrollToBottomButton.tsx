
import React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollToBottomButtonProps {
  visible: boolean;
  onClick: () => void;
}

const ScrollToBottomButton = ({ visible, onClick }: ScrollToBottomButtonProps) => {
  if (!visible) return null;
  
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="absolute bottom-20 right-4 h-10 w-10 rounded-full shadow-lg opacity-90 z-10"
      aria-label="Scroll to bottom"
    >
      <ArrowDown className="h-5 w-5" />
    </Button>
  );
};

export default ScrollToBottomButton;
