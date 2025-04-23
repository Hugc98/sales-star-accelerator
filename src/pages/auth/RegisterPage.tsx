
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";
import SuccessDialog from "@/components/auth/SuccessDialog";
import { useToast } from "@/hooks/use-toast";
import { saveSession } from "@/lib/auth";

const RegisterPage = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegistrationSuccess = () => {
    setShowSuccessDialog(true);
  };

  const handleConfirmRegistration = () => {
    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5OTk5OTk5OSIsIm5hbWUiOiIke25hbWV9IiwiZW1haWwiOiIke2VtYWlsfSIsInJvbGUiOiJzZWxsZXIiLCJwZXJtaXNzaW9ucyI6WyJsZWFkcy52aWV3Il0sImV4cCI6MTcxNjIzOTAyMn0.K_7-vPJW5RdbYVn83L4m78-a28XJWKRdaVQxZFcKt0A`;
    const session = saveSession(mockToken);
    
    if (session) {
      toast({
        title: "Registro concluído com sucesso",
        description: `Bem-vindo(a) ao CRM, ${userName}!`,
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/10">
      <AuthCard
        title="Criar conta"
        description="Preencha os dados abaixo para criar sua conta"
      >
        <div className="space-y-6">
          <RegisterForm onSuccess={handleRegistrationSuccess} />
          
          <p className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </AuthCard>

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onConfirm={handleConfirmRegistration}
        userName={userName}
      />
    </div>
  );
};

export default RegisterPage;
