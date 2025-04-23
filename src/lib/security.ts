
import { jwtDecode } from "jwt-decode";

// Tipos para autorização e dados do usuário
export interface UserPermission {
  role: "admin" | "manager" | "seller";
  permissions: string[];
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  exp: number;
  lastActivity: number;
}

// Constantes de configuração de segurança
const SESSION_TIMEOUT_MINUTES = 30;
const SESSION_STORAGE_KEY = "crm_session";
const ACTIVITY_TIMEOUT_KEY = "crm_last_activity";

// Funções de segurança

/**
 * Verifica se o usuário tem a permissão necessária
 */
export const hasPermission = (requiredPermission: string): boolean => {
  const session = getCurrentSession();
  if (!session) return false;
  
  // Administradores têm acesso total
  if (session.role === "admin") return true;
  
  return session.permissions.includes(requiredPermission);
};

/**
 * Verifica se o usuário tem uma das permissões especificadas
 */
export const hasAnyPermission = (permissions: string[]): boolean => {
  return permissions.some(permission => hasPermission(permission));
};

/**
 * Verifica se o usuário tem um dos papéis especificados
 */
export const hasRole = (roles: string[]): boolean => {
  const session = getCurrentSession();
  if (!session) return false;
  
  return roles.includes(session.role);
};

/**
 * Retorna a sessão atual do usuário
 */
export const getCurrentSession = (): UserSession | null => {
  try {
    const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData) as UserSession;
    
    // Verifica se a sessão expirou
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

/**
 * Salva a sessão do usuário
 */
export const saveSession = (token: string): UserSession | null => {
  try {
    // Tenta fazer o decode do token JWT
    let decodedToken: any;
    
    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      // Se falhar no decode, tenta parsear a parte do payload diretamente
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
    
    // Garante que temos os dados necessários
    if (!decodedToken.sub && !decodedToken.email) {
      console.error("Token não contém dados de usuário necessários");
      return null;
    }
    
    // Cria o objeto de sessão
    const session: UserSession = {
      id: decodedToken.sub || crypto.randomUUID(),
      name: decodedToken.name || "Usuário",
      email: decodedToken.email,
      role: decodedToken.role || "user",
      permissions: decodedToken.permissions || [],
      // Define expiração para 1 dia a partir de agora se não estiver no token
      exp: decodedToken.exp || Math.floor(Date.now() / 1000) + 86400,
      lastActivity: Date.now(),
    };
    
    // Salva a sessão no localStorage
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    updateLastActivity();
    
    return session;
  } catch (error) {
    console.error("Erro ao salvar sessão:", error);
    return null;
  }
};

/**
 * Limpa a sessão atual
 */
export const clearSession = (): void => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(ACTIVITY_TIMEOUT_KEY);
};

/**
 * Verifica se a sessão expirou
 */
export const isSessionExpired = (session: UserSession): boolean => {
  if (!session) return true;
  
  // Verifica expiração pelo JWT
  const expiration = session.exp * 1000; // Converte para milissegundos
  const now = Date.now();
  
  if (now >= expiration) return true;
  
  // Verifica timeout por inatividade
  const lastActivity = getLastActivity();
  if (!lastActivity) return true;
  
  const inactiveTime = now - lastActivity;
  const maxInactiveTime = SESSION_TIMEOUT_MINUTES * 60 * 1000;
  
  return inactiveTime > maxInactiveTime;
};

/**
 * Atualiza o timestamp da última atividade
 */
export const updateLastActivity = (): void => {
  localStorage.setItem(ACTIVITY_TIMEOUT_KEY, Date.now().toString());
};

/**
 * Obtém o timestamp da última atividade
 */
export const getLastActivity = (): number | null => {
  const activity = localStorage.getItem(ACTIVITY_TIMEOUT_KEY);
  return activity ? parseInt(activity, 10) : null;
};

/**
 * Sanitiza inputs para prevenir ataques XSS
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Verifica a força da senha
 */
export const checkPasswordStrength = (password: string): {
  score: number;  // 0-4 (muito fraca a muito forte)
  feedback: string;
} => {
  let score = 0;
  const feedback: string[] = [];
  
  // Comprimento mínimo
  if (password.length < 8) {
    feedback.push("A senha deve ter pelo menos 8 caracteres");
  } else {
    score += 1;
  }
  
  // Combinação de letras maiúsculas e minúsculas
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Inclua letras maiúsculas e minúsculas");
  }
  
  // Números
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push("Inclua pelo menos um número");
  }
  
  // Caracteres especiais
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Inclua pelo menos um caractere especial");
  }
  
  return {
    score,
    feedback: feedback.join(". "),
  };
};

// Configura o monitoramento de atividade do usuário para timeout de sessão
export const setupActivityMonitoring = (): void => {
  const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
  
  const updateActivity = () => {
    if (getCurrentSession()) {
      updateLastActivity();
    }
  };
  
  events.forEach(event => {
    document.addEventListener(event, updateActivity, { passive: true });
  });
  
  // Verifica a expiração a cada minuto
  setInterval(() => {
    const session = getCurrentSession();
    if (session && isSessionExpired(session)) {
      clearSession();
      window.location.href = '/login?expired=true';
    }
  }, 60000);
};

export const initSecurity = (): void => {
  setupActivityMonitoring();
};
