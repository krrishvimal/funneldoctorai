import { describe, it, expect } from "vitest";
import { AASimulator } from "../src/aa-simulator.js";

describe("Gate 4: Automated A/A Experiment Simulations (False Positive Calibration)", () => {
  it("runs 1,000 A/A experiments and confirms empirical false positive rate is calibrated near alpha = 0.05", () => {
    // Run 1,000 independent A/A tests with 2,000 visitors per variant and 4% true conversion rate
    const result = AASimulator.runSimulation({
      simulationsCount: 1000,
      sampleSizePerVariant: 2000,
      trueConversionRate: 0.04,
      alpha: 0.05,
      seed: 98765,
    });

    expect(result.totalSimulations).toBe(1000);
    expect(result.isCalibrated).toBe(true);

    // False positive rate must be between 3.0% and 7.0% (3-sigma tolerance for Binomial(1000, 0.05))
    expect(result.empiricalFalsePositiveRate).toBeGreaterThanOrEqual(0.03);
    expect(result.empiricalFalsePositiveRate).toBeLessThanOrEqual(0.07);

    // Under null hypothesis H0, p-values should be approximately uniform on [0, 1] with mean near 0.50
    expect(result.pValuesSummary.mean).toBeGreaterThan(0.45);
    expect(result.pValuesSummary.mean).toBeLessThan(0.55);
  });

  it("verifies small-sample A/A experiments maintain conservative false positive bounds", () => {
    // 500 simulations with small sample sizes (N = 30 visitors per variant)
    const result = AASimulator.runSimulation({
      simulationsCount: 500,
      sampleSizePerVariant: 30,
      trueConversionRate: 0.10,
      alpha: 0.05,
      seed: 12345,
    });

    expect(result.totalSimulations).toBe(500);
    // Small sample tests using Agresti-Caffo / Fisher's exact test should never hyper-inflate false positives
    expect(result.empiricalFalsePositiveRate).toBeLessThanOrEqual(0.07);
  });
});
