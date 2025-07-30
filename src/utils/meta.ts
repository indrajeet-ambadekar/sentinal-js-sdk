export function gatherMetaData() {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return gatherBrowserMetaData();
  } else {
    return gatherRuntimeMetaData();
  }
}

function gatherBrowserMetaData() {
  const faviconElement =
    document.querySelector("link[rel='icon']") ||
    document.querySelector("link[rel='shortcut icon']") ||
    document.querySelector("link[rel='apple-touch-icon']");

  const faviconUrl = faviconElement
    ? new URL(faviconElement.getAttribute("href") || "", window.location.origin)
        .href
    : null;

  return {
    platform: "browser",
    hostname: window.location.hostname,
    href: window.location.href,
    userAgent: navigator.userAgent,
    favicon: faviconUrl,
    language: navigator.language,
    languages: navigator.languages,
    devicePlatform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
  };
}

export function gatherRuntimeMetaData() {
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
  };
}
