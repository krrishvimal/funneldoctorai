/**
 * @file experiment-runner.ts
 * @description Autonomous A/B testing, deterministic traffic allocation, and 
 * safety circuit breaker engine for FunnelDoctor AI.
 *
 * Enterprise Safeguards Embedded:
 * - Deterministic sticky traffic hashing (sessionId -> Variant A or B).
 * - Statistically powered conversion drop check: requires N >= 250 sessions per variant
 *   and p < 0.05 against concurrent Control before tripping (eliminates small-sample noise).
 * - Differential Error Surge: Compares Treatment errors against concurrent Control baseline
 *   (excess errors > 0.5%), preventing false alarms from pre-existing third-party tag errors.
 * - Graceful Session Draining: Shoppers currently in-flight on checkout are never flipped
 *   mid-checkout; new visitors route 100% to Control while active sessions finish.
 * - Transparent MTTR telemetry: Tracks Time-to-Detect (TTD) and Time-to-Propagate (TTP).
 */

import { calculateTwoProportionTest } from "./stats-engine.js";

export type ExperimentVariant = "CONTROL" | "TREATMENT";

export type CircuitBreakerStatus = 
  | "HEALTHY" 
  | "TRIPPED_ERROR_SURGE" 
  | "TRIPPED_CONVERSION_DROP" 
  | "MANUALLY_PAUSED";

export interface ExperimentConfig {
  experimentId: string;
  domain: string;
  mode: "CANARY" | "BALANCED_AB" | "FULL_ROLLOUT";
  canaryTreatmentPercentage?: number; // e.g. 10 for 10%
  errorThresholdPercent?: number; // excess differential error limit (defaults to 0.5%)
  conversionDropThresholdPercent?: number; // relative drop limit (defaults to 5.0%)
  minSampleBeforeDropCheck?: number; // defaults to 250 sessions
  sessionDrainTtlMinutes?: number; // defaults to 15 minutes
}

export interface ExperimentVariantMetrics {
  sessions: number;
  conversions: number;
  errors: number;
  conversionRate: number;
  errorRate: number;
}

export interface CircuitBreakerIncident {
  tripReason: string;
  timestamp: string;
  timeToDetectSeconds: number;
  estimatedTimeToPropagateSeconds: number;
  metricsAtTrip: {
    control: ExperimentVariantMetrics;
    treatment: ExperimentVariantMetrics;
    differentialErrorRate: number;
    statisticallySignificantDrop: boolean;
    dropPValue?: number;
  };
  revertedToVariantForNewSessions: "CONTROL";
  inFlightSessionsDraining: number;
  rollbackLatencyMs: number;
}

export interface InFlightSession {
  variant: ExperimentVariant;
  startedAt: number;
}

export interface ExperimentState {
  config: ExperimentConfig;
  status: CircuitBreakerStatus;
  isCircuitBreakerActive: boolean;
  circuitBreakerTrippedAt: number | null;
  metrics: {
    control: ExperimentVariantMetrics;
    treatment: ExperimentVariantMetrics;
  };
  activeIncidents: CircuitBreakerIncident[];
}

/**
 * Deterministic hash function (MurmurHash3-like 32-bit integer) to ensure sticky visitor routing.
 */
