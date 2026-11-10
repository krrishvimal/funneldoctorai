import { describe, expect, it } from "vitest";
import { auditDomainWithGemini } from "../src/domain-auditor.js";

describe("Domain Intelligence & Autonomous Auditor", () => {
  it("correctly identifies and maps B2B SaaS archetype for linear.app", async () => {
    const report = await auditDomainWithGemini("https://linear.app");

    expect(report.brandName.toLowerCase()).toContain("linear");
    expect(report.category.toLowerCase()).toContain("saas");
    expect(report.steps.length).toBeGreaterThanOrEqual(5);

    // SaaS must never contain e-commerce cart/bag terminology
    const stepNames = report.steps.map(s => s.name.toLowerCase()).join(" ");
    expect(stepNames).not.toContain("added to bag");
    expect(stepNames).not.toContain("added to cart");
    expect(stepNames).toContain("workspace");

    expect(report.worstStepName).toBeDefined();
    expect(report.dropoffRate).toBeGreaterThan(0);
    expect(report.leakedMonthlyLakhs).toBeGreaterThan(0);
  });

  it("correctly maps Trial & Sampling commerce archetype for smytten.com", async () => {
    const report = await auditDomainWithGemini("smytten.com");

    expect(report.brandName.toLowerCase()).toContain("smytten");
    expect(report.category.toLowerCase()).toContain("trial");
    
    const stepNames = report.steps.map(s => s.name.toLowerCase()).join(" ");
    expect(stepNames).toContain("trial");
    expect(report.worstStepName.toLowerCase()).toContain("trial");
  });

  it("correctly maps Footwear D2C archetype for nike.in", async () => {
    const report = await auditDomainWithGemini("https://nike.in");

    expect(report.brandName.toLowerCase()).toContain("nike");
    expect(report.category.toLowerCase()).toContain("footwear");
    
    const stepNames = report.steps.map(s => s.name.toLowerCase()).join(" ");
    expect(stepNames).toContain("size");
    expect(report.aov).toBeGreaterThanOrEqual(4000);
  });

  it("generates distinct deterministic benchmarks for different un-cached domains", async () => {
    const reportA = await auditDomainWithGemini("randomalpha.io");
    const reportB = await auditDomainWithGemini("randombeta.store");

    // They must NOT have identical visitor counts or dropoffs
    expect(reportA.visitors).not.toBe(reportB.visitors);
    expect(reportA.category).not.toBe(reportB.category);
    expect(reportA.aov).not.toBe(reportB.aov);
  });

  it("enriches audit reports with complete senior product analyst statistical breakdown", async () => {
    const report = await auditDomainWithGemini("teststore.in");

    expect(report.statisticalBreakdown).toBeDefined();
    const stats = report.statisticalBreakdown!;

    // 1. Fixed-horizon sample size guardrail
    expect(stats.sampleSizeGuardrail).toBeDefined();
    expect(stats.sampleSizeGuardrail.totalRequiredVisitors).toBeGreaterThan(0);
    expect(stats.sampleSizeGuardrail.statusMessage).toBeDefined();

    // 2. Cohort comparisons with Benjamini-Hochberg FDR correction
    expect(stats.cohorts.length).toBe(5);
    for (const cohort of stats.cohorts) {
      expect(cohort.adjustedQValue).toBeGreaterThanOrEqual(0);
      expect(cohort.adjustedQValue).toBeLessThanOrEqual(1);
      expect(cohort.weeklyRevenueLeak).toBeGreaterThanOrEqual(0);
      expect(cohort.weeklyRevenueLeakRange).toBeDefined();
      expect(cohort.humanAdvice).toBeDefined();
    }

    // 3. ICE Prioritization matrix
    expect(stats.icePrioritization.length).toBeGreaterThanOrEqual(3);
    // Verified sorted in descending order of ICE score
    for (let i = 0; i < stats.icePrioritization.length - 1; i++) {
      expect(stats.icePrioritization[i].iceScore).toBeGreaterThanOrEqual(
        stats.icePrioritization[i + 1].iceScore
      );
    }

    // 4. A/B Test Plan with peeking and causal safeguards
    expect(stats.abTestPlan.hypothesis).toBeDefined();
    expect(stats.abTestPlan.safeguardNotes.length).toBeGreaterThanOrEqual(3);

    // 5. Root-Cause Evidence & Causal Warnings
    expect(stats.rootCauseEvidence).toBeDefined();
    expect(stats.rootCauseEvidence?.paymentErrors.length).toBeGreaterThan(0);
    expect(stats.causalAttributionWarning).toContain("Attribution Warning");
  });
});
