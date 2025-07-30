// src/util/network.ts
import https from "https";
import { internalLog } from "../internalLogger.js";
import { LogEntry } from "../types.js";

const isNode = typeof window === "undefined";
const isDev =
  process.env.NODE_ENV === "development" ||
  process.env.SENTINAL_ALLOW_INSECURE === "true";

// src/util/network.ts
export async function sendLogToAPI(
  endpoint: string,
  payload: LogEntry[],
  projectKey: any,
) {
  try {
    if (!projectKey)
      throw new Error(`INVALID SENTINAL PROJECT KEY: ${projectKey}`);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "sentinal-project-key": projectKey || null,
      },
      body: JSON.stringify(payload), // ✅ must be an array
    });

    if (!res.ok) {
      throw new Error(`Server responded with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
}
