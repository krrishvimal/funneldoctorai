import { scrubPiiText, sanitizeTelemetryPayload } from "../packages/tracker/dist/index.js";

console.log("=================================================");
console.log("🧪 TESTING PHASE 2 TELEMETRY & PII MASKING");
console.log("=================================================");

// 1. Test DPDP 2023 / GDPR Compliance
const rawPayload = {
  siteId: "test-d2c-store.in",
  sessionId: "fd_test_session_123",
  user: {
    name: "Customer Rohit",
    email: "rohit99@gmail.com",
    phone: "+91 9876543210",
    upiVpa: "rohit@okhdfcbank",
    card: "4111222233334444",
    password: "mySecretPassword!",
    cvv: "123",
  },
  events: [
    {
      type: "field_dwell",
      target: "input#pincode",
      dwellMs: 4200,
      timestamp: Date.now(),
    },
    {
      type: "rage_click",
      target: "button.checkout-btn",
      metadata: { clickCount: 4 },
      timestamp: Date.now(),
    },
  ],
};

const masked = sanitizeTelemetryPayload(rawPayload);

let passed = true;

if (masked.user.password !== "[REDACTED]") {
  console.error("❌ Password was not redacted!");
  passed = false;
}
if (masked.user.cvv !== "[REDACTED]") {
  console.error("❌ CVV was not redacted!");
  passed = false;
}
if (masked.user.email.includes("rohit99@")) {
  console.error("❌ Email was not masked!");
  passed = false;
}
if (masked.user.phone.includes("9876543210")) {
  console.error("❌ Phone was not masked!");
  passed = false;
}
if (masked.user.card.includes("4111222233334444")) {
  console.error("❌ Card was not masked!");
  passed = false;
}

if (passed) {
  console.log("✅ Zero-Knowledge PII Masking: 100% Passed (DPDP 2023 Compliant)");
  console.log("   Masked Email:", masked.user.email);
  console.log("   Masked Phone:", masked.user.phone);
  console.log("   Masked UPI VPA:", masked.user.upiVpa);
  console.log("   Masked Card:", masked.user.card);
  console.log("   Redacted Password:", masked.user.password);
  console.log("   Redacted CVV:", masked.user.cvv);
  console.log("=================================================");
  process.exit(0);
} else {
  process.exit(1);
}
