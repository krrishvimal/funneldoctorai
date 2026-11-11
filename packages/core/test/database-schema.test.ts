import { describe, it, expect, beforeEach } from "vitest";
import { SqliteDatabaseAdapter } from "../src/database/adapter.js";
import { TenantRepository } from "../src/database/tenant-repository.js";
import { EventRepository } from "../src/database/event-repository.js";

describe("Gate 3: Database Schema, Foreign Keys & Transactions", () => {
  let db: SqliteDatabaseAdapter;
  let tenantRepo: TenantRepository;
  let eventRepo: EventRepository;

  beforeEach(() => {
    db = new SqliteDatabaseAdapter(":memory:");
    tenantRepo = new TenantRepository(db);
    eventRepo = new EventRepository(db);
  });

  it("enforces foreign key constraints: prevents orphaned telemetry events", () => {
    // Attempting to insert an event for a non-existent tenant must throw
    expect(() => {
      eventRepo.insertEvent({
        eventId: "evt_orphan_1",
        siteId: "non_existent_site",
        sessionId: "sess_1",
        visitorId: "vis_1",
        eventType: "page_view",
        pageUrl: "https://example.com/products/test",
      });
    }).toThrow(/FOREIGN KEY/i);
  });

  it("persists tenant with encrypted secrets and allows event ingestion once registered", () => {
    const { tenant, rawSecret } = tenantRepo.registerTenant({
      siteId: "store_alpha",
      merchantName: "Alpha Store",
      domain: "alpha.store",
      allowedOrigins: ["https://alpha.store"],
    });

    expect(tenant.siteId).toBe("store_alpha");
    expect(rawSecret).toMatch(/^fd_sec_/);

    // Now event ingestion succeeds because foreign key resolves
    eventRepo.insertEvent({
      eventId: "evt_alpha_1",
      siteId: "store_alpha",
      sessionId: "sess_alpha_100",
      visitorId: "vis_alpha_999",
      eventType: "page_view",
      pageUrl: "https://alpha.store/checkout",
      eventData: { step: 1 },
    });

    const recent = eventRepo.getRecentEvents("store_alpha");
    expect(recent.length).toBe(1);
    expect(recent[0].event_id).toBe("evt_alpha_1");
  });

  it("records audit logs on secret rotation and emergency revocation", () => {
    tenantRepo.registerTenant({
      siteId: "store_audit",
      merchantName: "Audit Store",
      domain: "audit.store",
    });

    // Rotate secret
    tenantRepo.rotateHmacSecret("store_audit", 24, "admin_user", "192.168.1.1");

    // Emergency revoke
    tenantRepo.emergencyRevokeHmacSecret("store_audit", "security_officer", "10.0.0.1");

    const auditLogs = tenantRepo.getAuditLogs("store_audit");
    expect(auditLogs.length).toBe(3); // REGISTERED, ROTATED, EMERGENCY_REVOCATION

    expect(auditLogs[0].action).toBe("EMERGENCY_REVOCATION");
    expect(auditLogs[0].actor).toBe("security_officer");
    expect(auditLogs[1].action).toBe("SECRET_ROTATED");
    expect(auditLogs[1].actor).toBe("admin_user");
    expect(auditLogs[2].action).toBe("TENANT_REGISTERED");
  });
});
