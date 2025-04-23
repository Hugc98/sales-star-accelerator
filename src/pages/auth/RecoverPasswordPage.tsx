
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import AuthCard from "@/components/auth/AuthCard";
import { sanitizeInput } from "@/lib/security";
import { useToast } from "@/hooks/use-toast";

const RecoverPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
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
        // Por razões de segurança, não informamos que o email não existe
        console.log("Email não encontrado na base de usuários:", sanitizedEmail);
      }
      
      // Simulação de chamada de API para recuperação de senha
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Registra tentativa de recuperação em logs (em produção)
      console.log(`Tentativa de recuperação de senha para: ${sanitizedEmail}`);
      
      // Simulação de sucesso no envio de email
      toast({
        title: "Email enviado",
        description: "Instruções de recuperação foram enviadas para seu email.",
      });
      
      // Marca como enviado para mostrar a mensagem de confirmação
      setIsSubmitted(true);
      
    } catch (err: any) {
      setError(err.message || "Erro ao processar solicitação. Tente novamente.");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/10">
      <AuthCard
        title="Recuperar senha"
        description="Digite seu email para receber instruções de recuperação"
        error={error}
        loading={loading}
      >
        {!isSubmitted ? (
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
            <Button type="submit" className="w-full" disabled={loading}>
              Enviar instruções
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Lembrou sua senha?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Voltar ao login
              </Link>
            </p>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
              <p className="text-green-700">
                Verifique sua caixa de entrada e siga as instruções enviadas para {email}.
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Não recebeu o email? Verifique sua pasta de spam ou solicite novamente em alguns minutos.
            </p>
            <div className="pt-2">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/login" className="inline-flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o login
                </Link>
              </Button>
            </div>
          </div>
        )}
      </AuthCard>
    </div>
  );
};

export default RecoverPasswordPage;
