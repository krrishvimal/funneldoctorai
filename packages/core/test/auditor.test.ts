import { describe, expect, it } from "vitest";
import { computeFunnelMetrics } from "../src/funnel-parser.js";
import { runFunnelAudit } from "../src/gemini-auditor.js";

describe("FunnelDoctor Heuristic Auditor", () => {
  it("generates structured RCA report and PRD in fallback mode without API key", async () => {
    const steps = [
      { name: "Cart View", index: 0, visitors: 1000, device: "all" as const },
      { name: "Payment Details", index: 1, visitors: 200, device: "all" as const },
      { name: "Order Thank You", index: 2, visitors: 150, device: "all" as const },
    ];

    const metrics = computeFunnelMetrics(steps);
    const report = await runFunnelAudit(metrics, [], { projectUrl: "https://example-shop.com" });

    expect(report.executiveSummary).toContain("Cart View");
    expect(report.findings.length).toBeGreaterThan(0);
    expect(report.generatedPRD).toContain("# Product Requirements Document (PRD)");
    expect(report.findings[0].category).toBeDefined();
    expect(report.findings[0].actionableFix).toBeDefined();
  });
});
