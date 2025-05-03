
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Users, Briefcase, MessageSquare, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";

const MobileNavBar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: BarChart3, path: "/", label: "Dashboard" },
    { icon: Users, path: "/leads", label: "Leads" },
    { icon: Briefcase, path: "/pipeline", label: "Pipeline" },
    { icon: MessageSquare, path: "/conversas", label: "Conversas" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <nav className="flex items-center justify-between bg-white border-t border-gray-200 px-2 h-16">
        {navItems.map((item) => {
          const isActive = item.path === "/" 
            ? location.pathname === "/"
            : location.pathname.startsWith(item.path);
            
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full px-1",
                "text-muted-foreground transition-colors",
                isActive && "text-primary"
              )}
            >
              <item.icon 
                className={cn(
                  "h-6 w-6 mb-1",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
        
        <MobileMenu
          trigger={
            <div className="flex flex-col items-center justify-center w-full h-full px-1 text-muted-foreground">
              <Menu className="h-6 w-6 mb-1" />
              <span className="text-xs">Menu</span>
            </div>
          }
        />
      </nav>
    </div>
  );
};

export default MobileNavBar;
