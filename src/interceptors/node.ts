import { log } from '../core';

export function interceptNodeErrors() {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  const serialize = (args: any[]) => {
    return args.map((arg) => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg);
        } catch (error) {
          return 'Un-serializable object';
        }
      }
      return arg;
    });
  };

  console.log = (...args: any[]) => {
    log('log', ...serialize(args));
    originalConsoleLog.apply(console, args);
  };

  console.error = (...args: any[]) => {
    log('error', ...serialize(args));
    originalConsoleError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    log('warn', ...serialize(args));
    originalConsoleWarn.apply(console, args);
  };

  process.on('uncaughtException', (error) => {
    log('error', `Uncaught Exception: ${error.message}`);
  });

  process.on('unhandledRejection', (reason, promise) => {
    log('error', `Unhandled Rejection: ${reason}`);
  });
}
