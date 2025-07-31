import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
    },
    outDir: 'dist/browser',
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    clean: true,
    target: 'es2020',
    platform: 'browser',
    resolveJsonModule: true,
    sourcemap: true,
    esbuildOptions(options) {
      options.resolveExtensions = ['.browser.ts', '.ts', '.js'];
    },
  },
  {
    entry: {
      index: 'src/index.ts',
    },
    outDir: 'dist/node',
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    clean: true,
    target: 'node18',
    platform: 'node',
    resolveJsonModule: true,
    sourcemap: true,
    esbuildOptions(options) {
      options.resolveExtensions = ['.node.ts', '.ts', '.js'];
    },
  },
]);
