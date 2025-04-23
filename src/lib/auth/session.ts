
import { UserSession } from './types';
import { jwtDecode } from "jwt-decode";

const SESSION_STORAGE_KEY = "crm_session";
const ACTIVITY_TIMEOUT_KEY = "crm_last_activity";
const SESSION_TIMEOUT_MINUTES = 30;

export const getCurrentSession = (): UserSession | null => {
  try {
    const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData) as UserSession;
    
    if (isSessionExpired(session)) {
      clearSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error("Erro ao recuperar sessão:", error);
    clearSession();
    return null;
  }
};

export const saveSession = (token: string): UserSession | null => {
  try {
    let decodedToken: any;
    
    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          decodedToken = JSON.parse(atob(parts[1]));
        } catch (innerError) {
          console.error("Erro ao decodificar o payload do token:", innerError);
          return null;
        }
      } else {
        console.error("Formato de token inválido");
        return null;
      }
    }
    
    if (!decodedToken.sub && !decodedToken.email) {
      console.error("Token não contém dados de usuário necessários");
      return null;
    }
    
    const session: UserSession = {
      id: decodedToken.sub || crypto.randomUUID(),
      name: decodedToken.name || "Usuário",
      email: decodedToken.email,
      role: decodedToken.role || "user",
      permissions: decodedToken.permissions || [],
      exp: decodedToken.exp || Math.floor(Date.now() / 1000) + 86400,
      lastActivity: Date.now(),
    };
    
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    updateLastActivity();
    
    return session;
  } catch (error) {
    console.error("Erro ao salvar sessão:", error);
    return null;
  }
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(ACTIVITY_TIMEOUT_KEY);
};

export const isSessionExpired = (session: UserSession): boolean => {
  if (!session) return true;
  
  const expiration = session.exp * 1000;
  const now = Date.now();
  
  if (now >= expiration) return true;
  
  const lastActivity = getLastActivity();
  if (!lastActivity) return true;
  
  const inactiveTime = now - lastActivity;
  const maxInactiveTime = SESSION_TIMEOUT_MINUTES * 60 * 1000;
  
  return inactiveTime > maxInactiveTime;
};

export const updateLastActivity = (): void => {
  localStorage.setItem(ACTIVITY_TIMEOUT_KEY, Date.now().toString());
};

export const getLastActivity = (): number | null => {
  const activity = localStorage.getItem(ACTIVITY_TIMEOUT_KEY);
  return activity ? parseInt(activity, 10) : null;
};

