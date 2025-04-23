
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, UserPlus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthCard from "@/components/auth/AuthCard";
import { checkPasswordStrength, saveSession, sanitizeInput } from "@/lib/security";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<{score: number; feedback: string}>({
    score: 0,
    feedback: ""
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Validação de senha em tempo real
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (newPassword.length > 0) {
      const strength = checkPasswordStrength(newPassword);
      setPasswordFeedback(strength);
    } else {
      setPasswordFeedback({ score: 0, feedback: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Sanitiza os inputs para prevenção de XSS
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = sanitizeInput(email);
      
      // Validações básicas
      if (!sanitizedName || !sanitizedEmail || !password) {
        throw new Error("Por favor, preencha todos os campos.");
      }
      
      // Validação de força de senha
      if (passwordFeedback.score < 3) {
        throw new Error("Por favor, use uma senha mais forte: " + passwordFeedback.feedback);
      }
      
      // Simulação de chamada de API para registro
      // Em produção, isso seria uma chamada real para o backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verificação simulada de email já existente
      // Em produção, isso seria verificado pelo backend
      if (email === "usuario@exemplo.com") {
        throw new Error("Este email já está sendo usado por outra conta.");
      }
      
      // Cria um token JWT simulado (em produção, este viria do servidor)
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5OTk5OTk5OSIsIm5hbWUiOiIke3Nhbml0aXplZE5hbWV9IiwiZW1haWwiOiIke3Nhbml0aXplZEVtYWlsfSIsInJvbGUiOiJzZWxsZXIiLCJwZXJtaXNzaW9ucyI6WyJsZWFkcy52aWV3Il0sImV4cCI6MTcxNjIzOTAyMn0.K_7-vPJW5RdbYVn83L4m78-a28XJWKRdaVQxZFcKt0A`;
      
      // Simulação de sucesso no registro
      // Em produção, exibiria o diálogo de confirmação ou redirecionaria para o dashboard
      setShowSuccessDialog(true);
      
    } catch (err: any) {
      setError(err.message || "Erro ao registrar conta. Tente novamente.");
      
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRegistration = () => {
    // Simulação de autologin após confirmação
    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5OTk5OTk5OSIsIm5hbWUiOiIke25hbWV9IiwiZW1haWwiOiIke2VtYWlsfSIsInJvbGUiOiJzZWxsZXIiLCJwZXJtaXNzaW9ucyI6WyJsZWFkcy52aWV3Il0sImV4cCI6MTcxNjIzOTAyMn0.K_7-vPJW5RdbYVn83L4m78-a28XJWKRdaVQxZFcKt0A`;
    const session = saveSession(mockToken);
    
    if (session) {
      toast({
        title: "Registro concluído com sucesso",
        description: `Bem-vindo(a) ao CRM, ${name}!`,
      });
      navigate("/");
    } else {
      toast({
        title: "Erro ao iniciar sessão",
        description: "Por favor, faça login manualmente.",
        variant: "destructive",
      });
      navigate("/login");
    }
    
    setShowSuccessDialog(false);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/10">
        <AuthCard
          title="Criar conta"
          description="Preencha os dados abaixo para criar sua conta"
          error={error}
          loading={loading}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  className="pl-10"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
              
              {/* Feedback sobre força da senha */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center space-x-1 mt-1">
                    <div className={`h-1 flex-1 rounded-full ${passwordFeedback.score >= 1 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${passwordFeedback.score >= 2 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${passwordFeedback.score >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${passwordFeedback.score >= 4 ? 'bg-green-700' : 'bg-gray-200'}`}></div>
                  </div>
                  
                  {passwordFeedback.feedback && (
                    <p className="text-xs mt-1 text-muted-foreground">
                      {passwordFeedback.feedback}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <Alert variant="default" className="bg-secondary/50 border-secondary">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Ao criar uma conta, você concorda com nossos Termos de Serviço e Política de Privacidade.
              </AlertDescription>
            </Alert>
            
            <Button type="submit" className="w-full" disabled={loading}>
              Criar conta
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </form>
        </AuthCard>
      </div>
      
      {/* Diálogo de confirmação de registro */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registro concluído!</DialogTitle>
            <DialogDescription>
              Sua conta foi criada com sucesso. Clique no botão abaixo para continuar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-3 mt-4">
            <p className="text-sm">
              Em um ambiente de produção, você receberia um email de confirmação antes de poder acessar o sistema. Para esta demonstração, você será redirecionado diretamente para o dashboard.
            </p>
            
            <Button onClick={handleConfirmRegistration} className="w-full">
              Acessar o Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterPage;
