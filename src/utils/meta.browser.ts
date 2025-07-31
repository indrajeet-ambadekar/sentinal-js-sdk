export function gatherMetaData() {
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
