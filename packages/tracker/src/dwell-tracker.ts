import { TelemetryEvent } from "./types.js";
import { sanitizeElementTarget, scrubPiiText } from "./pii-masker.js";

export interface DwellTrackerCallback {
  (event: TelemetryEvent): void;
}

export class DwellTracker {
  private activeElement: Element | null = null;
  private focusStartTime: number = 0;
  private dirtyFields = new Set<Element>();
  private onEvent: DwellTrackerCallback;

  constructor(onEvent: DwellTrackerCallback) {
    this.onEvent = onEvent;
  }

  public attach(root: Document | HTMLElement = document) {
    root.addEventListener("focusin", this.handleFocusIn, true);
    root.addEventListener("focusout", this.handleFocusOut, true);
    root.addEventListener("invalid", this.handleInvalid, true);
    root.addEventListener("input", this.handleInput, true);

    // Track abandonment when tab is closed or hidden
    if (typeof window !== "undefined") {
      window.addEventListener("pagehide", this.handlePageHide);
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }
  }

  public detach(root: Document | HTMLElement = document) {
    root.removeEventListener("focusin", this.handleFocusIn, true);
    root.removeEventListener("focusout", this.handleFocusOut, true);
    root.removeEventListener("invalid", this.handleInvalid, true);
    root.removeEventListener("input", this.handleInput, true);

    if (typeof window !== "undefined") {
      window.removeEventListener("pagehide", this.handlePageHide);
      document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    }
  }

  private handleFocusIn = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!this.isFormElement(target)) return;

    this.activeElement = target;
    this.focusStartTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  };

  private handleFocusOut = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!this.isFormElement(target) || target !== this.activeElement) return;

    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const dwellMs = Math.round(now - this.focusStartTime);

    // Filter out rapid tabbing through inputs (< 300ms)
    if (dwellMs >= 300) {
      this.onEvent({
        type: "field_dwell",
        target: sanitizeElementTarget(target),
        dwellMs,
        timestamp: Date.now(),
      });
    }

    this.activeElement = null;
  };

  private handleInvalid = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;

    const message = target.validationMessage ? scrubPiiText(target.validationMessage) : "Invalid input";

    this.onEvent({
      type: "field_error",
      target: sanitizeElementTarget(target),
      metadata: {
        error: message,
      },
      timestamp: Date.now(),
    });
  };

  private handleInput = (e: Event) => {
    const target = e.target as HTMLElement;
    if (this.isFormElement(target)) {
      this.dirtyFields.add(target);
    }
  };

  private handlePageHide = () => {
    this.flushAbandonment();
  };

  private handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      this.flushAbandonment();
    }
  };

  private flushAbandonment() {
    // If user spent time on an un-submitted dirty field and abandoned
    if (this.activeElement && this.dirtyFields.has(this.activeElement)) {
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const dwellMs = Math.round(now - this.focusStartTime);

      this.onEvent({
        type: "abandonment",
        target: sanitizeElementTarget(this.activeElement),
        dwellMs,
        timestamp: Date.now(),
      });
    }
  }

  private isFormElement(el: HTMLElement | null): boolean {
    if (!el || !el.tagName) return false;
    const tag = el.tagName.toLowerCase();
    return tag === "input" || tag === "select" || tag === "textarea" || el.isContentEditable;
  }
}
