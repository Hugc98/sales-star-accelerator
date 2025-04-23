
import React from "react";
import { Bell, Search, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const AppHeader = () => {
  return (
    <header className="border-b bg-card px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="relative w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar leads, tarefas, oportunidades..."
            className="pl-8 w-full"
          />
        </div>
        
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Calendar className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <MessageSquare className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="font-medium">Meta atingida!</div>
                <div className="text-sm text-muted-foreground">
                  Você atingiu 80% da meta mensal de vendas.
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  2 minutos atrás
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="font-medium">Novo lead atribuído</div>
                <div className="text-sm text-muted-foreground">
                  Maria Silva foi atribuída a você.
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  1 hora atrás
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="font-medium">Lembrete de tarefa</div>
                <div className="text-sm text-muted-foreground">
                  Entrar em contato com Carlos (Empresa XYZ).
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  3 horas atrás
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-primary">
                Ver todas as notificações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
