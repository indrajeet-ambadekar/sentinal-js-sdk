export interface LogEntry {
  level: 'log' | 'warn' | 'error' | 'info' | 'debug';
  message: any;
  data?: any;
  service?: string;
  timestamp: string;
  context?: Record<string, any>;
}

export interface LoggerConfig {
  apiUrl: string;
  context: Record<string, any>;
  bufferLimit: number;
  flushInterval: number;
  retries: number;
  serviceName?:string;
}