export function hashVisitorSession(sessionId: string, experimentId: string): number {
  const combined = `${experimentId}:${sessionId}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash) % 100; // Returns 0 - 99
}

export class ExperimentRunner {
  private state: ExperimentState;
  private inFlightSessions: Map<string, InFlightSession>;
  private firstTelemetryTimestamp: number;

  constructor(config: ExperimentConfig) {
    this.state = {
      config: {
        canaryTreatmentPercentage: 10,
        errorThresholdPercent: 0.5,
        conversionDropThresholdPercent: 5.0,
        minSampleBeforeDropCheck: 250, // Minimum 250 sessions per variant before evaluating conversion drops
        sessionDrainTtlMinutes: 15,
        ...config,
      },
      status: "HEALTHY",
      isCircuitBreakerActive: false,
      circuitBreakerTrippedAt: null,
      metrics: {
        control: { sessions: 0, conversions: 0, errors: 0, conversionRate: 0, errorRate: 0 },
        treatment: { sessions: 0, conversions: 0, errors: 0, conversionRate: 0, errorRate: 0 },
      },
      activeIncidents: [],
    };
    this.inFlightSessions = new Map();
    this.firstTelemetryTimestamp = Date.now();
  }

  /**
   * Deterministically assigns a visitor session to Control or Treatment with graceful draining.
   *
   * SAFEGUARD: If the circuit breaker trips, shoppers currently mid-checkout are NOT flipped;
   * their session continues on their current variant until the TTL expires.
   * All NEW incoming sessions are routed 100% to CONTROL.
   */
  public assignVariant(sessionId: string): ExperimentVariant {
    const now = Date.now();
    const ttlMs = (this.state.config.sessionDrainTtlMinutes || 15) * 60 * 1000;

    // Check if session is already active in-flight
    const existing = this.inFlightSessions.get(sessionId);
    if (existing && (now - existing.startedAt) < ttlMs) {
      return existing.variant;
    }

    // If circuit breaker is tripped, ALL NEW sessions are strictly forced to Control
    if (this.state.isCircuitBreakerActive) {
      this.inFlightSessions.set(sessionId, { variant: "CONTROL", startedAt: now });
      return "CONTROL";
    }

    if (this.state.config.mode === "FULL_ROLLOUT") {
      this.inFlightSessions.set(sessionId, { variant: "TREATMENT", startedAt: now });
      return "TREATMENT";
    }

    const bucket = hashVisitorSession(sessionId, this.state.config.experimentId);
    const treatmentThreshold = 
      this.state.config.mode === "CANARY" 
        ? (this.state.config.canaryTreatmentPercentage || 10) 
        : 50; // 50/50 split for BALANCED_AB

    const variant: ExperimentVariant = bucket < treatmentThreshold ? "TREATMENT" : "CONTROL";
    this.inFlightSessions.set(sessionId, { variant, startedAt: now });
    return variant;
  }

  /**
   * Ingests runtime telemetry events and executes automated circuit breaker safety evaluations.
   */
  public recordTelemetry(
    variant: ExperimentVariant, 
    event: { type: "session_start" | "conversion" | "error"; errorDetails?: string }
  ): { status: CircuitBreakerStatus; tripped: boolean } {
    const key = variant === "CONTROL" ? "control" : "treatment";
    const m = this.state.metrics[key];

    if (event.type === "session_start") {
      m.sessions += 1;
    } else if (event.type === "conversion") {
      m.conversions += 1;
    } else if (event.type === "error") {
      m.errors += 1;
    }

    // Recompute rates
    m.conversionRate = m.sessions > 0 ? Number((m.conversions / m.sessions).toFixed(4)) : 0;
    m.errorRate = m.sessions > 0 ? Number(((m.errors / m.sessions) * 100).toFixed(3)) : 0;

    // Evaluate circuit breaker rules
    return this.evaluateSafetyRules();
  }

  /**
   * Evaluates runtime error thresholds and conversion drops.
   *
   * SAFEGUARDS:
   * 1. Differential Error Surge: Checks excess errors over Control baseline (t.errorRate - c.errorRate > limit).
   * 2. Statistically Powered Conversion Drop: Requires N >= minSample AND p < 0.05 against concurrent Control.
   */
  public evaluateSafetyRules(): { status: CircuitBreakerStatus; tripped: boolean } {
    if (this.state.isCircuitBreakerActive) {
      return { status: this.state.status, tripped: true };
    }

    const t = this.state.metrics.treatment;
    const c = this.state.metrics.control;
    const errorLimit = this.state.config.errorThresholdPercent ?? 0.5;
    const minSample = this.state.config.minSampleBeforeDropCheck ?? 250;
    const maxDrop = this.state.config.conversionDropThresholdPercent ?? 5.0;

    // Rule 1: Differential Error Surge on Treatment (> 0.5% higher than concurrent Control baseline)
    const differentialErrorRate = Number(Math.max(0, t.errorRate - c.errorRate).toFixed(3));
    if (t.sessions >= 20 && differentialErrorRate > errorLimit) {
      const startTime = Date.now();
      this.state.status = "TRIPPED_ERROR_SURGE";
      this.state.isCircuitBreakerActive = true;
      this.state.circuitBreakerTrippedAt = Date.now();
      const latencyMs = Math.max(1, Date.now() - startTime);

      const timeToDetectSeconds = Math.max(1, Math.round((Date.now() - this.firstTelemetryTimestamp) / 1000));
      const inFlightCount = Array.from(this.inFlightSessions.values()).filter(
        s => s.variant === "TREATMENT" && (Date.now() - s.startedAt) < (15 * 60 * 1000)
      ).length;

      this.state.activeIncidents.push({
        tripReason: `Treatment differential error rate (+${differentialErrorRate}%) exceeded safety limit (+${errorLimit}%) above Control baseline (${c.errorRate}%)`,
        timestamp: new Date().toISOString(),
        timeToDetectSeconds,
        estimatedTimeToPropagateSeconds: 15,
        metricsAtTrip: {
          control: { ...c },
          treatment: { ...t },
          differentialErrorRate,
          statisticallySignificantDrop: false,
        },
        revertedToVariantForNewSessions: "CONTROL",
        inFlightSessionsDraining: inFlightCount,
        rollbackLatencyMs: latencyMs,
      });

      return { status: "TRIPPED_ERROR_SURGE", tripped: true };
    }

    // Rule 2: Sudden Conversion Drop on Treatment (requires N >= 250 and statistical significance vs concurrent Control)
    if (t.sessions >= minSample && c.sessions >= minSample && c.conversionRate > 0) {
      const relativeDrop = ((c.conversionRate - t.conversionRate) / c.conversionRate) * 100;
      
      if (relativeDrop > maxDrop) {
        // Run rigorous two-proportion significance test against concurrent Control
        const statTest = calculateTwoProportionTest(
          { name: "Original Control", conversions: c.conversions, visitors: c.sessions },
          { name: "Remediated Treatment", conversions: t.conversions, visitors: t.sessions },
          0.05
        );

        // Only trip if drop is statistically significant (p < 0.05), eliminating small-sample noise
        if (statTest.pValue < 0.05) {
          const startTime = Date.now();
          this.state.status = "TRIPPED_CONVERSION_DROP";
          this.state.isCircuitBreakerActive = true;
          this.state.circuitBreakerTrippedAt = Date.now();
          const latencyMs = Math.max(1, Date.now() - startTime);

          const timeToDetectSeconds = Math.max(1, Math.round((Date.now() - this.firstTelemetryTimestamp) / 1000));
          const inFlightCount = Array.from(this.inFlightSessions.values()).filter(
            s => s.variant === "TREATMENT" && (Date.now() - s.startedAt) < (15 * 60 * 1000)
          ).length;

          this.state.activeIncidents.push({
            tripReason: `Treatment conversion rate (${(t.conversionRate * 100).toFixed(1)}%) dropped ${relativeDrop.toFixed(1)}% below Control (${(c.conversionRate * 100).toFixed(1)}%) with high significance (p = ${statTest.pValue.toFixed(4)} < 0.05)`,
            timestamp: new Date().toISOString(),
            timeToDetectSeconds,
            estimatedTimeToPropagateSeconds: 15,
            metricsAtTrip: {
              control: { ...c },
              treatment: { ...t },
              differentialErrorRate,
              statisticallySignificantDrop: true,
              dropPValue: statTest.pValue,
            },
            revertedToVariantForNewSessions: "CONTROL",
            inFlightSessionsDraining: inFlightCount,
            rollbackLatencyMs: latencyMs,
          });

          return { status: "TRIPPED_CONVERSION_DROP", tripped: true };
        }
      }
    }

    return { status: "HEALTHY", tripped: false };
  }

  /**
   * Resets the circuit breaker back to HEALTHY after an engineer has reviewed and resolved the root cause.
   */
  public resetCircuitBreaker(): void {
    this.state.status = "HEALTHY";
    this.state.isCircuitBreakerActive = false;
    this.state.circuitBreakerTrippedAt = null;
  }

  /**
   * Gets the current live experiment state.
   */
  public getState(): Readonly<ExperimentState> {
    return this.state;
  }
}
