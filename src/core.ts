import { LoggerConfig } from "./types.js";
import { initBuffer, flush, enqueueLog } from "./buffer.js";
import { internalLog } from "./internalLogger.js";
import { interceptBrowserErrors } from "./interceptors/browser.js";
import { interceptConsole } from "./interceptors/console.js";
import { interceptNodeErrors } from "./interceptors/node.js";

const PROD_URL = "https://sentinal.reviewmonk.io/server/log";

function inferDevUrl(): string {
  return `http://local-sentinal.reviewmonk.io:81/server/log`;
}

// Define default config
const defaultConfig: LoggerConfig = {
  apiUrl: PROD_URL,
  projectKey: "",
  context: {},
  bufferLimit: 10,
  flushInterval: 2000,
  retries: 3,
  sandbox: false, // Ensure sandbox has a default value
};

// Internal config state
let config: LoggerConfig = { ...defaultConfig };

export function initsentinal(userConfig: Partial<LoggerConfig>) {
  if (!userConfig.projectKey || userConfig.projectKey.length === 0) {
    throw new Error(
      "sentinal project key is missing. Please visit https://sentinal.reviewmonk.io to obtain a project key",
    );
  }

  // Determine the API URL based on sandbox and environment
  let determinedApiUrl: string;

  const isBrowser =
    typeof window !== "undefined" && typeof document !== "undefined";

  if (userConfig.sandbox === true) {
    if (isBrowser) {
      determinedApiUrl =
        userConfig.apiUrl ||
        "https://local-sentinal.reviewmonk.io:444/server/log";
    } else {
      determinedApiUrl =
        userConfig.apiUrl ||
        "http://local-sentinal.reviewmonk.io:81/server/log";
    }
  } else {
    determinedApiUrl = userConfig.apiUrl ?? PROD_URL;
  }

  config = {
    ...defaultConfig,
    ...userConfig,
    apiUrl: determinedApiUrl,
    context: {
      ...defaultConfig.context,
      ...userConfig.context,
    },
    sandbox: userConfig.sandbox ?? defaultConfig.sandbox,
  };

  internalLog.log("sentinal API base URL:", config.apiUrl);
  initBuffer(config);

  if (isBrowser) {
    interceptConsole();
    interceptBrowserErrors();
  } else {
    interceptNodeErrors();
  }
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
    message: args,
    timestamp: new Date().toISOString(),
    context: config.context,
    projectKey: config.projectKey,
  });
}

export function flushLogs() {
  flush();
}
