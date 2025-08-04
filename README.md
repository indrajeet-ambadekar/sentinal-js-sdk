# sentinal JS SDK

A lightweight, framework-agnostic JavaScript logging SDK that captures logs, errors, and exceptions from client-side and server-side applications, and forwards them to the sentinal log ingestion API.

## Features

- Captures console logs (`log`, `info`, `warn`, `error`)
- Captures unhandled errors and promise rejections
- Buffers logs and sends in batches
- Retries on failure with backoff
- Supports custom metadata (e.g., user/session IDs)
- Works in both Node.js and browser environments
- Tiny and tree-shakeable

## Installation

```bash
npm install sentinal-sdk
# or
yarn add sentinal-sdk
```

## Usage

You must call `configureLogger(config)` once at app startup.

### In a Browser App

When using a bundler like Webpack, Rollup, or Vite, you should import from `sentinal-sdk` and let the bundler resolve the correct version.

```js
import { configureLogger } from 'sentinal-sdk';

configureLogger({
  projectKey: 'YOUR_PROJECT_KEY',
});

console.log('Hello from the browser!');
```

### In Node.js (Express, Next.js, NestJS, etc.)

In your main entry file (e.g., `server.js`, `index.js`, `main.ts`), simply configure the logger. It will automatically intercept all console output.

```js
import { configureLogger } from 'sentinal-sdk';

configureLogger({
  projectKey: 'YOUR_PROJECT_KEY',
});

// The rest of your application code...
console.log('This will be captured by sentinal');
```

## Configuration Options

You must call `configureLogger(config)` before using the logger. Here’s a list of supported config options:

| Key              | Type               | Required | Description                                                                  |
|------------------|--------------------|----------|------------------------------------------------------------------------------|
| `projectKey`     | `string`           | ✅       | Your sentinal project key.                                                   |
| `apiUrl`         | `string`           | ❌       | Custom API endpoint for self-hosted sentinal backend.                        |
| `flushInterval`  | `number` (ms)      | ❌       | How frequently to flush logs. Default: `2000`                                |
| `bufferLimit`    | `number`           | ❌       | Max logs to buffer before flushing. Default: `10`                            |
| `retries`        | `number`           | ❌       | Retry attempts on failure. Default: `3`                                      |
| `sandbox`        | `boolean`          | ❌       | Enable sandbox mode for local development. Default: `false`                  |

## Log Format

Logs sent to the server follow this structure:

```json
{
  "level": "info",
  "message": "Something happened",
  "metaData": {
    "platform": "browser",
    "hostname": "localhost",
    "href": "http://localhost:3000/",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "favicon": "http://localhost:3000/favicon.ico",
    "language": "en-US",
    "languages": [
      "en-US",
      "en"
    ],
    "devicePlatform": "MacIntel",
    "screenResolution": "1728x1117",
    "timezone": "Asia/Calcutta",
    "cookiesEnabled": true,
    "doNotTrack": null
  },
  "service": "localhost",
  "timestamp": "2025-07-31T10:00:00.000Z",
  "projectKey": "YOUR_PROJECT_KEY"
}
```

## Development & Debugging

To enable SDK debug logs in development:

```js
localStorage.setItem('sentinal_DEBUG', 'true');
```

## License

MIT
