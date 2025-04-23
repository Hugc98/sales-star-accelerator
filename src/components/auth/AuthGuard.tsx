
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentSession, hasAnyPermission, updateLastActivity } from '@/lib/security';
import { Loader } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

const AuthGuard = ({ children, requiredPermissions = [] }: AuthGuardProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const session = getCurrentSession();
        const authenticated = !!session;
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          console.log("Usuário autenticado:", session);
          updateLastActivity();
          
          if (requiredPermissions.length > 0) {
            const hasRequiredPermissions = hasAnyPermission(requiredPermissions);
            console.log("Permissões requeridas:", requiredPermissions);
            console.log("Usuário tem permissões:", hasRequiredPermissions);
            setHasPermission(hasRequiredPermissions);
          } else {
            setHasPermission(true);
          }
        } else {
          console.log("Usuário não autenticado");
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsAuthenticated(false);
        setHasPermission(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [requiredPermissions]);

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Redirecionando para o login");
    // Redireciona para o login, preservando a URL original para redirecionamento após o login
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!hasPermission) {
    console.log("Usuário sem permissão, redirecionando para acesso negado");
    // Redireciona para uma página de acesso negado
    return <Navigate to="/acesso-negado" replace />;
  }

  console.log("Renderizando conteúdo protegido");
  return <>{children}</>;
};

export default AuthGuard;
