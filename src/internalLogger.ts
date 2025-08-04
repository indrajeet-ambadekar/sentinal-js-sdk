// src/internalLogger.ts
const originalConsole = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

export const internalLog = {
  log: (...args: any[]) => originalConsole.log("[sentinal]", ...args),
  info: (...args: any[]) => originalConsole.info("[sentinal]", ...args),
  warn: (...args: any[]) => originalConsole.warn("[sentinal]", ...args),
  error: (...args: any[]) => originalConsole.error("[sentinal]", ...args),
};
