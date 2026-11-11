import { describe, it, expect } from "vitest";
import { SqliteDatabaseAdapter } from "../src/database/adapter.js";
import { TenantRepository } from "../src/database/tenant-repository.js";
import { EventRepository } from "../src/database/event-repository.js";
import { DatabaseBackupService } from "../src/database/backup-restore.js";
import { decryptSecret } from "../src/crypto-vault.js";

describe("Gate 3: Disaster Recovery, Backup & Restore Verification", () => {
  it("creates a complete SQL dump and successfully restores all tenant and event data with verified integrity", () => {
    // 1. Setup Source Database
    const sourceDb = new SqliteDatabaseAdapter(":memory:");
    const sourceTenantRepo = new TenantRepository(sourceDb);
    const sourceEventRepo = new EventRepository(sourceDb);

    const { tenant, rawSecret } = sourceTenantRepo.registerTenant({
      siteId: "backup_test_store",
      merchantName: "Disaster Recovery Merchant",
      domain: "dr.example.com",
    });

    sourceEventRepo.insertEventsBatch([
      {
        eventId: "dr_evt_1",
        siteId: "backup_test_store",
        sessionId: "dr_sess_1",
        visitorId: "dr_vis_1",
        eventType: "page_view",
        pageUrl: "https://dr.example.com/item/1",
      },
      {
        eventId: "dr_evt_2",
        siteId: "backup_test_store",
        sessionId: "dr_sess_1",
        visitorId: "dr_vis_1",
        eventType: "purchase",
        pageUrl: "https://dr.example.com/checkout/success",
        eventData: { amount: 2499 },
      },
    ]);

    const initialStats = DatabaseBackupService.getStats(sourceDb);
    expect(initialStats.tenantCount).toBe(1);
    expect(initialStats.eventCount).toBe(2);
    expect(initialStats.auditLogCount).toBe(1);

    // 2. Generate SQL Dump
    const dumpSql = DatabaseBackupService.createSqlDump(sourceDb);
    expect(dumpSql).toContain("INSERT INTO tenants");
    expect(dumpSql).toContain("INSERT INTO events");

    // 3. Setup Target (Clean) Database and Restore
    const targetDb = new SqliteDatabaseAdapter(":memory:");
    const isRestored = DatabaseBackupService.restoreAndVerify(dumpSql, targetDb, initialStats);
    expect(isRestored).toBe(true);

    // 4. Verify Target Database functionality
    const targetTenantRepo = new TenantRepository(targetDb);
    const restoredTenant = targetTenantRepo.getTenant("backup_test_store");
    expect(restoredTenant).toBeDefined();
    expect(restoredTenant?.merchantName).toBe("Disaster Recovery Merchant");

    // Decrypt secret on restored database using AAD tenant binding
    const decryptedSecret = decryptSecret(restoredTenant!.encryptedHmacSecret, "backup_test_store");
    expect(decryptedSecret).toBe(rawSecret);

    const targetEventRepo = new EventRepository(targetDb);
    const restoredEvents = targetEventRepo.getRecentEvents("backup_test_store");
    expect(restoredEvents.length).toBe(2);
    expect(restoredEvents[0].event_id).toBe("dr_evt_2");
  });
});
