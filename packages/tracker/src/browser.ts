import { FunnelDoctorTracker, initFunnelDoctor } from "./index.js";

// Auto-boot if loaded via `<script data-site-id="...">` in browser
if (typeof window !== "undefined" && typeof document !== "undefined") {
  const currentScript =
    document.currentScript ||
    document.querySelector('script[src*="funneldoctor"]');

  const siteId =
    currentScript?.getAttribute("data-site-id") ||
    (window as any).FD_SITE_ID ||
    window.location.hostname;

  const endpoint =
    currentScript?.getAttribute("data-endpoint") ||
    (window as any).FD_ENDPOINT ||
    "https://funneldoctor.ai/api/ingest";

  const debug = currentScript?.hasAttribute("data-debug") || false;

  const tracker = initFunnelDoctor({
    siteId,
    endpoint,
    debug,
  });

  (window as any).FunnelDoctor = tracker;
}

export { FunnelDoctorTracker, initFunnelDoctor };
