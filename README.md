Sentinal JS SDK
===============

A lightweight, framework-agnostic JavaScript logging SDK that captures logs, errors, and exceptions from client-side and server-side applications, and forwards them to the Sentinal log ingestion API.

Features
--------
- Captures console logs (`log`, `info`, `warn`, `error`)
- Captures unhandled errors and promise rejections
- Buffers logs and sends in batches
- Retries on failure with backoff
- Supports custom metadata (e.g., user/session IDs)
- Works in both Node.js and browser environments
- Tiny and tree-shakeable

Installation
------------

```bash
npm install sentinal-js-sdk
# or
yarn add sentinal-js-sdk
```

Usage
-----

You must call `initSentinal(config)` once at app startup.

### In Node.js

```js
import { initSentinal } from 'sentinal-js-sdk';

initSentinal({
  appName: 'my-backend-app',
  environment: 'production',
});
```

### In a Browser App

```js
import { initSentinal } from 'sentinal-js-sdk';

initSentinal({
  appName: 'my-frontend-app',
  environment: 'production',
});
```

Configuration Options
---------------------

You must call `initSentinal(config)` before using the logger. Here’s a list of supported config options:

| Key              | Type               | Required | Description                                                                  |
|------------------|--------------------|----------|------------------------------------------------------------------------------|
| `appName`        | `string`           | ✅       | Unique name of your application/service.                                     |
| `environment`    | `string`           | ✅       | App environment like `'production'`, `'development'`, `'staging'`, etc.      |
| `apiUrl`         | `string`           | ❌       | Custom API endpoint for self-hosted Sentinal backend.                        |
| `flushInterval`  | `number` (ms)      | ❌       | How frequently to flush logs. Default: `5000`                                |
| `bufferLimit`    | `number`           | ❌       | Max logs to buffer before flushing. Default: `10`                            |
| `retries`        | `number`           | ❌       | Retry attempts on failure. Default: `3`                                      |

Framework Integrations
----------------------

### Next.js (App Router)

```tsx
// app/layout.tsx or a custom error boundary
import { initSentinal } from 'sentinal-js-sdk';

initSentinal({
  appName: 'my-nextjs-app',
  environment: process.env.NODE_ENV,
});
```

### React (CRA or Vite)

```js
import { initSentinal } from 'sentinal-js-sdk';

initSentinal({
  appName: 'my-react-app',
  environment: process.env.NODE_ENV,
});
```

### Vue

```js
import { initSentinal } from 'sentinal-js-sdk';

initSentinal({
  appName: 'my-vue-app',
  environment: import.meta.env.MODE,
});
```

### Express / Node.js Backend

```js
import { initSentinal } from 'sentinal-js-sdk';

initSentinal({
  appName: 'my-node-api',
  environment: process.env.NODE_ENV,
});
```

### Static HTML / CDN (UMD)

```html
<script src="https://unpkg.com/sentinal-js-sdk"></script>
<script>
  sentinalJsSdk.initSentinal({
    appName: 'my-static-app',
    environment: 'production',
  });
</script>
```

Log Format
----------

Logs sent to the server follow this structure:

```json
{
  "level": "info",
  "message": "Something happened",
  "data": { "context": "optional-metadata" },
  "service": "auto-detected-host-or-ip",
  "timestamp": "2025-07-25T12:00:00.000Z"
}
```

Development & Debugging
------------------------

To enable SDK debug logs in development:

```js
localStorage.setItem('SENTINAL_DEBUG', 'true');
```

License
-------
MIT