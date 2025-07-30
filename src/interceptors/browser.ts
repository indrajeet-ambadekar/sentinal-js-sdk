// src/interceptors/browser.ts

import { log } from "../core.js";

let hasInitialized = false;

export function interceptBrowserErrors() {
  if (hasInitialized || typeof window === "undefined") return;
  hasInitialized = true;

  // Catch synchronous runtime errors
  window.onerror = function (message, source, lineno, colno, error) {
    log("error", "[window.onerror]", {
      message,
      source,
      lineno,
      colno,
      error: error?.stack || error?.toString?.() || null,
    });
  };

  // Catch unhandled Promise rejections
  window.onunhandledrejection = function (event) {
    log("error", "[unhandledrejection]", {
      reason: event.reason?.stack || event.reason?.toString?.() || null,
    });
  };
}
