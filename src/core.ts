import { LoggerConfig } from "./types.js";
import { initBuffer, flush, enqueueLog } from "./buffer.js";
const devUrl: string = "http://local-sentinal.reviewmonk.io:81/server/log";
const prodUrl: string = "http://sentinal.reviewmonk.io/server/log";
// Define default config as a separate constant
const defaultConfig: LoggerConfig = {
  apiUrl: prodUrl,
  projectKey: "",
  context: {},
  bufferLimit: 10,
  flushInterval: 2000,
  retries: 3,
};

// Current active config (will be overwritten by user config at runtime)
let config: LoggerConfig = { ...defaultConfig };

export function configureLogger(userConfig: Partial<LoggerConfig>) {
  if (!userConfig.projectKey || userConfig.projectKey.length === 0)
    throw new Error(
      "Sentinal project key is missing. Please visit https://sentinal.reviemwonk.io to obtain a project key",
    );
  config = {
    ...defaultConfig,
    ...userConfig,
    apiUrl: userConfig.sandbox ? devUrl : prodUrl,
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
  level: "log" | "info" | "warn" | "error" | "debug",
  ...args: any[]
) {
  enqueueLog({
    level,
    message: args, // Keep as array to support multi-arg logging
    timestamp: new Date().toISOString(),
    context: config.context,
    projectKey: config.projectKey,
  });
}

export function flushLogs() {
  flush();
}
