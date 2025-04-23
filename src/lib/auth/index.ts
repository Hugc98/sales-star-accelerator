
export * from './types';
export * from './session';
export * from './permissions';
export * from './utils';
export * from './activity';

export const initSecurity = (): void => {
  // Importamos a função diretamente do módulo activity
  const { setupActivityMonitoring } = require('./activity');
  setupActivityMonitoring();
};
