
import { useState } from "react";
import { Mail, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import AuthCard from "@/components/auth/AuthCard";
import { sanitizeInput, checkPasswordStrength } from "@/lib/security";
import { useToast } from "@/hooks/use-toast";

const RecoverPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "reset">("email");
  const [passwordFeedback, setPasswordFeedback] = useState<{score: number; feedback: string}>({
    score: 0,
    feedback: ""
  });
  
  const { toast } = useToast();
  
  // Validação de senha em tempo real
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    
    if (password.length > 0) {
      const strength = checkPasswordStrength(password);
      setPasswordFeedback(strength);
    } else {
      setPasswordFeedback({ score: 0, feedback: "" });
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Validação básica
      if (!email) {
        throw new Error("Por favor, informe seu email.");
      }
      
      // Sanitiza o input para prevenção de XSS
      const sanitizedEmail = sanitizeInput(email);
      
      // Verifica se o email existe na lista de usuários
      const mockUsers = JSON.parse(localStorage.getItem("crm_mock_users") || "[]");
      const userExists = mockUsers.some((u: any) => u.email === sanitizedEmail);
      
      if (!userExists) {
        throw new Error("Email não cadastrado no sistema.");
      }
      
      // Simulação de envio de código de verificação (em um app real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Avança para o próximo passo
      setStep("reset");
      
    } catch (err: any) {
      setError(err.message || "Erro ao processar solicitação. Tente novamente.");
      
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Validação básica
      if (!newPassword) {
        throw new Error("Por favor, informe a nova senha.");
      }
      
      // Valida força da senha
      if (passwordFeedback.score < 3) {
        throw new Error("Por favor, escolha uma senha mais forte: " + passwordFeedback.feedback);
      }
      
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualiza a senha do usuário no localStorage
      const mockUsers = JSON.parse(localStorage.getItem("crm_mock_users") || "[]");
      const updatedUsers = mockUsers.map((user: any) => {
        if (user.email === email) {
          return { ...user, password: newPassword };
        }
        return user;
      });
      
      localStorage.setItem("crm_mock_users", JSON.stringify(updatedUsers));
      
      // Feedback de sucesso
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso. Você já pode fazer login com a nova senha.",
      });
      
      // Redireciona para o login
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar a senha. Tente novamente.");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/10">
      <AuthCard
        title={step === "email" ? "Recuperar senha" : "Redefinir senha"}
        description={step === "email" 
          ? "Digite seu email para iniciar a recuperação" 
          : `Defina uma nova senha para ${email}`}
        error={error}
        loading={loading}
      >
        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={loading}>
              Continuar
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Lembrou sua senha?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Voltar ao login
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  required
                  value={newPassword}
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
              {newPassword.length > 0 && (
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
            
            <div className="flex justify-between space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setStep("email")}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                Redefinir senha
              </Button>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Lembrou sua senha?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Voltar ao login
              </Link>
            </p>
          </form>
        )}
      </AuthCard>
    </div>
  );
};

export default RecoverPasswordPage;
