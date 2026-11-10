import { describe, it, expect } from "vitest";
import {
  standardNormalCdf,
  calculateTwoProportionTest,
  applyBenjaminiHochberg,
  calculateRequiredSampleSize,
  classifyUserAgentCohort,
  rankIssuesByIceScore,
} from "../src/stats-engine.js";

describe("Senior Staff Product Analyst Stats Engine", () => {
  describe("Mathematical Utilities", () => {
    it("computes standard normal CDF Phi(z) with high precision", () => {
      expect(standardNormalCdf(0)).toBeCloseTo(0.5, 4);
      expect(standardNormalCdf(1.95996)).toBeCloseTo(0.975, 3);
      expect(standardNormalCdf(-1.95996)).toBeCloseTo(0.025, 3);
      expect(standardNormalCdf(3.0)).toBeCloseTo(0.99865, 4);
    });
  });

  describe("Two-Proportion Z-Test (Pooled vs Unpooled)", () => {
    it("uses pooled proportion for p-value and unpooled for 95% CI on significant A/B test", () => {
      // 10,000 visitors each: Control = 3.0%, Variant B = 4.0%
      const result = calculateTwoProportionTest(
        { name: "Control (Manual VPA)", visitors: 10000, conversions: 300 },
        { name: "Variant B (1-Tap UPI)", visitors: 10000, conversions: 400 }
      );

      expect(result.crA).toBe(0.03);
      expect(result.crB).toBe(0.04);
      expect(result.absoluteLift).toBe(0.01);
      expect(result.relativeLiftPercent).toBeCloseTo(33.33, 1);

      // Z should be approx 3.82, p < 0.001
      expect(result.zScore).toBeGreaterThan(3.5);
      expect(result.pValue).toBeLessThan(0.001);
      expect(result.isStatisticallySignificant).toBe(true);
      expect(result.method).toBe("pooled_z_test");
      expect(result.isSmallSample).toBe(false);

      // Confidence interval must bound around +0.01
      expect(result.confidenceInterval95[0]).toBeGreaterThan(0.004);
      expect(result.confidenceInterval95[1]).toBeLessThan(0.016);

      // Plain English verdict avoids frequentist fallacies
      expect(result.plainEnglishVerdict).toContain("highly unlikely to be due to chance");
    });

    it("correctly flags non-significant result as 'not enough evidence' rather than 'noise'", () => {
      const result = calculateTwoProportionTest(
        { name: "Control", visitors: 1000, conversions: 50 },
        { name: "Variant B", visitors: 1000, conversions: 52 }
      );

      expect(result.pValue).toBeGreaterThan(0.05);
      expect(result.isStatisticallySignificant).toBe(false);
      expect(result.plainEnglishVerdict).toContain("Not enough evidence yet to reach certainty");
    });

    it("automatically falls back to Agresti-Caffo adjustment for small samples (n*p < 5)", () => {
      // Small sample with only 2 and 3 conversions
      const result = calculateTwoProportionTest(
        { name: "Control", visitors: 15, conversions: 2 },
        { name: "Variant B", visitors: 15, conversions: 3 }
      );

      expect(result.isSmallSample).toBe(true);
      expect(result.method).toBe("agresti_caffo_small_sample");
      // Interval must remain strictly valid within [-1, 1]
      expect(result.confidenceInterval95[0]).toBeGreaterThanOrEqual(-1.0);
      expect(result.confidenceInterval95[1]).toBeLessThanOrEqual(1.0);
      expect(result.plainEnglishVerdict).toContain("Sample size is currently too small");
    });
  });

  describe("Multiple Comparison Correction (Benjamini-Hochberg FDR)", () => {
    it("controls false discoveries across multiple sliced cohorts", () => {
      const cohortData = [
        {
          cohortId: "upi_gpay",
          cohortName: "1-Tap GPay Cohort",
          visitors: 5000,
          conversions: 200,
          baselineCr: 0.03,
          observedCr: 0.04,
          rawPValue: 0.001,
        },
        {
          cohortId: "instagram_webview",
          cohortName: "Instagram WebView Cohort",
          visitors: 4000,
          conversions: 60,
          baselineCr: 0.03,
          observedCr: 0.015,
          rawPValue: 0.008,
        },
        {
          cohortId: "desktop_firefox",
          cohortName: "Desktop Firefox Cohort",
          visitors: 800,
          conversions: 25,
          baselineCr: 0.03,
          observedCr: 0.031,
          rawPValue: 0.45,
        },
        {
          cohortId: "tablets",
          cohortName: "Tablet Users",
          visitors: 500,
          conversions: 14,
          baselineCr: 0.03,
          observedCr: 0.028,
          rawPValue: 0.72,
        },
      ];

      const corrected = applyBenjaminiHochberg(cohortData, {
        falseDiscoveryRate: 0.10,
        weeklyVisitors: 10300,
        aov: 1500,
      });

      expect(corrected.length).toBe(4);
      // Top 2 cohorts should be statistically verified
      expect(corrected[0].isVerifiedSignificant).toBe(true);
      expect(corrected[1].isVerifiedSignificant).toBe(true);

      // Noise cohorts must NOT be flagged as verified problems
      expect(corrected[2].isVerifiedSignificant).toBe(false);
      expect(corrected[3].isVerifiedSignificant).toBe(false);

      // Weekly revenue leak should be calculated
      expect(corrected[1].weeklyRevenueLeak).toBeGreaterThan(0);
      expect(corrected[1].humanAdvice).toContain("Verified problem on Instagram WebView Cohort");
    });
  });

  describe("Sample Size Requirement (Peeking Bias Guardrail)", () => {
    it("calculates accurate required sample size and flags under-powered sample", () => {
      // Baseline 3% CR, targeting 15% relative lift
      const sampleCalc = calculateRequiredSampleSize(0.03, 0.15, 4500);

      expect(sampleCalc.requiredSamplePerVariant).toBeGreaterThan(10000);
      expect(sampleCalc.totalRequiredVisitors).toBeGreaterThan(20000);
      expect(sampleCalc.isRequirementMet).toBe(false);
      expect(sampleCalc.remainingVisitorsNeeded).toBeGreaterThan(15000);
      expect(sampleCalc.statusMessage).toContain("Not enough evidence yet");
    });

    it("confirms requirement met when visitors reach target", () => {
      const sampleCalc = calculateRequiredSampleSize(0.05, 0.20, 30000);
      expect(sampleCalc.isRequirementMet).toBe(true);
      expect(sampleCalc.remainingVisitorsNeeded).toBe(0);
      expect(sampleCalc.statusMessage).toContain("Target sample size reached");
    });
  });

  describe("Instagram WebView User-Agent Detection", () => {
    it("accurately classifies Android Instagram WebView", () => {
      const androidInsta =
        "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UD1A.230803.041; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.43 Mobile Safari/537.36 Instagram 312.1.0.34.111 Android (34/14; 420dpi; 1080x2400; Google/google; Pixel 8; shiba; panther; en_US)";
      expect(classifyUserAgentCohort(androidInsta)).toBe("android_instagram_webview");
    });

    it("accurately classifies iOS Safari vs Desktop", () => {
      const iosSafari =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1";
      expect(classifyUserAgentCohort(iosSafari)).toBe("ios_native_safari");

      const desktopMac =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      expect(classifyUserAgentCohort(desktopMac)).toBe("desktop_browser");
    });
  });

  describe("ICE Prioritization Scoring", () => {
    it("ranks high-impact low-effort items first", () => {
      const items = [
        {
          id: "1",
          title: "Complete Checkout Redesign",
          category: "form" as const,
          weeklyRevenueImpactInr: 80000,
          effortRating: 9, // high effort
          confidenceRating: 6,
          iceScore: Math.round((8 * 6) / 9), // ~5
        },
        {
          id: "2",
          title: "1-Tap UPI Intent Button",
          category: "payment" as const,
          weeklyRevenueImpactInr: 95000,
          effortRating: 2, // low effort
          confidenceRating: 9,
          iceScore: Math.round((9 * 9) / 2), // ~41
        },
      ];

      const ranked = rankIssuesByIceScore(items);
      expect(ranked[0].id).toBe("2"); // 1-Tap UPI comes first
      expect(ranked[1].id).toBe("1");
    });
  });
});
