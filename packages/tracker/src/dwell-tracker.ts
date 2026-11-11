import { TelemetryEvent } from "./types.js";
import { sanitizeElementTarget } from "./pii-masker.js";

export interface DwellTrackerCallback {
  (event: TelemetryEvent): void;
}

// Standard W3C HTML5 autocomplete tokens for sensitive payment and authentication credentials
const SENSITIVE_AUTOCOMPLETE_TOKENS = new Set([
  "cc-name",
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
 *
 * Architecture & Governance Rule:
 * 1. DENY RULES RUN FIRST AND ALWAYS WIN. If any attribute or label indicates a payment credential,
 *    password, or security code, the field is rejected immediately.
 * 2. Delimiter-aware token matching is used instead of \b (since \b treats underscores as word chars,
 *    which causes \botp\b to miss 'phone_otp' and \baddress\b to miss 'shipping_address').
 * 3. Approved CRO allowlist (pincodes, shipping addresses, phone, email, coupons) runs SECOND.
 * 4. Anything unmatched is ignored/bypassed by default.
 */
export function isSensitiveElement(el: HTMLElement | null): boolean {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  if (tag !== "input" && tag !== "textarea") return false;

  const input = el as HTMLInputElement;

  // 1. Password fields are always sensitive (Immediate Deny)
  if (input.type === "password") return true;

  // 2. Standard W3C Autocomplete Check (Immediate Deny)
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

  // Combine attributes with space delimiters
  const rawCombined = [
    input.name,
    input.id,
    input.getAttribute("data-sensitive"),
    input.getAttribute("aria-label"),
    input.placeholder,
    labelText,
  ]
    .filter(Boolean)
    .join(" ");

  // 1. Split uppercase acronym runs (e.g. 'OTPCode' -> 'OTP Code', 'UPINumber' -> 'UPI Number')
  const splitAcronyms = rawCombined.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");

  // 2. Normalize standard camelCase (e.g. 'phoneOtp' -> 'phone Otp', 'cardNumber' -> 'card Number', 'upiPin' -> 'upi Pin')
  const splitCamel = splitAcronyms.replace(/([a-z0-9])([A-Z])/g, "$1 $2");

  // 3. Normalize delimiters (replace underscores, hyphens, brackets, dots with spaces)
  // This solves the JavaScript \b bug where \w treats '_' as a word character.
  const normalized = splitCamel.toLowerCase().replace(/[_\[\]\-\.]+/g, " ");

  // 3. DENY RULES (Run First): Strict Payment Credentials, CVVs, OTPs, PINs, and Cardholder Names
  // Matches tokens even when prefixed/suffixed (e.g. 'phone_otp', 'phoneOtp', 'OTPCode', 'upiPin', 'mpin')
  // Note: Bare 'pin' is NOT used to prevent collision with Indian postal 'pin_code' or 'billing_pin'.
  const isSensitiveCredential =
    /\b(cvv|cvc|cvn|card\s*number|credit\s*card|debit\s*card|debit\s*card\s*pin|card\s*exp|card\s*expiry|card\s*holder|card\s*name|otp|one\s*time\s*code|upi\s*pin|atm\s*pin|security\s*pin|mpin|m\s*pin|bank\s*account|ssn|aadhaar|secret)\b/i.test(normalized) ||
    /\bname on card\b/i.test(normalized) ||
    /\b(card|cc)\s+(num|number|sec|csc|cvv|code|exp)\b/i.test(normalized);

  if (isSensitiveCredential) {
    return true; // Sensitive deny rule wins unconditionally
  }

  // 4. APPROVED CRO ALLOWLIST (Runs Second): Non-sensitive delivery, address, and coupon fields
  if (autocomplete === "postal-code" || autocomplete === "tel" || autocomplete === "email") {
    return false; // Standard W3C non-sensitive CRO fields
  }

  const isApprovedCroField =
    /\b(pin\s*code|pincode|postcode|post\s*code|postal|postal\s*code|zip|zipcode|zip\s*code|billing\s*pin|delivery\s*pin|shipping\s*pin|shipping\s*address|billing\s*address|address|addr|street|city|state|province|country|phone|mobile|telephone|email|first\s*name|last\s*name|fname|lname|full\s*name|coupon|discount|promo|note|notes|comment|comments|company|shipping|delivery|express)\b/i.test(normalized) ||
    /^(first|last)?name$/i.test(input.name || "");

  if (isApprovedCroField) {
    return false; // Approved CRO field, safe to track
  }

  // 5. DEFAULT DENY: Any unrecognized or ambiguous field is bypassed
  return true;
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
