import { describe, expect, it } from "vitest";
import { computeFunnelMetrics, parseFunnelFromCsv } from "../src/funnel-parser.js";

describe("Funnel Parser & Metrics Engine", () => {
  it("parses valid CSV string and accurately computes metrics", () => {
    const sampleCsv = `step,visitors
Landing Page,10000
Product Details,4000
Add to Cart,2000
Checkout Page,800
Order Confirmation,400`;

    const result = parseFunnelFromCsv(sampleCsv);

    expect(result.totalInitialVisitors).toBe(10000);
    expect(result.totalFinalConversions).toBe(400);
    expect(result.overallConversionRate).toBe(0.04); // 4%
    expect(result.steps.length).toBe(5);

    // Biggest drop step should be Landing Page (10000 -> 4000 = 6000 drop)
    expect(result.biggestDropStep.name).toBe("Landing Page");
    expect(result.biggestDropStep.dropoffCount).toBe(6000);
    expect(result.biggestDropStep.dropoffRate).toBe(0.6); // 60%
  });

  it("handles messy column headers (sessions, unique users)", () => {
    const csvWithWeirdHeaders = `event_name,unique_users
Homepage View,5000
Signup Form,1500
Workspace Created,750`;

    const result = parseFunnelFromCsv(csvWithWeirdHeaders);
    expect(result.totalInitialVisitors).toBe(5000);
    expect(result.totalFinalConversions).toBe(750);
    expect(result.overallConversionRate).toBe(0.15); // 15%
  });

  it("computes step drop-off rates correctly", () => {
    const steps = [
      { name: "Step A", index: 0, visitors: 100, device: "all" as const },
      { name: "Step B", index: 1, visitors: 50, device: "all" as const },
      { name: "Step C", index: 2, visitors: 25, device: "all" as const },
    ];

    const metrics = computeFunnelMetrics(steps);
    expect(metrics.steps[0].dropoffRate).toBe(0.5);
    expect(metrics.steps[1].dropoffRate).toBe(0.5);
    expect(metrics.steps[2].dropoffRate).toBe(0); // Final step
  });
});
