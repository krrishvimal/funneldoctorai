import { TelemetryEvent } from "./types.js";
import { sanitizeElementTarget, scrubPiiText } from "./pii-masker.js";

export interface DwellTrackerCallback {
  (event: TelemetryEvent): void;
}

/**
 * Checks whether an element contains sensitive financial, authentication, or PII inputs.
 * When true, the element is completely bypassed—neither dwell time, character length,
 * validity status, nor abandonment telemetry is ever accessed, stored, or transmitted.
 */
export function isSensitiveElement(el: HTMLElement | null): boolean {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  if (tag !== "input" && tag !== "textarea") return false;

  const input = el as HTMLInputElement;
  if (input.type === "password") return true;

  const combined = [
    input.name,
    input.id,
    input.autocomplete,
    input.getAttribute("data-sensitive"),
    input.getAttribute("aria-label"),
    input.placeholder,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /(card|cc-|pan|cvv|cvc|exp|otp|pin|pass|ssn|aadhaar|vpa|secret)/i.test(combined);
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
    // Completely bypass sensitive card, CVV, OTP, and password fields
    if (!this.isFormElement(target) || isSensitiveElement(target)) return;

    this.activeElement = target;
    this.focusStartTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  };

  private handleFocusOut = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!this.isFormElement(target) || target !== this.activeElement) return;

    // Redundant guard: never touch or measure sensitive fields
    if (isSensitiveElement(target)) {
      this.activeElement = null;
      return;
    }

    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const dwellMs = Math.round(now - this.focusStartTime);

    // Filter out rapid tabbing through inputs (< 300ms)
    if (dwellMs >= 300) {
      const inputEl = target as HTMLInputElement;
      const isInput = typeof inputEl.value !== "undefined";
      const charLength = isInput ? String(inputEl.value).length : 0;
      const isValid = typeof inputEl.checkValidity === "function" ? inputEl.checkValidity() : true;

      // Metadata-Only Tracking: Never stores or transmits field contents
      this.onEvent({
        type: "field_dwell",
        target: sanitizeElementTarget(target),
        dwellMs,
        metadata: {
          charLength,
          isValid,
          isDirty: this.dirtyFields.has(target),
        },
        timestamp: Date.now(),
      });
    }

    this.activeElement = null;
  };

  private handleInvalid = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target || isSensitiveElement(target)) return;

    // Categorical validity reason without touching typed sensitive text
    const validity = target.validity;
    const reason = validity?.valueMissing
      ? "required_field_missing"
      : validity?.patternMismatch
        ? "pattern_mismatch"
        : validity?.typeMismatch
          ? "type_mismatch"
          : validity?.tooShort
            ? "too_short"
            : validity?.tooLong
              ? "too_long"
              : "validation_failed";

    this.onEvent({
      type: "field_error",
      target: sanitizeElementTarget(target),
      metadata: {
        errorType: reason,
        isValid: false,
      },
      timestamp: Date.now(),
    });
  };

  private handleInput = (e: Event) => {
    const target = e.target as HTMLElement;
    if (this.isFormElement(target) && !isSensitiveElement(target)) {
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
    // If user spent time on an un-submitted non-sensitive dirty field and abandoned
    if (this.activeElement && this.dirtyFields.has(this.activeElement)) {
      if (isSensitiveElement(this.activeElement as HTMLElement)) {
        this.activeElement = null;
        return;
      }

      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const dwellMs = Math.round(now - this.focusStartTime);
      const inputEl = this.activeElement as HTMLInputElement;
      const isInput = typeof inputEl.value !== "undefined";
      const charLength = isInput ? String(inputEl.value).length : 0;

      // Metadata-Only Tracking: Record field length and timing, never typed value
      this.onEvent({
        type: "abandonment",
        target: sanitizeElementTarget(this.activeElement),
        dwellMs,
        metadata: {
          charLength,
          isDirty: true,
        },
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
