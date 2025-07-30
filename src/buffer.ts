// src/buffer.ts
import os from "os";
import { LoggerConfig, LogEntry } from "./types.js";
import { internalLog } from "./internalLogger.js";
import { sendLogToAPI } from "./utils/network.js";
import { gatherMetaData } from "./utils/platform.js";

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
    throw new Error("Logger not initialized. Call configureLogger() first.");
  }
}

function inferServiceName(): string {
  if (typeof window !== "undefined" && window.location?.hostname) {
    return window.location.hostname;
  }

  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const net of iface ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
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
    .then(() => {})
    .catch((err) => {
      if (retriesLeft > 0) {
        setTimeout(() => send(batch, retriesLeft - 1), config.flushInterval);
      } else {
      }
    });
}
