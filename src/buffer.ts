// src/buffer.ts
import { LoggerConfig, LogEntry } from "./types.js";
import { internalLog } from "./internalLogger.js";
import { sendLogToAPI } from "./utils/network.js";
import { gatherMetaData } from "./utils/meta";

let config: LoggerConfig;
let buffer: LogEntry[] = [];
let flushTimer: NodeJS.Timeout | null = null;

export function initBuffer(userConfig: LoggerConfig) {
  config = {
    ...userConfig,
    serviceName: userConfig.serviceName ?? inferServiceName(),
  };
}

function ensureInitialized() {
  if (!config) {
    throw new Error("Logger not initialized. Call initsentinal() first.");
  }
}

function inferServiceName(): string {
  if (typeof window !== "undefined" && window.location?.hostname) {
    return window.location.hostname;
  }

  // Node.js context
  if (typeof process !== "undefined") {
    if (process.env.npm_package_name) {
      return process.env.npm_package_name;
    }

    try {
      const pkg = require(`${process.cwd()}/package.json`);
      if (pkg?.name) {
        return pkg.name;
      }
    } catch (err) {
      // ignore error
    }

    return "node-app";
  }

  return "unknown-service";
}

export function enqueueLog(entry: LogEntry) {
  ensureInitialized();
  const metaData = gatherMetaData();

  const normalizedEntry: LogEntry = {
    level: entry.level ?? "log",
    message: Array.isArray(entry.message)
      ? entry.message.map(String).join(" ")
      : String(entry.message),
    metaData,
    service: entry.service ?? config.serviceName ?? "unknown-service",
    timestamp: new Date().toISOString(),
    projectKey: config.projectKey,
  };

  buffer.push(normalizedEntry);

  if (buffer.length >= config.bufferLimit) {
    flush();
  } else {
    scheduleFlush();
  }
}

function scheduleFlush() {
  if (flushTimer) return;

  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush();
  }, config.flushInterval);
}

export function flush() {
  ensureInitialized();

  if (buffer.length === 0) {
    return;
  }

  const batch = buffer.splice(0, buffer.length);
  send(batch, config.retries);
}

function send(batch: LogEntry[], retriesLeft: number) {
  ensureInitialized();
  sendLogToAPI(config.apiUrl, batch, config.projectKey)
    .then(() => {
      internalLog.log("SUCCESS IN SENDING LOG")
    })
    .catch((err) => {
      internalLog.log("ERROR IN SENDING LOG",err)
      if (retriesLeft > 0) {
        setTimeout(() => send(batch, retriesLeft - 1), config.flushInterval);
      } else {
      }
    });
}
