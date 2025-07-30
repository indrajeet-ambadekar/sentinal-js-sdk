import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'], // You can keep both
  dts: true,
  splitting: false,
  clean: true,
  target: 'node18',
  platform: 'neutral', // <-- Important: ensures tsup treats it as a Node lib
  external: ['node:assert'], // <-- Critical: prevent bundling these
});
