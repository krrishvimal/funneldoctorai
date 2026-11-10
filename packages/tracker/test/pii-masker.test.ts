import { describe, it, expect } from "vitest";
import {
  maskEmail,
  maskPhone,
  maskCard,
  maskVpa,
  maskAadhaar,
  scrubPiiText,
  sanitizeTelemetryPayload,
  sanitizeElementTarget,
} from "../src/pii-masker.js";

describe("Zero-Knowledge Client-Side PII Masker (DPDP Act & GDPR)", () => {
  it("correctly masks email addresses", () => {
    expect(maskEmail("krrishvimal@gmail.com")).toBe("k***l@gmail.com");
    expect(maskEmail("rohit@startup.co.in")).toBe("r***t@startup.co.in");
    expect(maskEmail("ab@xyz.com")).toBe("a***@xyz.com");
  });

  it("correctly masks Indian and international phone numbers", () => {
    expect(maskPhone("+91 9876543210")).toContain("****");
    expect(maskPhone("+91 9876543210")).not.toBe("+91 9876543210");
    expect(maskPhone("9876543210")).toContain("****");
  });

  it("correctly masks credit and debit cards preserving only last 4 digits", () => {
    expect(maskCard("4111 2222 3333 4444")).toBe("****-****-****-4444");
    expect(maskCard("5555666677778888")).toBe("****-****-****-8888");
  });

  it("correctly masks Indian UPI VPA IDs", () => {
    expect(maskVpa("krrish@okhdfcbank")).toBe("k***h@okhdfcbank");
    expect(maskVpa("rohit99@paytm")).toBe("r***9@paytm");
    expect(maskVpa("merchant@upi")).toBe("m***t@upi");
  });

  it("correctly masks Aadhaar numbers", () => {
    expect(maskAadhaar("1234 5678 9012")).toBe("****-****-9012");
  });

  it("scrubs mixed customer text completely", () => {
    const dirty = "User krrish@gmail.com paid with UPI krrish@okhdfcbank and phone 9876543210";
    const scrubbed = scrubPiiText(dirty);
    expect(scrubbed).not.toContain("krrish@gmail.com");
    expect(scrubbed).not.toContain("9876543210");
    expect(scrubbed).toContain("@okhdfcbank");
    expect(scrubbed).toContain("k***h@okhdfcbank");
  });

  it("deeply scrubs telemetry payload objects and redacts passwords/cvvs", () => {
    const payload = {
      siteId: "mystore.in",
      user: {
        email: "shopper@domain.com",
        phone: "+91 9876543210",
        password: "superSecretPassword123!",
        cardCvv: "999",
      },
      events: [
        {
          type: "field_dwell",
          target: "input#pincode",
          metadata: { note: "Typed for rohit@okhdfcbank" },
        },
      ],
    };

    const sanitized = sanitizeTelemetryPayload(payload);
    expect(sanitized.user.password).toBe("[REDACTED]");
    expect(sanitized.user.cardCvv).toBe("[REDACTED]");
    expect(sanitized.user.email).toBe("s***r@domain.com");
    expect(sanitized.events[0].metadata.note).toContain("r***t@okhdfcbank");
  });

  it("sanitizes element targets cleanly without leaking input values", () => {
    const target = sanitizeElementTarget({
      tagName: "INPUT",
      id: "mobile-number-input",
      name: "phone",
      type: "tel",
    });
    expect(target).toBe('input#mobile-number-input[name="phone"][type="tel"]');
  });
});
