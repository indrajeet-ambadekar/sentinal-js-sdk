// src/interceptors/node.ts

import { log } from '../core.js';

let hasInitialized = false;

export function interceptNodeErrors() {
  if (hasInitialized || typeof process === 'undefined') return;
  hasInitialized = true;

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    log('error', '[uncaughtException]', {
      message: err?.message,
      stack: err?.stack,
    });
  });

  // Handle unhandled Promise rejections
  process.on('unhandledRejection', (reason: any) => {
    log('error', '[unhandledRejection]', {
      reason: reason?.stack || reason?.toString?.() || null,
    });
  });
}
