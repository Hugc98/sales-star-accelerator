
export * from './types';
export * from './session';
export * from './permissions';
export * from './utils';
export * from './activity';
export * from './useAuth';

// Importamos diretamente do módulo activity usando import
import { setupActivityMonitoring } from './activity';

export const initSecurity = (): void => {
  // Chamamos a função diretamente sem usar require
  setupActivityMonitoring();
};
