
import { useState, useEffect } from 'react';
import { getCurrentSession, clearSession } from './session';
import { UserSession } from './types';

export const useAuth = () => {
  const [user, setUser] = useState<UserSession | null>(getCurrentSession());

  useEffect(() => {
    // Verificar mudanças de sessão a cada 1 segundo
    const interval = setInterval(() => {
      const session = getCurrentSession();
      
      // Se o estado da sessão mudou, atualizar o estado do usuario
      if (
        (session && !user) || 
        (!session && user) ||
        (session && user && session.id !== user.id)
      ) {
        setUser(session);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return {
    user,
    isLoggedIn: !!user,
    logout
  };
};

export default useAuth;
