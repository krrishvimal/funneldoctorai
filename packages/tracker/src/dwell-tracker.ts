import { TelemetryEvent } from "./types.js";
import { sanitizeElementTarget, scrubPiiText } from "./pii-masker.js";

export interface DwellTrackerCallback {
  (event: TelemetryEvent): void;
}

// Standard W3C HTML5 autocomplete tokens for sensitive payment and authentication credentials
const SENSITIVE_AUTOCOMPLETE_TOKENS = new Set([
  "cc-number",
  "cc-csc",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-type",
  "current-password",
  "new-password",
  "one-time-code",
]);

/**
 * Checks whether an element contains sensitive financial, authentication, or PII inputs.
 * Uses an allowlist architecture combined with W3C autocomplete signals:
 * - Approved CRO fields (pincode, address, city, phone, email, coupon) are explicitly ALLOWED.
 * - Sensitive credentials (card numbers, CVV, OTP, passwords) are completely BYPASSED.
 */
export function isSensitiveElement(el: HTMLElement | null): boolean {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  if (tag !== "input" && tag !== "textarea") return false;

  const input = el as HTMLInputElement;

  // 1. Password fields are always sensitive
  if (input.type === "password") return true;

  // 2. Standard W3C Autocomplete Check (authoritative browser signal)
  const autocomplete = (input.autocomplete || "").trim().toLowerCase();
  if (autocomplete && SENSITIVE_AUTOCOMPLETE_TOKENS.has(autocomplete)) {
    return true;
  }

  // Find associated label text if available
  let labelText = "";
  if (input.id && typeof document !== "undefined") {
    try {
      const labelEl = document.querySelector(`label[for="${input.id}"]`);
      if (labelEl) labelText = labelEl.textContent || "";
    } catch {
      // Selector parse error
    }
  }

  const combined = [
    input.name,
    input.id,
    input.getAttribute("data-sensitive"),
    input.getAttribute("aria-label"),
    input.placeholder,
    labelText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // 3. Approved CRO Allowlist (Delivery pincodes, shipping addresses, customer names, coupons)
  // Must NOT be blocked by substring collisions (e.g. "pincode" containing "pin" or "express" containing "exp")
  const isApprovedCroField = /\b(pincode|postal|zip|zipcode|postal_code|address|addr|street|city|state|province|phone|mobile|telephone|email|first_name|last_name|fname|lname|full_name|name|coupon|discount|promo|note|company)\b/i.test(combined);

  // 4. Strict Sensitive Token Matching (Boundaried tokens only, avoiding bare "pin", "pan", "exp")
  const isSensitiveToken = /\b(cvv|cvc|cvn|card_number|cardnumber|credit_card|debit_card|card_exp|card_expiry|otp|upi_pin|atm_pin|bank_account|ssn|aadhaar|secret)\b/i.test(combined) ||
    /cc[-_](num|sec|csc)/i.test(combined);

  if (isSensitiveToken) return true;
  if (isApprovedCroField) return false;

  // Default: if field has unknown/suspicious keywords
  return /\b(card|password|passwd|token)\b/i.test(combined);
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
