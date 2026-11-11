import { describe, it, expect } from "vitest";
import { isSensitiveElement } from "../src/dwell-tracker.js";

describe("Field-Name Governance & Deny-First Allowlist", () => {
  const table = [
    // Real Shopify Checkout Fields
    { name: "checkout[shipping_address][zip]", type: "text", expectedSensitive: false, desc: "Shopify shipping zip / pincode" },
    { name: "checkout[shipping_address][address1]", type: "text", expectedSensitive: false, desc: "Shopify shipping address line 1" },
    { name: "checkout[shipping_address][city]", type: "text", expectedSensitive: false, desc: "Shopify shipping city" },
    { name: "checkout[shipping_address][first_name]", type: "text", expectedSensitive: false, desc: "Shopify customer first name" },
    { name: "checkout[shipping_address][phone]", type: "tel", expectedSensitive: false, desc: "Shopify customer phone" },
    { name: "checkout[reduction_code]", type: "text", expectedSensitive: false, desc: "Shopify discount coupon code" },
    
    // Real WooCommerce Checkout Fields
    { name: "billing_postcode", type: "text", expectedSensitive: false, desc: "WooCommerce billing postcode" },
    { name: "billing_address_1", type: "text", expectedSensitive: false, desc: "WooCommerce billing address" },
    { name: "billing_city", type: "text", expectedSensitive: false, desc: "WooCommerce billing city" },
    { name: "billing_company", type: "text", expectedSensitive: false, desc: "WooCommerce company name" },
    { name: "order_comments", type: "text", expectedSensitive: false, desc: "WooCommerce order notes" },
    { name: "express_shipping_method", type: "text", expectedSensitive: false, desc: "Express delivery selection" },

    // Sensitive Payment & Auth Credentials (Must be Denied / Skipped)
    { name: "billing_phone_otp", type: "text", expectedSensitive: true, desc: "SMS/Phone OTP input" },
    { name: "checkout[credit_card][number]", type: "text", autocomplete: "cc-number", expectedSensitive: true, desc: "Credit card number" },
    { name: "checkout[credit_card][verification_value]", type: "text", autocomplete: "cc-csc", expectedSensitive: true, desc: "Card CVV / CSC" },
    { name: "card_holder_name", type: "text", autocomplete: "cc-name", expectedSensitive: true, desc: "Cardholder name" },
    { name: "checkout[credit_card][name]", type: "text", expectedSensitive: true, desc: "Name on card" },
    { name: "user_password", type: "password", expectedSensitive: true, desc: "Account password" },
    { name: "auth_one_time_code", type: "text", autocomplete: "one-time-code", expectedSensitive: true, desc: "MFA one-time code" },
    { name: "upi_pin_input", type: "password", expectedSensitive: true, desc: "UPI PIN input" },
  ];

  table.forEach((row) => {
    it(`evaluates '${row.name}' as sensitive=${row.expectedSensitive} (${row.desc})`, () => {
      // Create mock HTMLInputElement
      const mockInput = {
        tagName: "INPUT",
        type: row.type || "text",
        name: row.name,
        id: row.name.replace(/[^a-zA-Z0-9]/g, "_"),
        autocomplete: row.autocomplete || "",
        getAttribute: (attr: string) => (attr === "aria-label" ? row.desc : null),
      } as any;

      const isSensitive = isSensitiveElement(mockInput);
      expect(isSensitive).toBe(row.expectedSensitive);
    });
  });
});
