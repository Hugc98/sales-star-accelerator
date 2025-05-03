
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Award, 
  Settings, 
  HelpCircle,
  LogOut,
  X 
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { clearSession } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface MobileMenuProps {
  trigger: React.ReactNode;
}

const MobileMenu = ({ trigger }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    clearSession();
    toast({
      title: "Sessão encerrada",
      description: "Você foi desconectado com sucesso."
    });
    navigate("/login");
  };
  
  const menuItems = [
    { icon: Award, label: "Ranking", path: "/ranking" },
    { icon: HelpCircle, label: "Ajuda", path: "/ajuda" },
    { icon: Settings, label: "Configurações", path: "/configuracoes" },
  ];
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="right" className="w-[80vw] sm:w-[385px] p-0">
        <SheetHeader className="px-4 py-6 bg-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 border-2 border-primary-foreground">
                <AvatarImage alt="Avatar" src="/lovable-uploads/fea6b9a8-edba-4b60-9a9a-9564b8335d22.png" />
                <AvatarFallback className="bg-primary-foreground text-primary">JP</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-left text-primary-foreground">João Paulo Silva</SheetTitle>
                <p className="text-sm text-primary-foreground/80">Gerente de Vendas</p>
              </div>
            </div>
          </div>
        </SheetHeader>
        
        <div className="py-4">
          <div className="space-y-1 px-2">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start text-base h-12"
                asChild
              >
                <Link to={item.path} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="px-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-base h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
