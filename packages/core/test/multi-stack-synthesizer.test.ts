import { describe, it, expect } from "vitest";
import { synthesizeMultiStackRemediation } from "../src/multi-stack-synthesizer.js";

describe("MultiStackSynthesizer", () => {
  it("synthesizes React, Shopify Liquid, and Vanilla JS components", () => {
    const result = synthesizeMultiStackRemediation({
      brandName: "Snitch",
      domain: "snitch.co.in",
      worstStepName: "03. Checkout Payment Gate",
      aov: 1699,
      dropoffRate: 58.2,
      upiMerchantVpa: "snitch@icici",
      freeShippingThreshold: 999,
    });

    // 1. Verify React output
    expect(result.reactCode).toContain("FunnelDoctorOneTapCheckout");
    expect(result.reactCode).toContain("upi://pay?pa=snitch@icici");
    expect(result.reactCode).toContain('inputMode="numeric"');
    expect(result.reactCode).toContain("1-Tap Express Pay");

    // 2. Verify Shopify Liquid output
    expect(result.shopifyLiquid).toContain("cart.total_price | money_with_currency");
    expect(result.shopifyLiquid).toContain("snippets/funneldoctor-1tap-checkout.liquid");
    expect(result.shopifyLiquid).toContain("inputmode=\"numeric\"");
    expect(result.shopifyLiquid).toContain("snitch@icici");

    // 3. Verify Vanilla JS output
    expect(result.vanillaJs).toContain("funneldoctor-checkout-mount");
    expect(result.vanillaJs).toContain("upi://pay?pa=");
    expect(result.vanillaJs).toContain("DPDP 2023");

    // 4. Verify A/B Test Plan
    expect(result.abTestPlan.durationWeeks).toBe(2);
    expect(result.abTestPlan.canarySplitPercent).toBe(10);
    expect(result.abTestPlan.fullSplitPercent).toBe(50);
    expect(result.abTestPlan.rollbackCriteria.maxAllowedErrorRate).toBe(0.005);
  });
});
