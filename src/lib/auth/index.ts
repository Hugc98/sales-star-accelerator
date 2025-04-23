
export * from './types';
export * from './session';
export * from './permissions';
export * from './utils';
export * from './activity';

export const initSecurity = (): void => {
  setupActivityMonitoring();
};

