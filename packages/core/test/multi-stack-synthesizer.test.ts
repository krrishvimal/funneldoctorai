import { describe, it, expect } from "vitest";
import { synthesizeMultiStackRemediation } from "../src/multi-stack-synthesizer.js";

describe("MultiStackSynthesizer", () => {
  it("synthesizes React, Shopify Liquid, and Vanilla JS components with enterprise safeguards", () => {
    const result = synthesizeMultiStackRemediation({
      brandName: "Snitch",
      domain: "snitch.co.in",
      worstStepName: "03. Checkout Payment Gate",
      aov: 1699,
      dropoffRate: 58.2,
      upiMerchantVpa: "snitch@icici",
      freeShippingThreshold: 999,
    });

    // 1. Verify React output with dynamic gateway intent & Instagram fallback
    expect(result.reactCode).toContain("FunnelDoctorOneTapCheckout");
    expect(result.reactCode).toContain("createGatewayOrderEndpoint");
    expect(result.reactCode).toContain("isInstagramWebView");
    expect(result.reactCode).toContain("In-App Browser Safe Pay");
    expect(result.reactCode).toContain('inputMode="numeric"');
    expect(result.reactCode).toContain("Connecting Gateway...");

    // 2. Verify Shopify Liquid output with divided_by: 100.0 price formatting
    expect(result.shopifyLiquid).toContain("cart.total_price | divided_by: 100.0");
    expect(result.shopifyLiquid).not.toContain("cart.total_price | money_with_currency");
    expect(result.shopifyLiquid).toContain("snippets/funneldoctor-1tap-checkout.liquid");
    expect(result.shopifyLiquid).toContain("inputmode=\"numeric\"");
    expect(result.shopifyLiquid).toContain("snitch@icici");

    // 3. Verify Vanilla JS output with data minimization (no statutory legal guarantee)
    expect(result.vanillaJs).toContain("funneldoctor-checkout-mount");
    expect(result.vanillaJs).toContain("Designed for Data Minimization");
    expect(result.vanillaJs).not.toContain("DPDP Act 2023 zero-PII compliance");

    // 4. Verify Placement Guide
    expect(result.placementGuide).toBeDefined();
    expect(result.placementGuide.shopifyPlacement).toContain("sections/cart-drawer.liquid");
    expect(result.placementGuide.shopifyPlacement).toContain("Shopify Plus");
    expect(result.placementGuide.instagramFallbackStrategy).toContain("Tier 1: Android Intent URI scheme");

    // 5. Verify A/B Test Plan with safety circuit breaker limits
    expect(result.abTestPlan.durationWeeks).toBe(2);
    expect(result.abTestPlan.canarySplitPercent).toBe(10);
    expect(result.abTestPlan.fullSplitPercent).toBe(50);
    expect(result.abTestPlan.rollbackCriteria.minSampleBeforeEvaluation).toBe(250);
    expect(result.abTestPlan.rollbackCriteria.differentialErrorThresholdPercent).toBe(0.5);
    expect(result.abTestPlan.rollbackCriteria.statisticallySignificantDropPValue).toBe(0.05);
    expect(result.abTestPlan.rollbackCriteria.gracefulSessionDrainMinutes).toBe(15);
  });
});
