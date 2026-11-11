/**
 * @file event-repository.ts
 * @description Persistent Event Repository for Ingested Telemetry and Funnel Analysis.
 * 
 * Strict Guarantees:
 * 1. Tenant Isolation: Every query and insert is strictly bound by `siteId`. Cross-tenant querying is impossible.
 * 2. High-Throughput Batch Writes: Wrapped in atomic transactions.
 * 3. Analytics Aggregation: Fast grouped queries for conversion funnels and dwell times.
 */

import { DatabaseAdapter } from "./adapter.js";
import { DbEvent } from "./schema.js";

export interface InsertEventInput {
  eventId: string;
  siteId: string;
  sessionId: string;
  visitorId: string;
  eventType: string;
  pageUrl: string;
  eventData?: Record<string, any>;
  deviceCategory?: "mobile" | "desktop" | "tablet";
  createdAt?: number;
}

export interface FunnelStepSummary {
  step: string;
  visitors: number;
  dropoffs: number;
  dropoffRate: number;
  conversionRate: number;
}

export class EventRepository {
  private db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  /**
   * Inserts a single telemetry event.
   */
  public insertEvent(input: InsertEventInput): void {
    const now = input.createdAt || Date.now();
    const deviceCategory = input.deviceCategory || "mobile";
    const eventDataJson = JSON.stringify(input.eventData || {});

    this.db.run(
      `INSERT INTO events (
        event_id, site_id, session_id, visitor_id, event_type,
        page_url, event_data, device_category, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.eventId,
        input.siteId,
        input.sessionId,
        input.visitorId,
        input.eventType,
        input.pageUrl,
        eventDataJson,
        deviceCategory,
        now,
      ]
    );
  }

  /**
   * Batch inserts multiple telemetry events atomically.
   */
  public insertEventsBatch(inputs: InsertEventInput[]): void {
    if (inputs.length === 0) return;

    this.db.transaction(() => {
      for (const input of inputs) {
        this.insertEvent(input);
      }
    });
  }

  /**
   * Queries events for a specific session, strictly bound by siteId to enforce tenant isolation.
   */
  public getSessionEvents(siteId: string, sessionId: string): DbEvent[] {
    return this.db.all<DbEvent>(
      `SELECT * FROM events 
       WHERE site_id = ? AND session_id = ? 
       ORDER BY created_at ASC`,
      [siteId, sessionId]
    );
  }

  /**
   * Queries recent events for a tenant.
   */
  public getRecentEvents(siteId: string, limit = 100): DbEvent[] {
    return this.db.all<DbEvent>(
      `SELECT * FROM events 
       WHERE site_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [siteId, limit]
    );
  }

  /**
   * Computes funnel progression for a tenant across standard e-commerce steps.
   */
  public getFunnelBreakdown(
    siteId: string,
    startTime: number,
    endTime: number,
    steps: string[] = ["page_view", "add_to_cart", "checkout_step", "purchase"]
  ): FunnelStepSummary[] {
    const results: FunnelStepSummary[] = [];

    let previousCount = 0;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      // Count distinct visitors reaching this step within time range
      const row = this.db.get<{ count: number }>(
        `SELECT COUNT(DISTINCT visitor_id) as count 
         FROM events 
         WHERE site_id = ? AND event_type = ? AND created_at >= ? AND created_at <= ?`,
        [siteId, step, startTime, endTime]
      );

      const count = row?.count || 0;

      if (i === 0) {
        previousCount = count;
        results.push({
          step,
          visitors: count,
          dropoffs: 0,
          dropoffRate: 0,
          conversionRate: count > 0 ? 100 : 0,
        });
      } else {
        const dropoffs = Math.max(0, previousCount - count);
        const dropoffRate = previousCount > 0 ? (dropoffs / previousCount) * 100 : 0;
        const baseline = results[0]?.visitors || 1;
        const conversionRate = (count / baseline) * 100;

        results.push({
          step,
          visitors: count,
          dropoffs,
          dropoffRate: Number(dropoffRate.toFixed(2)),
          conversionRate: Number(conversionRate.toFixed(2)),
        });

        previousCount = count;
      }
    }

    return results;
  }

  /**
   * Returns total event count for a tenant.
   */
  public getEventCount(siteId: string): number {
    const row = this.db.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM events WHERE site_id = ?`,
      [siteId]
    );
    return row?.count || 0;
  }
}
