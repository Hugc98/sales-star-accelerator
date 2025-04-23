
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  ListChecks,
  Briefcase,
  Award,
  ClipboardCheck,
  Settings,
  LogOut,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { clearSession } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

// Atualizamos para incluir apenas rotas que de fato existem no App.tsx
const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    path: "/",
  },
  {
    title: "Leads",
    icon: Users,
    path: "/leads",
  },
  {
    title: "Pipeline",
    icon: Briefcase,
    path: "/pipeline",
    badge: "Novo",
  },
  {
    title: "Conversas",
    icon: MessageSquare,
    path: "/conversas",
    badge: "3",
  },
  {
    title: "Ranking",
    icon: Award,
    path: "/ranking",
  },
  {
    title: "Ajuda",
    icon: HelpCircle,
    path: "/ajuda",
  },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    clearSession();
    toast({
      title: "Sessão encerrada",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/login");
  };
  
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center space-x-2 px-2">
          <div className="bg-white p-1 rounded-md">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground text-xl">SalesSTAR</h1>
            <p className="text-sidebar-foreground/80 text-xs">Acelerando resultados</p>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className="flex justify-between w-full"
                      aria-current={location.pathname === item.path ? "page" : undefined}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-5 w-5" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="outline" className={`ml-auto ${
                          item.title === "Conversas" ? "bg-primary text-primary-foreground" : "bg-sidebar-accent text-sidebar-foreground"
                        }`}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex items-center space-x-3 px-2">
          <Avatar className="h-9 w-9 border-2 border-sidebar-accent">
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">JP</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-sidebar-foreground truncate">João Paulo Silva</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">Gerente de Vendas</p>
          </div>
          <button 
            className="p-1 rounded-md hover:bg-sidebar-accent/30"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 text-sidebar-foreground/70" />
          </button>
        </div>
      </SidebarFooter>
      
      <SidebarTrigger className="absolute right-[-12px] top-6" />
    </Sidebar>
  );
};

export default AppSidebar;
