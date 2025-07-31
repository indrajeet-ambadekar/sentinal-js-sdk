import * as os from 'os';

function getIpAddresses(): string[] {
  const addresses: string[] = [];
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

export function gatherMetaData() {
  return {
    platform: "non-browser",
    nodeVersion: typeof process !== "undefined" ? process.version : undefined,
    pid: typeof process !== "undefined" ? process.pid : undefined,
    execPath: typeof process !== "undefined" ? process.execPath : undefined,
    cwd:
      typeof process !== "undefined" && process.cwd ? process.cwd() : undefined,
    env:
      typeof process !== "undefined"
        ? {
            NODE_ENV: process.env.NODE_ENV,
            APP_ENV: process.env.APP_ENV,
          }
        : undefined,
    memory:
      typeof process !== "undefined" && process.memoryUsage
        ? process.memoryUsage()
        : undefined,
    timestamp: Date.now(),
    hostname: os.hostname(),
    ips: getIpAddresses(),
  };
}
