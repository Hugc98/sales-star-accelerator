
// Este arquivo serve como ponte para manter a compatibilidade com importações antigas
// que ainda usam @/lib/security enquanto migramos para a nova estrutura @/lib/auth

import { 
  getCurrentSession,
  isSessionExpired,
  clearSession,
  updateLastActivity
} from './auth/session';

export {
  getCurrentSession,
  isSessionExpired,
  clearSession,
  updateLastActivity
};
