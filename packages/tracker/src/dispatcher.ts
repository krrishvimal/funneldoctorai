import { TelemetryBatch, TelemetryEvent, FunnelDoctorTrackerOptions, TelemetryViewport } from "./types.js";
import { sanitizeTelemetryPayload } from "./pii-masker.js";

export class EventDispatcher {
  private queue: TelemetryEvent[] = [];
  private options: FunnelDoctorTrackerOptions;
  private sessionId: string;
  private timer: any = null;

  constructor(options: FunnelDoctorTrackerOptions, sessionId: string) {
    this.options = {
      endpoint: "https://funneldoctor.ai/api/ingest",
      batchIntervalMs: 3000,
      maxBatchSize: 10,
      debug: false,
      ...options,
    };
    this.sessionId = sessionId;
    this.startTimer();
  }

  public enqueue(event: TelemetryEvent) {
    this.queue.push(event);

    if (this.options.debug) {
      console.log(`[FunnelDoctor Telemetry] Enqueued ${event.type}:`, event);
    }

    if (this.queue.length >= (this.options.maxBatchSize || 10)) {
      this.flush();
    }
  }

  public flush() {
    if (this.queue.length === 0) return;

    const eventsToSend = [...this.queue];
    this.queue = [];

    const viewport: TelemetryViewport = {
      width: typeof window !== "undefined" ? window.innerWidth : 393,
      height: typeof window !== "undefined" ? window.innerHeight : 852,
      isMobile: typeof window !== "undefined" ? window.innerWidth <= 768 : true,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    };

    const rawBatch: TelemetryBatch = {
      siteId: this.options.siteId,
      sessionId: this.sessionId,
      url: typeof window !== "undefined" ? window.location.href : "",
      viewport,
      events: eventsToSend,
      sentAt: Date.now(),
    };

    // Client-side Zero-Knowledge PII Masking BEFORE network dispatch
    const cleanBatch = sanitizeTelemetryPayload(rawBatch);
    const payloadJson = JSON.stringify(cleanBatch);
    const endpoint = this.options.endpoint || "/api/ingest";

    try {
      // 1. Prefer navigator.sendBeacon (zero-blocking, runs even if tab closes)
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([payloadJson], { type: "application/json" });
        const enqueued = navigator.sendBeacon(endpoint, blob);
        if (enqueued) return;
      }

      // 2. Fallback to fetch with keepalive: true
      if (typeof fetch === "function") {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payloadJson,
          keepalive: true,
        }).catch((err) => {
          if (this.options.debug) console.warn("[FunnelDoctor] Dispatch error:", err);
        });
      }
    } catch (err) {
      if (this.options.debug) console.warn("[FunnelDoctor] Dispatch failed:", err);
    }
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.flush();
  }

  private startTimer() {
    if (typeof window === "undefined") return;
    this.timer = setInterval(() => {
      this.flush();
    }, this.options.batchIntervalMs || 3000);

    // Flush automatically when user navigates away
    window.addEventListener("pagehide", () => this.flush());
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flush();
      }
    });
  }
}
