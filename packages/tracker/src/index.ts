import { FunnelDoctorTrackerOptions, TelemetryEvent } from "./types.js";
import { DwellTracker } from "./dwell-tracker.js";
import { RageClickTracker } from "./rage-click-tracker.js";
import { EventDispatcher } from "./dispatcher.js";
import {
  maskEmail,
  maskPhone,
  maskCard,
  maskVpa,
  maskAadhaar,
  scrubPiiText,
  sanitizeTelemetryPayload,
  sanitizeElementTarget,
} from "./pii-masker.js";

export * from "./types.js";
export {
  maskEmail,
  maskPhone,
  maskCard,
  maskVpa,
  maskAadhaar,
  scrubPiiText,
  sanitizeTelemetryPayload,
  sanitizeElementTarget,
};

export class FunnelDoctorTracker {
  private options: FunnelDoctorTrackerOptions;
  private sessionId: string;
  private dispatcher: EventDispatcher;
  private dwellTracker: DwellTracker;
  private rageClickTracker: RageClickTracker;
  private isAttached = false;

  constructor(options: FunnelDoctorTrackerOptions) {
    this.options = options;
    this.sessionId = this.getOrCreateSessionId();
    this.dispatcher = new EventDispatcher(options, this.sessionId);

    const handleEvent = (event: TelemetryEvent) => {
      this.dispatcher.enqueue(event);
    };

    this.dwellTracker = new DwellTracker(handleEvent);
    this.rageClickTracker = new RageClickTracker(handleEvent);
  }

  public init() {
    if (this.isAttached) return;
    if (typeof document === "undefined") return;

    this.dwellTracker.attach();
    this.rageClickTracker.attach();
    this.isAttached = true;

    // Emit initial page view
    this.trackStep(typeof window !== "undefined" ? window.location.pathname : "home");

    if (this.options.debug) {
      console.log(`[FunnelDoctor] Tracking initialized for site: ${this.options.siteId}`);
    }
  }

  public trackStep(stepName: string, metadata?: Record<string, string | number | boolean>) {
    this.dispatcher.enqueue({
      type: "step_view",
      target: stepName,
      metadata,
      timestamp: Date.now(),
    });
  }

  public trackCustomFriction(frictionType: string, elementSelector: string, dwellMs?: number) {
    this.dispatcher.enqueue({
      type: "field_error",
      target: elementSelector,
      dwellMs,
      metadata: { customFriction: frictionType },
      timestamp: Date.now(),
    });
  }

  public destroy() {
    if (!this.isAttached) return;
    this.dwellTracker.detach();
    this.rageClickTracker.detach();
    this.dispatcher.stop();
    this.isAttached = false;
  }

  private getOrCreateSessionId(): string {
    const KEY = "fd_session_id";
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        let sid = sessionStorage.getItem(KEY);
        if (!sid) {
          sid = "fd_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
          sessionStorage.setItem(KEY, sid);
        }
        return sid;
      }
    } catch {
      // Fallback if storage access is restricted
    }
    return "fd_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }
}

/**
 * Convenience initializer for client applications
 */
export function initFunnelDoctor(options: FunnelDoctorTrackerOptions): FunnelDoctorTracker {
  const tracker = new FunnelDoctorTracker(options);
  tracker.init();
  return tracker;
}
