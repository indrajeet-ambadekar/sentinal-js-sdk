# Sentinal JS SDK

A lightweight, framework-agnostic JavaScript logging SDK that captures logs, errors, and exceptions from client-side and server-side applications and forwards them to the Sentinal log ingestion API.

## Features

- **Universal:** Works in both Node.js and browser environments with the same API.
- **Automatic Error Capture:** Captures `console` output, unhandled errors, and promise rejections.
- **Efficient:** Buffers logs and sends them in batches to reduce network traffic.
- **Resilient:** Retries sending logs with backoff on network failure.
- **Context-Aware:** Enrich logs with custom metadata (e.g., user, session, or transaction IDs).
- **Tiny & Tree-Shakeable:** Minimal footprint for client-side applications.

## Installation

```bash
npm install sentinal-monitor
# or
yarn add sentinal-monitor
```

## Quick Start

You must initialize the SDK once at your application's entry point.

### In a Browser App (e.g., React, Vue, Svelte)

In your main `index.js` or `main.ts`:

```javascript
import { initSentinal } from 'sentinal-monitor';

initSentinal({
  projectKey: 'YOUR_PROJECT_KEY',
});

// All console logs, warnings, and errors will now be captured automatically.
console.log('Hello from the browser!');
```

### In a Node.js App (e.g., Express, NestJS)

In your main entry file (e.g., `server.js`, `index.js`, `main.ts`):

```javascript
import { initSentinal } from 'sentinal-monitor';

initSentinal({
  projectKey: 'YOUR_PROJECT_KEY',
});

// The rest of your application...
console.log('This log will be captured by Sentinal.');
```

---

## How It Works: Universal Imports

The Sentinal SDK is designed to be universal. You can use the same import statement in any project, and the correct version (browser or Node.js) will be used automatically.

```javascript
import { initSentinal, log, setContext } from 'sentinal-monitor';
```

This is made possible by the `"exports"` field in `package.json`, which tells Node.js and modern bundlers which files to use based on the environment. You never need to change your import path.

---

## API Reference

### `initSentinal(config)`

Initializes the SDK. This must be called once before any other SDK functions.

| Key             | Type          | Required | Description                                                                 |
| --------------- | ------------- | :------: | --------------------------------------------------------------------------- |
| `projectKey`    | `string`      |    ✅    | Your Sentinal project key.                                                  |
| `apiUrl`        | `string`      |    ❌    | Custom API endpoint for self-hosted Sentinal instances.                     |
| `flushInterval` | `number` (ms) |    ❌    | How frequently to flush the log buffer. Default: `2000`.                     |
| `bufferLimit`   | `number`      |    ❌    | Maximum number of logs to buffer before flushing. Default: `10`.            |
| `retries`       | `number`      |    ❌    | Number of retry attempts on network failure. Default: `3`.                  |
| `sandbox`       | `boolean`     |    ❌    | Enable sandbox mode for local development. Default: `false`.                |
| `context`       | `object`      |    ❌    | Global key-value pairs to attach to every log.                              |
| `serviceName`   | `string`      |    ❌    | A name for your application. Inferred automatically if not set.             |

### `log(level, ...args)`

Manually sends a log to Sentinal.

- `level`: `'log' | 'info' | 'warn' | 'error' | 'debug'`
- `...args`: One or more values to log (e.g., strings, objects).

```javascript
import { log } from 'sentinal-monitor';

log('info', 'User has signed up', { userId: '12345' });
```

### `setContext(context)`

Enriches all subsequent logs with the provided key-value pairs. This is useful for adding session or user information.

- `context`: An object with data to merge into the global context.

```javascript
import { setContext } from 'sentinal-monitor';

// Set user information after login
setContext({
  user: {
    id: 'user-99',
    email: 'test@example.com',
  },
});

console.log('User context has been set.'); // This log will include the user data
```

---

## Debugging and Local Development

### Seeing Internal SDK Logs

To see what the Sentinal SDK is doing internally (e.g., when it's flushing logs), you can enable its internal logger.

- **In the browser:**
  ```javascript
  // Open the developer console and run:
  localStorage.setItem('sentinal_DEBUG', 'true');
  ```
- **In Node.js:**
  ```bash
  # Set an environment variable before running your app:
  export SENTINAL_DEBUG=true
  node your-app.js
  ```

### Using Sandbox Mode

For local development, it's highly recommended to use the `sandbox` flag. This prevents your development logs from being mixed with production data.

```javascript
initSentinal({
  projectKey: 'YOUR_PROJECT_KEY',
  sandbox: true, // Enable sandbox mode
});
```

When `sandbox` is `true`, the SDK will automatically point to a local or development-specific Sentinal endpoint, which you can configure with the `apiUrl` option if needed.

## License

MIT