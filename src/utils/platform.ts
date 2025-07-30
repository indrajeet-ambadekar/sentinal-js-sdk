import os from "os";

export function gatherMetaData() {
  if (typeof window !== "undefined") {
    const faviconElement =
      document.querySelector("link[rel='icon']") ||
      document.querySelector("link[rel='shortcut icon']") ||
      document.querySelector("link[rel='apple-touch-icon']");

    const faviconUrl = faviconElement
      ? new URL(
          faviconElement.getAttribute("href") || "",
          window.location.origin,
        ).href
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
  } else {
    const interfaces = os.networkInterfaces();
    const ipList = [];

    for (const iface of Object.values(interfaces)) {
      for (const net of iface ?? []) {
        if (net.family === "IPv4" && !net.internal) {
          ipList.push(net.address);
        }
      }
    }

    return {
      platform: "node",
      hostname: os.hostname(),
      ips: ipList,
      nodeVersion: process.version,
      osType: os.type(),
      osPlatform: os.platform(),
      osRelease: os.release(),
      arch: os.arch(),
      uptime: os.uptime(),
      cpuCount: os.cpus().length,
      memory: process.memoryUsage(),
      pid: process.pid,
      execPath: process.execPath,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        APP_ENV: process.env.APP_ENV,
      },
    };
  }
}
