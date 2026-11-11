import { TelemetryBatch, TelemetryEvent, FunnelDoctorTrackerOptions, TelemetryViewport } from "./types.js";
import { sanitizeTelemetryPayload } from "./pii-masker.js";

export class EventDispatcher {
  private queue: TelemetryEvent[] = [];
  private options: FunnelDoctorTrackerOptions;
  private sessionId: string;
  private timer: any = null;
  private isKilled = false;

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
    if (this.isKilled) return;
    this.queue.push(event);

    if (this.options.debug) {
      console.log(`[FunnelDoctor Telemetry] Enqueued ${event.type}:`, event);
    }

    if (this.queue.length >= (this.options.maxBatchSize || 10)) {
      this.flush();
    }
  }

  public flush() {
    if (this.isKilled || this.queue.length === 0) return;

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
      merchantKey: this.options.merchantKey,
      sessionId: this.sessionId,
      url: typeof window !== "undefined" ? window.location.href : "",
      viewport,
      events: eventsToSend,
      sentAt: Date.now(),
    };

    // Client-side PII Masking BEFORE network dispatch
    const cleanBatch = sanitizeTelemetryPayload(rawBatch);
    const payloadJson = JSON.stringify(cleanBatch);
    const endpoint = this.options.endpoint || "/api/ingest";

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (this.options.merchantKey) {
        headers["X-Merchant-Key"] = this.options.merchantKey;
      }

      // Check fetch support
      if (typeof fetch === "function") {
        fetch(endpoint, {
          method: "POST",
          headers,
          body: payloadJson,
          keepalive: true,
        })
          .then(async (res) => {
            if (res.status === 403) {
              const body = await res.json().catch(() => ({}));
              if (body?.killSwitch) {
                this.engageKillSwitch();
              }
            }
          })
          .catch((err) => {
            if (this.options.debug) console.warn("[FunnelDoctor] Dispatch error:", err);
          });
      } else if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([payloadJson], { type: "application/json" });
        navigator.sendBeacon(endpoint, blob);
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

  public engageKillSwitch() {
    this.isKilled = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.queue = [];
    if (this.options.debug) {
      console.warn("[FunnelDoctor] Remote kill-switch engaged. Telemetry halted.");
    }
    this.options.onKillSwitch?.();
  }

  private startTimer() {
    if (typeof window === "undefined") return;
    this.timer = setInterval(() => {
      this.flush();
    }, this.options.batchIntervalMs || 3000);

    // Flush automatically when user navigates away
    window.addEventListener("pagehide", () => this.flush());
  }
}
