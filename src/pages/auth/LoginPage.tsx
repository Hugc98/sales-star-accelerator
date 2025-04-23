import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthCard from "@/components/auth/AuthCard";
import { saveSession } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const expired = new URLSearchParams(location.search).get("expired") === "true";

  useEffect(() => {
    if (!localStorage.getItem("crm_mock_users")) {
      const initialMockUsers = [
        { email: "admin@exemplo.com", password: "admin123", role: "admin", name: "Administrador", permissions: ["leads.view", "reports.view"] },
        { email: "teste@exemplo.com", password: "teste123", role: "seller", name: "Usuário Teste", permissions: ["leads.view"] }
      ];
      localStorage.setItem("crm_mock_users", JSON.stringify(initialMockUsers));
    }
  }, []);

  useEffect(() => {
    if (expired) {
      toast({
        title: "Sessão expirada",
        description: "Sua sessão expirou. Por favor, faça login novamente.",
        variant: "destructive",
      });
    }
  }, [expired, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email || !password) {
        throw new Error("Por favor, preencha todos os campos.");
      }
      
      const mockUsers = JSON.parse(localStorage.getItem("crm_mock_users") || "[]");
      const user = mockUsers.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error("Email ou senha inválidos.");
      }
      
      const userData = {
        sub: crypto.randomUUID(),
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions || []
      };
      
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(userData))}.K_7-vPJW5RdbYVn83L4m78-a28XJWKRdaVQxZFcKt0A`;
      
      const session = saveSession(mockToken);
      
      if (!session) {
        throw new Error("Erro ao criar sessão. Tente novamente.");
      }
      
      if (rememberMe) {
        localStorage.setItem("crm_remember_session", "true");
      }
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo de volta, ${user.name}!`,
      });
      
      setTimeout(() => {
        navigate(redirect);
      }, 100);
      
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login. Tente novamente.");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/10">
      <AuthCard
        title="Login"
        description="Digite suas credenciais para acessar o painel"
        error={error}
        loading={loading}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
                onChange={(e) => setPassword(e.target.value)}
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
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <label 
                htmlFor="rememberMe"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Lembrar-me
              </label>
            </div>
            <Link
              to="/recuperar-senha"
              className="text-sm text-primary hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            Entrar
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link to="/registro" className="text-primary hover:underline">
              Registre-se
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
};

export default LoginPage;
