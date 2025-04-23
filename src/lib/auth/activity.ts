
import { getCurrentSession, updateLastActivity, isSessionExpired, clearSession } from './session';

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
  
  setInterval(() => {
    const session = getCurrentSession();
    if (session && isSessionExpired(session)) {
      clearSession();
      window.location.href = '/login?expired=true';
    }
  }, 60000);
};

