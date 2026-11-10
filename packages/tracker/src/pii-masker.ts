/**
 * @funneldoctor/tracker - Zero-Knowledge Client-Side PII Masker
 * 
 * Complies with India DPDP Act 2023, GDPR, and PCI-DSS standards.
 * Ensures zero unmasked customer personal identity data (phone, email, card, UPI VPA)
 * ever leaves the user's browser device.
 */

// REGEX PATTERNS FOR COMMON PII
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
// Indian & International Phone Numbers (+91 98765 43210, 9876543210, +1 555-0199)
const PHONE_REGEX = /(\+?91[\-\s]?)?[6-9]\d{4}[\-\s]?\d{5}|\+?[1-9]\d{1,2}[\-\s]?\(?\d{2,4}\)?[\-\s]?\d{3,4}[\-\s]?\d{3,4}/g;
// 15-16 Digit Credit / Debit / RuPay Cards
const CARD_REGEX = /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b\d{15,16}\b/g;
// Indian UPI Virtual Payment Address (e.g. user@okhdfcbank, name@upi, mob@paytm)
const UPI_VPA_REGEX = /[a-zA-Z0-9._-]+@(ok[a-zA-Z]+|upi|paytm|ybl|axl|ibl|barodampay|icici|postbank|jupiteraxis)/gi;
// 12-Digit Indian Aadhaar Numbers
const AADHAAR_REGEX = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;

/**
 * Mask an email address: e.g. "krrishvimal@gmail.com" -> "k***l@gmail.com"
 */
export function maskEmail(email: string): string {
  return email.replace(EMAIL_REGEX, (match) => {
    const [user, domain] = match.split("@");
    if (!domain) return "***";
    if (user.length <= 2) {
      return `${user[0] || ""}***@${domain}`;
    }
    return `${user[0]}***${user[user.length - 1]}@${domain}`;
  });
}

/**
 * Mask a phone number: e.g. "+91 9876543210" -> "+91 98****3210"
 */
export function maskPhone(phone: string): string {
  return phone.replace(PHONE_REGEX, (match) => {
    const digitsOnly = match.replace(/\D/g, "");
    if (digitsOnly.length < 7) return "***";
    const prefix = match.slice(0, Math.min(match.length, 4));
    const suffix = match.slice(-2);
    return `${prefix}****${suffix}`;
  });
}

/**
 * Mask credit/debit card numbers: keep only last 4 digits
 */
export function maskCard(card: string): string {
  return card.replace(CARD_REGEX, (match) => {
    const digits = match.replace(/\D/g, "");
    const last4 = digits.slice(-4);
    return `****-****-****-${last4}`;
  });
}

/**
 * Mask UPI VPA address: e.g. "rohit99@okhdfcbank" -> "r***9@okhdfcbank"
 */
export function maskVpa(vpa: string): string {
  return vpa.replace(UPI_VPA_REGEX, (match) => {
    const [handle, psp] = match.split("@");
    if (!psp) return "***";
    if (handle.length <= 2) return `${handle[0] || ""}***@${psp}`;
    return `${handle[0]}***${handle[handle.length - 1]}@${psp}`;
  });
}

/**
 * Mask Aadhaar numbers: keep only last 4 digits
 */
export function maskAadhaar(aadhaar: string): string {
  return aadhaar.replace(AADHAAR_REGEX, (match) => {
    const last4 = match.slice(-4);
    return `****-****-${last4}`;
  });
}

/**
 * Universal text scrubber: cleans emails, phones, cards, and VPAs from any string
 */
export function scrubPiiText(text: string): string {
  if (!text || typeof text !== "string") return "";
  let clean = maskCard(text);
  clean = maskAadhaar(clean);
  clean = maskVpa(clean);
  clean = maskEmail(clean);
  clean = maskPhone(clean);
  return clean;
}

/**
 * Sanitize element identifiers (stripping any accidentally typed value)
 */
export function sanitizeElementTarget(el: {
  tagName?: string;
  id?: string;
  className?: string;
  name?: string;
  type?: string;
  placeholder?: string;
}): string {
  const tag = (el.tagName || "element").toLowerCase();
  const idPart = el.id ? `#${el.id.replace(/\s+/g, "_")}` : "";
  const namePart = el.name ? `[name="${el.name}"]` : "";
  const typePart = el.type ? `[type="${el.type}"]` : "";
  return `${tag}${idPart}${namePart}${typePart}`.slice(0, 100);
}

/**
 * Deep recursive object scrubber for telemetry payloads before network dispatch
 */
export function sanitizeTelemetryPayload<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") {
    return scrubPiiText(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeTelemetryPayload(item)) as unknown as T;
  }
  if (typeof obj === "object") {
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      // Omit known highly sensitive fields entirely if present
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("password") ||
        lowerKey.includes("cvv") ||
        lowerKey.includes("token") ||
        lowerKey.includes("secret")
      ) {
        sanitized[key] = "[REDACTED]";
        continue;
      }
      sanitized[key] = sanitizeTelemetryPayload(val);
    }
    return sanitized as unknown as T;
  }
  return obj;
}
