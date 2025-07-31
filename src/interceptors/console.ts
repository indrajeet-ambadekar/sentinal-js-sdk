import { log } from "../core.js";

type ConsoleMethod = "log" | "info" | "warn" | "error" | "debug";

const originalConsole: Partial<
  Record<ConsoleMethod, (...args: any[]) => void>
> = {};

export function interceptConsole() {
  const methods: ConsoleMethod[] = ["log", "info", "warn", "error", "debug"];

  const serialize = (args: any[]) => {
    return args.map((arg) => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg);
        } catch (error) {
          return 'Un-serializable object';
        }
      }
      return arg;
    });
  };

  methods.forEach((method) => {
    if (!originalConsole[method]) {
      originalConsole[method] = console[method];
    }

    console[method] = (...args: any[]) => {
      log(method, ...serialize(args));
      originalConsole[method]?.apply(console, args);
    };
  });
}

export function restoreConsole() {
  const methods: ConsoleMethod[] = ["log", "info", "warn", "error", "debug"];
  methods.forEach((method) => {
    if (originalConsole[method]) {
      console[method] = originalConsole[method]!;
    }
  });
}
