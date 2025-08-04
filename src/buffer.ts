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
    throw new Error("Logger not initialized. Call initSentinal() first.");
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

function checkServerHealth(url: string): Promise<boolean> {
  // internalLog.log(`[Health Check] GET: ${url}`);

  return fetch(url, { method: "GET" })
    .then(async (res) => {
      const body = await res.json().catch(() => ({}));

      const expected = {
        message: "Cannot GET /server/log",
        error: "Not Found",
        statusCode: 404,
      };

      const isExpected404 =
        res.status === 404 &&
        body.message === expected.message &&
        body.error === expected.error &&
        body.statusCode === expected.statusCode;

      if (isExpected404) {
        // internalLog.log(
        //   `[Health Check Success] Server is up. Received expected 404.`,
        // );
        return true;
      } else {
        // internalLog.log(
        //   `[Health Check Failure] Unexpected response from ${url}:`,
        //   body,
        // );
        return false;
      }
    })
    .catch((err) => {
      // internalLog.log(`[Health Check Error] ${url} failed:`, err);
      return false;
    });
}

function send(batch: LogEntry[], retriesLeft: number) {
  ensureInitialized();

  if (!batch || batch.length === 0) {
    return;
  }

  checkServerHealth(config.apiUrl).then((isAlive) => {
    if (!isAlive) {
      internalLog.log(`[Sentinal Monitor Dump]`, JSON.stringify(batch));
      return;
    }

    sendLogToAPI(config.apiUrl, batch, config.projectKey)
      .then(() => {
        internalLog.log(`SUCCESS IN SENDING ${batch.length || 0} LOG`);
      })
      .catch((err) => {
        internalLog.log("ERROR IN SENDING LOG", err);
        if (retriesLeft > 0) {
          setTimeout(() => send(batch, retriesLeft - 1), config.flushInterval);
        }
      });
  });
}
