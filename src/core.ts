import { LoggerConfig } from './types.js';
import { initBuffer, flush, enqueueLog } from './buffer.js';

// Define default config as a separate constant
const defaultConfig: LoggerConfig = {
  apiUrl: 'https://sentinal.reviewmonk.io/log',
  context: {},
  bufferLimit: 10,
  flushInterval: 2000,
  retries: 3,
};

// Current active config (will be overwritten by user config at runtime)
let config: LoggerConfig = { ...defaultConfig };

export function configureLogger(userConfig: Partial<LoggerConfig>) {
  config = {
    ...defaultConfig,
    ...userConfig,
    context: {
      ...defaultConfig.context,
      ...userConfig.context,
    },
  };

  initBuffer(config);
}

export function setContext(context: Record<string, any>) {
  config.context = { ...config.context, ...context };
}

export function getContext(): Record<string, any> {
  return config.context;
}

export function log(
  level: 'log' | 'info' | 'warn' | 'error' | 'debug',
  ...args: any[]
) {
  enqueueLog({
    level,
    message: args, // Keep as array to support multi-arg logging
    timestamp: new Date().toISOString(),
    context: config.context,
  });
}

export function flushLogs() {
  flush();
}
