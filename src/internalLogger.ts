// src/internalLogger.ts
const originalConsole = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

export const internalLog = {
  log: (...args: any[]) => originalConsole.log('[Sentinal]', ...args),
  info: (...args: any[]) => originalConsole.info('[Sentinal]', ...args),
  warn: (...args: any[]) => originalConsole.warn('[Sentinal]', ...args),
  error: (...args: any[]) => originalConsole.error('[Sentinal]', ...args),
};
