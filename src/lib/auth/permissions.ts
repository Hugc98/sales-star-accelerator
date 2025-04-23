
import { getCurrentSession } from './session';

export const hasPermission = (requiredPermission: string): boolean => {
  const session = getCurrentSession();
  if (!session) return false;
  
  if (session.role === "admin") return true;
  
  return session.permissions.includes(requiredPermission);
};

export const hasAnyPermission = (permissions: string[]): boolean => {
  return permissions.some(permission => hasPermission(permission));
};

export const hasRole = (roles: string[]): boolean => {
  const session = getCurrentSession();
  if (!session) return false;
  
  return roles.includes(session.role);
};

