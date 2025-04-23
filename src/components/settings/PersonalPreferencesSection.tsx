
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Palette, Sun, Moon, Upload, Check, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PersonalPreferencesSection = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userPrefs, setUserPrefs] = useState({
    name: "João Paulo Silva",
    accountName: "SalesSTAR",
    avatar: "/placeholder.svg"
  });
  
  // Função simulada para salvar as preferências
  const handleSavePreferences = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Preferências salvas",
        description: "Suas preferências pessoais foram atualizadas com sucesso."
      });
    }, 1500);
  };
  
  // Handler para alternar o modo escuro
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Em uma implementação real, aqui seria adicionada a lógica para aplicar o tema
    toast({
      title: isDarkMode ? "Modo claro ativado" : "Modo escuro ativado",
      description: "O tema da interface foi alterado."
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Preferências Pessoais</h2>
        <p className="text-muted-foreground">
          Personalize sua experiência e aparência do painel.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>
            Personalize o tema e a aparência visual do painel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo escuro</Label>
              <p className="text-sm text-muted-foreground">
                Alterna entre tema claro e escuro.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch 
                checked={isDarkMode} 
                onCheckedChange={toggleDarkMode}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div>
            <Label>Cor do tema</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {["#9b87f5", "#7E69AB", "#F97316", "#0EA5E9", "#10B981", "#F43F5E"].map((color) => (
                <button
                  key={color}
                  className="w-full aspect-square rounded-md border-2 transition-all hover:scale-110"
                  style={{ 
                    backgroundColor: color,
                    borderColor: color === "#9b87f5" ? "black" : "transparent"
                  }}
                  onClick={() => {
                    toast({
                      title: "Tema alterado",
                      description: "A cor do tema foi atualizada."
                    });
                  }}
                >
                  {color === "#9b87f5" && <Check className="text-white m-auto" />}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e foto de perfil.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Avatar className="h-24 w-24 border-2 border-muted">
              <AvatarImage src={userPrefs.avatar} alt="Foto de perfil" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Alterar foto
              </Button>
              <p className="text-xs text-muted-foreground">
                PNG, JPG ou GIF. Tamanho máximo de 2MB.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input 
                id="name" 
                value={userPrefs.name} 
                onChange={(e) => setUserPrefs({...userPrefs, name: e.target.value})} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="accountName">Nome da conta</Label>
              <Input 
                id="accountName" 
                value={userPrefs.accountName} 
                onChange={(e) => setUserPrefs({...userPrefs, accountName: e.target.value})} 
              />
              <p className="text-xs text-muted-foreground">
                Este nome será exibido no cabeçalho do painel.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSavePreferences} 
            disabled={isSaving}
            className="ml-auto flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar alterações"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PersonalPreferencesSection;
