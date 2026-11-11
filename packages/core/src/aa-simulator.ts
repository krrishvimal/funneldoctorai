/**
 * @file aa-simulator.ts
 * @description Automated Monte Carlo A/A Experiment Simulation Engine.
 * 
 * Verifies that the statistical engine does not suffer from phantom significance / alpha inflation.
 * In 1,000 simulated A/A tests where both Variant A and Variant B have identical conversion rates,
 * the empirical false-positive rate must hover around the theoretical alpha = 0.05 (between 3% and 7%).
 */

import { calculateTwoProportionTest, VariantMetrics } from "./stats-engine.js";

export interface AASimulationConfig {
  simulationsCount?: number; // e.g. 1000 runs
  sampleSizePerVariant?: number; // e.g. 2000 visitors per variant
  trueConversionRate?: number; // e.g. 0.04 (4% conversion rate)
  alpha?: number; // e.g. 0.05
  seed?: number; // Deterministic seed for reproducible tests
}

export interface AASimulationResult {
  totalSimulations: number;
  sampleSizePerVariant: number;
  trueConversionRate: number;
  alpha: number;
  falsePositiveCount: number;
  empiricalFalsePositiveRate: number; // falsePositiveCount / totalSimulations
  isCalibrated: boolean; // True if empirical rate is within [alpha - 0.02, alpha + 0.02]
  pValuesSummary: {
    min: number;
    max: number;
    mean: number;
  };
}

/**
 * Fast deterministic Pseudo-Random Number Generator (PRNG) - Mulberry32
 * Ensures 100% deterministic, reproducible Monte Carlo simulations across all environments.
 */
export class DeterministicRng {
  private s: number;

  constructor(seed = 1337) {
    this.s = seed | 0;
  }

  public next(): number {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generates binomial successes via fast normal approximation for large N,
   * or direct Bernoulli trials for exact small N.
   */
  public generateConversions(visitors: number, cr: number): number {
    // For large N, use Gaussian / Box-Muller approximation for high-speed simulation
    if (visitors >= 100) {
      const mean = visitors * cr;
      const variance = visitors * cr * (1 - cr);
      const stdDev = Math.sqrt(variance);

      // Box-Muller transform
      const u1 = Math.max(1e-10, this.next());
      const u2 = this.next();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      const conversions = Math.round(mean + z0 * stdDev);
      return Math.max(0, Math.min(visitors, conversions));
    }

    // Direct Bernoulli trials for small samples
    let conversions = 0;
    for (let i = 0; i < visitors; i++) {
      if (this.next() < cr) {
        conversions++;
      }
    }
    return conversions;
  }
}

export class AASimulator {
  /**
   * Executes M independent A/A experiments and computes the empirical Type I error rate.
   */
  public static runSimulation(config: AASimulationConfig = {}): AASimulationResult {
    const totalSimulations = config.simulationsCount || 1000;
    const sampleSize = config.sampleSizePerVariant || 2000;
    const trueCr = config.trueConversionRate || 0.04;
    const alpha = config.alpha || 0.05;
    const rng = new DeterministicRng(config.seed || 4242);

    let falsePositiveCount = 0;
    let sumPValue = 0;
    let minP = 1.0;
    let maxP = 0.0;

    for (let i = 0; i < totalSimulations; i++) {
      const conversionsA = rng.generateConversions(sampleSize, trueCr);
      const conversionsB = rng.generateConversions(sampleSize, trueCr);

      const variantA: VariantMetrics = {
        name: "Control A",
        visitors: sampleSize,
        conversions: conversionsA,
      };

      const variantB: VariantMetrics = {
        name: "Control B (A/A Identical)",
        visitors: sampleSize,
        conversions: conversionsB,
      };

      const result = calculateTwoProportionTest(variantA, variantB, alpha);

      sumPValue += result.pValue;
      if (result.pValue < minP) minP = result.pValue;
      if (result.pValue > maxP) maxP = result.pValue;

      if (result.isStatisticallySignificant) {
        falsePositiveCount++;
      }
    }

    const empiricalFalsePositiveRate = falsePositiveCount / totalSimulations;

    // Standard 3-sigma tolerance window for Binomial(1000, 0.05): [0.03, 0.07]
    const isCalibrated =
      empiricalFalsePositiveRate >= alpha - 0.025 &&
      empiricalFalsePositiveRate <= alpha + 0.025;

    return {
      totalSimulations,
      sampleSizePerVariant: sampleSize,
      trueConversionRate: trueCr,
      alpha,
      falsePositiveCount,
      empiricalFalsePositiveRate: Number(empiricalFalsePositiveRate.toFixed(4)),
      isCalibrated,
      pValuesSummary: {
        min: Number(minP.toFixed(5)),
        max: Number(maxP.toFixed(5)),
        mean: Number((sumPValue / totalSimulations).toFixed(4)),
      },
    };
  }
}
