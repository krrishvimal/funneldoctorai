import { describe, it, expect } from "vitest";
import { ExperimentRunner, hashVisitorSession } from "../src/experiment-runner.js";

describe("ExperimentRunner & CircuitBreaker", () => {
  it("deterministically routes visitors into Canary or Balanced A/B buckets", () => {
    const canary = new ExperimentRunner({
      experimentId: "exp-upi-1tap",
      domain: "snitch.co.in",
      mode: "CANARY",
      canaryTreatmentPercentage: 10,
    });

    const v1 = canary.assignVariant("session-user-12345");
    const v2 = canary.assignVariant("session-user-12345");
    expect(v1).toBe(v2); // Sticky routing

    // Verify hash distribution
    const hash = hashVisitorSession("session-user-12345", "exp-upi-1tap");
    expect(hash).toBeGreaterThanOrEqual(0);
    expect(hash).toBeLessThan(100);
  });

  it("automatically trips circuit breaker and reverts to Control if JS errors exceed 0.5%", () => {
    const runner = new ExperimentRunner({
      experimentId: "exp-error-test",
      domain: "brand.in",
      mode: "BALANCED_AB",
      errorThresholdPercent: 0.5,
    });

    // Simulate 100 normal sessions on treatment
    for (let i = 0; i < 90; i++) {
      runner.recordTelemetry("TREATMENT", { type: "session_start" });
    }

    expect(runner.getState().status).toBe("HEALTHY");

    // Inject 2 errors (2 / 92 = 2.17% > 0.5%)
    runner.recordTelemetry("TREATMENT", { type: "session_start" });
    runner.recordTelemetry("TREATMENT", { type: "error", errorDetails: "Cannot read property 'openUpiApp'" });
    runner.recordTelemetry("TREATMENT", { type: "session_start" });
    const check = runner.recordTelemetry("TREATMENT", { type: "error", errorDetails: "Cannot read property 'openUpiApp'" });

    expect(check.tripped).toBe(true);
    expect(check.status).toBe("TRIPPED_ERROR_SURGE");
    expect(runner.getState().isCircuitBreakerActive).toBe(true);
    expect(runner.getState().activeIncidents.length).toBe(1);
    expect(runner.getState().activeIncidents[0].rollbackLatencyMs).toBeLessThanOrEqual(50);

    // Any subsequent visitor is 100% forced to Control
    expect(runner.assignVariant("any-random-session-id")).toBe("CONTROL");
    expect(runner.assignVariant("another-session-id")).toBe("CONTROL");
  });

  it("automatically trips circuit breaker if treatment conversion drops > 5% below control", () => {
    const runner = new ExperimentRunner({
      experimentId: "exp-drop-test",
      domain: "brand.in",
      mode: "BALANCED_AB",
      minSampleBeforeDropCheck: 100,
      conversionDropThresholdPercent: 5.0,
    });

    // Simulate 100 sessions on Control with 10 conversions (10% CR)
    for (let i = 0; i < 100; i++) {
      runner.recordTelemetry("CONTROL", { type: "session_start" });
    }
    for (let i = 0; i < 10; i++) {
      runner.recordTelemetry("CONTROL", { type: "conversion" });
    }

    // Simulate 100 sessions on Treatment with only 4 conversions (4% CR -> 60% relative drop > 5%)
    for (let i = 0; i < 100; i++) {
      runner.recordTelemetry("TREATMENT", { type: "session_start" });
    }
    for (let i = 0; i < 4; i++) {
      runner.recordTelemetry("TREATMENT", { type: "conversion" });
    }

    const evalResult = runner.evaluateSafetyRules();
    expect(evalResult.tripped).toBe(true);
    expect(evalResult.status).toBe("TRIPPED_CONVERSION_DROP");
    expect(runner.assignVariant("session-xyz")).toBe("CONTROL");
  });
});
