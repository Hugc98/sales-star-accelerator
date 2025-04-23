
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { 
  Lock, 
  Shield, 
  Smartphone, 
  Trash2, 
  Laptop, 
  RefreshCw,
  LogOut
} from "lucide-react";

const SecuritySection = () => {
  const { toast } = useToast();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [changePassword, setChangePassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Dados de exemplo para dispositivos conectados
  const [devices] = useState([
    {
      id: "1",
      name: "Chrome em Windows",
      type: "desktop",
      location: "São Paulo, Brasil",
      lastActive: "Agora",
      current: true
    },
    {
      id: "2",
      name: "Safari em iPhone",
      type: "mobile",
      location: "São Paulo, Brasil",
      lastActive: "22/04/2025 às 18:45",
      current: false
    }
  ]);

  // Handler para alterar senha
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (changePassword.new !== changePassword.confirm) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setShowPasswordForm(false);
      setChangePassword({ current: "", new: "", confirm: "" });
      toast({
        title: "Senha alterada",
        description: "Sua senha foi atualizada com sucesso."
      });
    }, 1500);
  };

  // Handler para ativar 2FA
  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? "2FA desativado" : "2FA ativado",
      description: twoFactorEnabled 
        ? "A autenticação em dois fatores foi desativada." 
        : "A autenticação em dois fatores foi ativada."
    });
  };

  // Handler para encerrar sessão
  const handleTerminateSession = (id: string) => {
    toast({
      title: "Sessão encerrada",
      description: "A sessão foi encerrada com sucesso."
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Segurança e Acesso</h2>
        <p className="text-muted-foreground">
          Gerencie sua senha, autenticação em dois fatores e sessões ativas.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <CardTitle>Senha</CardTitle>
          </div>
          <CardDescription>
            Mantenha sua conta segura alterando sua senha regularmente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showPasswordForm ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha atual</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  value={changePassword.current}
                  onChange={(e) => setChangePassword({...changePassword, current: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova senha</Label>
                <Input 
                  id="new-password" 
                  type="password"
                  value={changePassword.new}
                  onChange={(e) => setChangePassword({...changePassword, new: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  value={changePassword.confirm}
                  onChange={(e) => setChangePassword({...changePassword, confirm: e.target.value})}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Alterando...
                    </>
                  ) : "Salvar alterações"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Senha atual</p>
                <p className="text-sm text-muted-foreground">
                  ••••••••••••
                </p>
              </div>
              <Button onClick={() => setShowPasswordForm(true)}>
                Alterar senha
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Autenticação em dois fatores (2FA)</CardTitle>
          </div>
          <CardDescription>
            Adicione uma camada extra de segurança à sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {twoFactorEnabled ? "Ativado" : "Desativado"}
              </p>
              <p className="text-sm text-muted-foreground">
                {twoFactorEnabled 
                  ? "Sua conta está protegida com autenticação em dois fatores." 
                  : "Recomendamos ativar a autenticação em dois fatores para maior segurança."}
              </p>
            </div>
            <Switch 
              checked={twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Laptop className="h-5 w-5" />
            <CardTitle>Sessões ativas</CardTitle>
          </div>
          <CardDescription>
            Dispositivos que estão atualmente conectados à sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map((device) => (
              <div 
                key={device.id} 
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  device.current ? "bg-primary/5 border-primary/20" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {device.type === "desktop" ? (
                    <Laptop className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <Smartphone className="h-8 w-8 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {device.name}
                      {device.current && (
                        <span className="text-xs bg-primary/10 text-primary py-1 px-2 rounded-full">
                          Atual
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {device.location} · {device.lastActive}
                    </div>
                  </div>
                </div>
                {!device.current && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleTerminateSession(device.id)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySection;
