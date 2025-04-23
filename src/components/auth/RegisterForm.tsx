
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { checkPasswordStrength, saveSession, sanitizeInput } from "@/lib/auth";

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
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
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = sanitizeInput(email);
      
      if (!sanitizedName || !sanitizedEmail || !password) {
        throw new Error("Por favor, preencha todos os campos.");
      }
      
      if (passwordFeedback.score < 3) {
        throw new Error("Por favor, use uma senha mais forte: " + passwordFeedback.feedback);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUsers = JSON.parse(localStorage.getItem("crm_mock_users") || "[]");
      if (mockUsers.some((user: any) => user.email === sanitizedEmail)) {
        throw new Error("Este email já está sendo usado por outra conta.");
      }
      
      const newUser = {
        email: sanitizedEmail,
        password: password,
        name: sanitizedName,
        role: "seller",
        permissions: ["leads.view"]
      };
      
      mockUsers.push(newUser);
      localStorage.setItem("crm_mock_users", JSON.stringify(mockUsers));
      onSuccess();
      
    } catch (err: any) {
      setError(err.message || "Erro ao registrar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <PasswordInput
        password={password}
        showPassword={showPassword}
        onChange={handlePasswordChange}
        onToggleVisibility={() => setShowPassword(!showPassword)}
        feedback={passwordFeedback}
        disabled={loading}
      />
      
      <Alert variant="default" className="bg-secondary/50 border-secondary">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Ao criar uma conta, você concorda com nossos Termos de Serviço e Política de Privacidade.
        </AlertDescription>
      </Alert>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button type="submit" className="w-full" disabled={loading}>
        Criar conta
      </Button>
    </form>
  );
};

export default RegisterForm;
