
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, UserX, Edit, Trash2, Shield, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AddTeamMemberForm } from "./team/AddTeamMemberForm";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: "active" | "invited" | "inactive";
}

// Dados de exemplo para demonstração
const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "João Paulo Silva",
    email: "joao.silva@exemplo.com",
    role: "Administrador",
    status: "active",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    role: "Gerente de Vendas",
    status: "active",
  },
  {
    id: "3",
    name: "Rafael Santos",
    email: "rafael.santos@exemplo.com",
    role: "Atendente",
    status: "invited",
  }
];

// This interface matches what the AddTeamMemberForm provides
interface TeamMemberFormData {
  name: string;
  email: string;
  role: string;
  status: "invited";
}

const TeamManagementSection = () => {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [isAddingMember, setIsAddingMember] = useState(false);
  
  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    toast({
      title: "Membro removido",
      description: "O membro da equipe foi removido com sucesso."
    });
  };
  
  // Update the parameter type to match what AddTeamMemberForm provides
  const handleAddMember = (formData: TeamMemberFormData) => {
    const member: TeamMember = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTeamMembers([...teamMembers, member]);
    setIsAddingMember(false);
    toast({
      title: "Membro adicionado",
      description: "O convite foi enviado para o email do novo membro."
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Gestão de Equipe</h2>
          <p className="text-muted-foreground">
            Gerencie os membros da sua equipe e suas permissões de acesso.
          </p>
        </div>
        
        <Sheet open={isAddingMember} onOpenChange={setIsAddingMember}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Adicionar Membro
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Adicionar Novo Membro</SheetTitle>
              <SheetDescription>
                Preencha as informações para convidar um novo membro para sua equipe.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <AddTeamMemberForm onSubmit={handleAddMember} onCancel={() => setIsAddingMember(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="grid gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {member.avatar ? (
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <span className="text-lg font-medium text-primary">
                        {member.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {member.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-muted px-2 py-1 rounded-md text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {member.role}
                  </div>
                  
                  {member.status === "invited" && (
                    <div className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-md">
                      Convite pendente
                    </div>
                  )}
                  
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamManagementSection;
