import { describe, it, expect } from "vitest";
import { calculateTwoProportionTest, calculateFishersExactTest } from "../src/stats-engine.js";

describe("Gate 4: SciPy Golden Dataset Benchmarks & Fisher's Exact Test", () => {
  describe("Two-Proportion Pooled Z-Test vs SciPy Reference Vectors", () => {
    it("vector 1: matches SciPy proportions_ztest for standard large-sample e-commerce test", () => {
      // Control: 500 / 10,000 (5.0%)
      // Variant: 600 / 10,000 (6.0%)
      // SciPy: proportions_ztest([600, 500], [10000, 10000], pooled=True)
      // Reference: z = 3.1016, p = 0.001924, lift = +0.01 (+20.0% relative)
      const res = calculateTwoProportionTest(
        { name: "Control", visitors: 10000, conversions: 500 },
        { name: "Variant", visitors: 10000, conversions: 600 }
      );

      expect(res.method).toBe("pooled_z_test");
      expect(res.absoluteLift).toBeCloseTo(0.01, 4);
      expect(res.relativeLiftPercent).toBeCloseTo(20.0, 2);
      expect(res.zScore).toBeCloseTo(3.1016, 3);
      expect(res.pValue).toBeCloseTo(0.001924, 4);
      expect(res.isStatisticallySignificant).toBe(true);

      // Unpooled 95% Confidence Interval: [0.00368, 0.01632]
      expect(res.confidenceInterval95[0]).toBeCloseTo(0.00368, 4);
      expect(res.confidenceInterval95[1]).toBeCloseTo(0.01632, 4);
    });

    it("vector 2: matches SciPy for null hypothesis (identical proportions)", () => {
      // Control: 200 / 5,000 (4.0%)
      // Variant: 200 / 5,000 (4.0%)
      const res = calculateTwoProportionTest(
        { name: "Control", visitors: 5000, conversions: 200 },
        { name: "Variant", visitors: 5000, conversions: 200 }
      );

      expect(res.absoluteLift).toBe(0.0);
      expect(res.relativeLiftPercent).toBe(0.0);
      expect(res.zScore).toBe(0.0);
      expect(res.pValue).toBe(1.0);
      expect(res.isStatisticallySignificant).toBe(false);
    });

    it("vector 3: matches SciPy for unequal sample sizes (8,000 vs 2,000)", () => {
      // Control: 320 / 8,000 (4.0%)
      // Variant: 120 / 2,000 (6.0%)
      // SciPy: proportions_ztest([120, 320], [2000, 8000], pooled=True)
      // Reference: z = 3.9006, p = 0.0000959
      const res = calculateTwoProportionTest(
        { name: "Control", visitors: 8000, conversions: 320 },
        { name: "Variant", visitors: 2000, conversions: 120 }
      );

      expect(res.absoluteLift).toBeCloseTo(0.02, 4);
      expect(res.zScore).toBeCloseTo(3.9006, 2);
      expect(res.pValue).toBeLessThanOrEqual(0.0001);
      expect(res.isStatisticallySignificant).toBe(true);
    });
  });

  describe("Fisher's Exact Test vs SciPy Reference Vectors (scipy.stats.fisher_exact)", () => {
    it("vector 4: matches SciPy for Lady Tasting Tea contingency table [[3, 1], [1, 3]]", () => {
      // Table:
      //         Success Failure Total
      // Variant A:  3       1     4
      // Variant B:  1       3     4
      // SciPy: fisher_exact([[3, 1], [1, 3]]) -> p = 0.485714
      const pValue = calculateFishersExactTest(3, 4, 1, 4);
      expect(pValue).toBeCloseTo(0.485714, 4);
    });

    it("vector 5: matches SciPy for 2x2 contingency table [[12, 5], [3, 14]]", () => {
      // Table:
      // Variant A: 12 successes, 5 failures (total 17)
      // Variant B:  3 successes, 14 failures (total 17)
      // Exact Hypergeometric sum: p(k <= 3) + p(k >= 12) = 0.004896
      const pValue = calculateFishersExactTest(12, 17, 3, 17);
      expect(pValue).toBeCloseTo(0.004896, 4);
    });

    it("vector 6: matches SciPy for extreme separation [[5, 0], [0, 5]]", () => {
      // Table:
      // Variant A: 5 successes, 0 failures (total 5)
      // Variant B: 0 successes, 5 failures (total 5)
      // SciPy: fisher_exact([[5, 0], [0, 5]]) -> p = 0.007936
      const pValue = calculateFishersExactTest(5, 5, 0, 5);
      expect(pValue).toBeCloseTo(0.007936, 4);
    });
  });

  describe("Small-Sample Safeguards (Agresti-Caffo & Fallback Policies)", () => {
    it("switches to small-sample method when conversion count < 5 and clamps intervals to [-1, 1]", () => {
      // Very small startup sample: 2 / 20 vs 8 / 20
      const res = calculateTwoProportionTest(
        { name: "Control", visitors: 20, conversions: 2 },
        { name: "Variant", visitors: 20, conversions: 8 }
      );

      expect(res.isSmallSample).toBe(true);
      expect(res.method).toBe("agresti_caffo_small_sample");
      // Bounds must be within [-1, 1]
      expect(res.confidenceInterval95[0]).toBeGreaterThanOrEqual(-1.0);
      expect(res.confidenceInterval95[1]).toBeLessThanOrEqual(1.0);
      expect(res.confidenceInterval95[0]).toBeLessThan(res.confidenceInterval95[1]);
    });
  });
});
