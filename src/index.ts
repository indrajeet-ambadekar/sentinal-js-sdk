import {
  configureLogger,
  log,
  setContext,
  getContext,
  flushLogs,
} from "./core.js";
import { interceptConsole } from "./interceptors/console.js";
import { interceptBrowserErrors } from "./interceptors/browser.js";
import { interceptNodeErrors } from "./interceptors/node.js";
import { internalLog } from "./internalLogger.js";
let initialized = false;

export function initSentinal(
  userConfig?: Parameters<typeof configureLogger>[0],
) {
  if (initialized) {
    return;
  }

  initialized = true;

  configureLogger(userConfig || {});

  interceptConsole();

  // Auto-detect environment and hook appropriate interceptors
  if (typeof window !== "undefined") {
    interceptBrowserErrors();
  } else if (typeof process !== "undefined") {
    interceptNodeErrors();
  }
}

// Re-export core functions for SDK usage
export { log, setContext, getContext, flushLogs };
