import { configureLogger, log, setContext, getContext, flushLogs } from './core.js';
import { interceptConsole } from './interceptors/console.js';
import { interceptBrowserErrors } from './interceptors/browser.js';
import { interceptNodeErrors } from './interceptors/node.js';
import { internalLog } from './internalLogger.js';
let initialized = false;

export function initSentinal(userConfig?: Parameters<typeof configureLogger>[0]) {
  if (initialized) {
    // internalLog.log('[Sentinal] Already initialized, skipping init.');
    return;
  }

  // internalLog.log('[Sentinal] Initializing SDK...');
  initialized = true;

  configureLogger(userConfig || {});
  // internalLog.log('[Sentinal] Logger configured.');

  interceptConsole();
  // internalLog.log('[Sentinal] Console interception active.');

  // Auto-detect environment and hook appropriate interceptors
  if (typeof window !== 'undefined') {
    // internalLog.log('[Sentinal] Detected browser environment.');
    interceptBrowserErrors();
  } else if (typeof process !== 'undefined') {
    // internalLog.log('[Sentinal] Detected Node.js environment.');
    interceptNodeErrors();
  }
}


// Re-export core functions for SDK usage
export { log, setContext, getContext, flushLogs };
