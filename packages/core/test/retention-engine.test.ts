import { describe, it, expect, beforeEach } from "vitest";
import { SqliteDatabaseAdapter } from "../src/database/adapter.js";
import { TenantRepository } from "../src/database/tenant-repository.js";
import { EventRepository } from "../src/database/event-repository.js";
import { DataRetentionEngine } from "../src/database/retention-engine.js";

describe("Gate 3: DPDP & GDPR 90-Day Data Retention Engine", () => {
  let db: SqliteDatabaseAdapter;
  let tenantRepo: TenantRepository;
  let eventRepo: EventRepository;
  let retentionEngine: DataRetentionEngine;

  const NOW = 1762860000000; // Fixed baseline timestamp
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const HUNDRED_DAYS_AGO = NOW - 100 * ONE_DAY_MS;
  const TEN_DAYS_AGO = NOW - 10 * ONE_DAY_MS;

  beforeEach(() => {
    db = new SqliteDatabaseAdapter(":memory:");
    tenantRepo = new TenantRepository(db);
    eventRepo = new EventRepository(db);
    retentionEngine = new DataRetentionEngine(db, { retentionDays: 90 });

    tenantRepo.registerTenant({
      siteId: "store_retention",
      merchantName: "Retention Store",
      domain: "retention.com",
    });

    // Seed 20 expired events (100 days old)
    for (let i = 1; i <= 20; i++) {
      eventRepo.insertEvent({
        eventId: `old_evt_${i}`,
        siteId: "store_retention",
        sessionId: `old_sess_${i}`,
        visitorId: `old_vis_${i}`,
        eventType: i <= 15 ? "page_view" : "purchase",
        pageUrl: "https://retention.com/product",
        createdAt: HUNDRED_DAYS_AGO + i * 1000,
      });
    }

    // Seed 10 recent events (10 days old)
    for (let i = 1; i <= 10; i++) {
      eventRepo.insertEvent({
        eventId: `new_evt_${i}`,
        siteId: "store_retention",
        sessionId: `new_sess_${i}`,
        visitorId: `new_vis_${i}`,
        eventType: "page_view",
        pageUrl: "https://retention.com/product",
        createdAt: TEN_DAYS_AGO + i * 1000,
      });
    }
  });

  it("hard-deletes raw events older than 90 days while preserving recent events", () => {
    expect(eventRepo.getEventCount("store_retention")).toBe(30);

    const runResult = retentionEngine.executeRetentionCycle(NOW);

    expect(runResult.status).toBe("success");
    expect(runResult.events_purged).toBe(20);

    // Only the 10 recent events should remain in the raw events table
    expect(eventRepo.getEventCount("store_retention")).toBe(10);

    const remaining = eventRepo.getRecentEvents("store_retention", 50);
    expect(remaining.every((e) => e.created_at >= NOW - 90 * ONE_DAY_MS)).toBe(true);
  });

  it("aggregates purged event metrics into long-term summary table before deletion", () => {
    retentionEngine.executeRetentionCycle(NOW);

    const summaries = db.all(
      `SELECT * FROM aggregated_funnel_metrics WHERE site_id = 'store_retention'`
    );

    expect(summaries.length).toBeGreaterThan(0);
    const pageViewSummary = summaries.find((s) => s.step_name === "page_view");
    expect(pageViewSummary).toBeDefined();
    expect(pageViewSummary.visitors_count).toBe(15);

    const purchaseSummary = summaries.find((s) => s.step_name === "purchase");
    expect(purchaseSummary).toBeDefined();
    expect(purchaseSummary.visitors_count).toBe(5);
  });

  it("records an immutable compliance run record in retention_runs", () => {
    retentionEngine.executeRetentionCycle(NOW);

    const history = retentionEngine.getRetentionHistory();
    expect(history.length).toBe(1);
    expect(history[0].events_purged).toBe(20);
    expect(history[0].status).toBe("success");
    expect(history[0].cutoff_timestamp).toBe(NOW - 90 * ONE_DAY_MS);
  });
});
