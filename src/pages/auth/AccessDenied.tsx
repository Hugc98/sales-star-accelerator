
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <ShieldAlert className="h-12 w-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="mb-2 text-2xl font-bold text-foreground">Acesso Negado</h1>
        
        <p className="mb-6 text-muted-foreground">
          Você não tem permissão para acessar esta página. Entre em contato com o 
          administrador do sistema caso acredite que isso seja um erro.
        </p>
        
        <div className="flex flex-col space-y-2">
          <Button asChild>
            <Link to="/">Voltar para o Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/ajuda">Ir para a Central de Ajuda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
