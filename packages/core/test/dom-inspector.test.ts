import { describe, it, expect } from "vitest";
import { inspectD2CDom } from "../src/dom-inspector.js";

describe("D2C DOM Inspector", () => {
  it("detects high-friction checkout signals on unoptimized Indian D2C HTML", () => {
    const brokenD2CHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Classic D2C Store - Checkout</title>
        </head>
        <body>
          <h1>Checkout Step 4</h1>
          <form id="checkout-form">
            <input type="text" name="customer_name" placeholder="Full Name" required />
            <input type="text" name="customer_phone" placeholder="Phone Number" required />
            <input type="email" name="customer_email" placeholder="Email" required />
            <input type="text" name="address_line1" placeholder="Flat / Street" required />
            <input type="text" name="address_line2" placeholder="Landmark" />
            <input type="text" name="city" placeholder="City" required />
            <input type="text" name="state" placeholder="State" required />
            <input type="text" name="pincode" placeholder="Pincode" required />
            
            <div class="payment-methods">
              <label>Enter UPI ID (e.g. name@okhdfcbank):</label>
              <input type="text" name="vpa" placeholder="user@okhdfcbank" />
              <p>Standard shipping: ₹149 delivery fee applies at final step</p>
            </div>

            <button type="submit">Complete Order</button>
          </form>
        </body>
      </html>
    `;

    const result = inspectD2CDom(brokenD2CHtml, "https://test-broken-d2c.in/checkout");

    expect(result.hasMobileViewportMeta).toBe(false);
    expect(result.totalInputFields).toBe(9);
    expect(result.phoneInputConfig.hasPhoneInput).toBe(true);
    expect(result.phoneInputConfig.hasTelType).toBe(false); // Flagged because type="text"
    expect(result.paymentMethodsDetected.hasUpi).toBe(true);
    expect(result.paymentMethodsDetected.hasManualVpaInput).toBe(true);
    expect(result.paymentMethodsDetected.has1TapUpiIntent).toBe(false);
    expect(result.pricingAndShippingClues.hasLateShippingChargeMention).toBe(true);
    expect(result.heuristicRiskScore).toBeGreaterThan(60);
    expect(result.heuristicFlags.length).toBeGreaterThan(2);
  });

  it("recognizes optimized 1-Tap UPI checkout patterns with low friction score", () => {
    const modernCheckoutHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Modern Fast D2C Checkout</title>
        </head>
        <body>
          <div class="checkout-container">
            <div class="free-shipping-badge">Free Shipping All Orders</div>
            <form>
              <input type="tel" inputmode="numeric" name="phone" placeholder="Enter Mobile Number" required />
            </form>
            <div class="upi-intent-selector" data-upi-intent="true">
              <button class="upi-app gpay">Pay with GPay</button>
              <button class="upi-app phonepe">Pay with PhonePe</button>
            </div>
            <div class="fixed bottom-0 w-full">
              <button class="checkout-btn">1-Tap Express Pay ₹1,499</button>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = inspectD2CDom(modernCheckoutHtml, "https://fastcheckout.in");

    expect(result.hasMobileViewportMeta).toBe(true);
    expect(result.totalInputFields).toBe(1);
    expect(result.phoneInputConfig.hasTelType).toBe(true);
    expect(result.phoneInputConfig.hasNumericInputMode).toBe(true);
    expect(result.paymentMethodsDetected.has1TapUpiIntent).toBe(true);
    expect(result.pricingAndShippingClues.hasFreeShippingBadge).toBe(true);
    expect(result.pricingAndShippingClues.hasLateShippingChargeMention).toBe(false);
    expect(result.primaryCta.hasStickyPositioning).toBe(true);
    expect(result.heuristicRiskScore).toBeLessThan(40);
  });

  it("handles malformed or empty HTML gracefully without throwing exceptions", () => {
    const result = inspectD2CDom("", "https://empty.com");
    expect(result.isReachable).toBe(true);
    expect(result.totalInputFields).toBe(0);
    expect(result.hasMobileViewportMeta).toBe(false);
    expect(result.heuristicRiskScore).toBeGreaterThanOrEqual(10);
  });
});
