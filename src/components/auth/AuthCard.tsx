
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  error?: string;
  loading?: boolean;
}

const AuthCard = ({ 
  title, 
  description, 
  children, 
  error,
  loading 
}: AuthCardProps) => {
  const [securityInfo, setSecurityInfo] = useState<string | null>(null);
  
  // Verifica o nível de segurança da conexão
  useEffect(() => {
    const checkConnectionSecurity = () => {
      if (window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost')) {
        setSecurityInfo('Esta conexão não é segura. Seus dados podem estar vulneráveis.');
      }
    };
    
    checkConnectionSecurity();
  }, []);
  
  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {securityInfo && (
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{securityInfo}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          children
        )}
        
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Protegido por medidas de segurança avançadas 🔒
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthCard;
