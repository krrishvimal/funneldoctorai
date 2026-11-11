import { FunnelDoctorTracker, initFunnelDoctor } from "./index.js";

// Auto-boot if loaded via `<script data-site-id="...">` in browser
// Wrapped in try/catch to guarantee zero merchant page interruption under any runtime error.
if (typeof window !== "undefined" && typeof document !== "undefined") {
  try {
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
  } catch (err) {
    // Fail silently: a CRO tracker must never break a merchant storefront or checkout
    if ((window as any).FD_DEBUG) {
      console.warn("[FunnelDoctor] Initialization failed gracefully:", err);
    }
  }
}

export { FunnelDoctorTracker, initFunnelDoctor };
