
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
      const session = getCurrentSession();
      const authenticated = !!session;
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        updateLastActivity();
        
        if (requiredPermissions.length > 0) {
          setHasPermission(hasAnyPermission(requiredPermissions));
        } else {
          setHasPermission(true);
        }
      }
      
      setIsChecking(false);
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
    // Redireciona para o login, preservando a URL original para redirecionamento após o login
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!hasPermission) {
    // Redireciona para uma página de acesso negado
    return <Navigate to="/acesso-negado" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
