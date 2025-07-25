// src/buffer.ts
import os from 'os';
import { LoggerConfig, LogEntry } from './types.js';
import { internalLog } from './internalLogger.js';
import { sendLogToAPI } from './utils/network.js';

let config: LoggerConfig;
let buffer: LogEntry[] = [];
let flushTimer: NodeJS.Timeout | null = null;

export function initBuffer(userConfig: LoggerConfig) {
  config = {
    ...userConfig,
    serviceName: userConfig.serviceName ?? inferServiceName(),
  };

  // internalLog.log('[Sentinal] Buffer initialized with config:', config);
}

function ensureInitialized() {
  if (!config) {
    throw new Error('Logger not initialized. Call configureLogger() first.');
  }
}

function inferServiceName(): string {
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return window.location.hostname;
  }

  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const net of iface ?? []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return 'unknown-service';
}

export function enqueueLog(entry: LogEntry) {
  ensureInitialized();

  const normalizedEntry: LogEntry = {
    level: entry.level ?? 'log',
    message: Array.isArray(entry.message)
      ? entry.message.map(String).join(' ')
      : String(entry.message),
    data: {
      ...(entry.data ?? {}),
      ...(entry.context ?? {}),
    },
    service: entry.service ?? config.serviceName ?? 'unknown-service',
    timestamp: new Date().toISOString(),
  };

  // internalLog.log('[Sentinal] Enqueuing normalized log entry:', normalizedEntry);
  buffer.push(normalizedEntry);

  // internalLog.log(`[Sentinal] Current buffer size: ${buffer.length}/${config.bufferLimit}`);

  if (buffer.length >= config.bufferLimit) {
    // internalLog.log('[Sentinal] Buffer limit reached. Triggering immediate flush.');
    flush();
  } else {
    scheduleFlush();
  }
}

function scheduleFlush() {
  if (flushTimer) return;

  // internalLog.log(`[Sentinal] Scheduling flush in ${config.flushInterval}ms`);
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush();
  }, config.flushInterval);
}

export function flush() {
  ensureInitialized();

  if (buffer.length === 0) {
    // internalLog.log('[Sentinal] Flush called but buffer is empty.');
    return;
  }

  const batch = buffer.splice(0, buffer.length);
  // internalLog.log(`[Sentinal] Flushing ${batch.length} log(s) to ${config.apiUrl}`);
  send(batch, config.retries);
}

function send(batch: LogEntry[], retriesLeft: number) {
  ensureInitialized();

  sendLogToAPI(config.apiUrl, batch)
    .then(() => {
      // internalLog.log('[Sentinal] Logs successfully sent.');
    })
    .catch((err) => {
      // internalLog.error('[Sentinal] Failed to send logs:', err);

      if (retriesLeft > 0) {
        // internalLog.log(`[Sentinal] Retrying... (${retriesLeft} retries left)`);
        setTimeout(() => send(batch, retriesLeft - 1), config.flushInterval);
      } else {
        // internalLog.error('[Sentinal] Max retry attempts reached. Dropping logs.');
      }
    });
}
