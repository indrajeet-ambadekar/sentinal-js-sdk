// src/interceptors/console.ts
import { log } from "../core.js";

type ConsoleMethod = "log" | "info" | "warn" | "error" | "debug";

const originalConsole: Partial<
  Record<ConsoleMethod, (...args: any[]) => void>
> = {};

export function interceptConsole() {
  const methods: ConsoleMethod[] = ["log", "info", "warn", "error", "debug"];

  methods.forEach((method) => {
    if (!originalConsole[method]) {
      originalConsole[method] = console[method];
    }

    console[method] = (...args: any[]) => {
      log(method, ...args); // ✅ Valid after type fixes
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
