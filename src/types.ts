export interface LogEntry {
  level: "log" | "warn" | "error" | "info" | "debug";
  message: any;
  metaData?: any;
  service?: string;
  timestamp: string;
  context?: Record<string, any>;
  projectKey: string;
}

export interface LoggerConfig {
  apiUrl: string;
  context: Record<string, any>;
  bufferLimit: number;
  flushInterval: number;
  retries: number;
  serviceName?: string;
  projectKey: string;
  sandbox?: boolean;
}
