import { describe, it, expect, beforeEach } from "vitest";
import { SqliteDatabaseAdapter } from "../src/database/adapter.js";
import { TenantRepository } from "../src/database/tenant-repository.js";
import { EventRepository } from "../src/database/event-repository.js";
import { decryptSecret } from "../src/crypto-vault.js";

describe("Gate 3: Adversarial Multi-Tenant Isolation & Anti-Tamper Suite", () => {
  let db: SqliteDatabaseAdapter;
  let tenantRepo: TenantRepository;
  let eventRepo: EventRepository;

  beforeEach(() => {
    db = new SqliteDatabaseAdapter(":memory:");
    tenantRepo = new TenantRepository(db);
    eventRepo = new EventRepository(db);

    // Register Tenant Alpha
    tenantRepo.registerTenant({
      siteId: "tenant_alpha",
      merchantName: "Alpha Merchant",
      domain: "alpha.com",
    });

    // Register Tenant Beta
    tenantRepo.registerTenant({
      siteId: "tenant_beta",
      merchantName: "Beta Merchant",
      domain: "beta.com",
    });

    // Seed events for Tenant Alpha
    eventRepo.insertEventsBatch([
      {
        eventId: "alpha_evt_1",
        siteId: "tenant_alpha",
        sessionId: "alpha_sess_100",
        visitorId: "alpha_vis_1",
        eventType: "page_view",
        pageUrl: "https://alpha.com/home",
      },
      {
        eventId: "alpha_evt_2",
        siteId: "tenant_alpha",
        sessionId: "alpha_sess_100",
        visitorId: "alpha_vis_1",
        eventType: "purchase",
        pageUrl: "https://alpha.com/thank-you",
        eventData: { amount: 999 },
      },
    ]);

    // Seed events for Tenant Beta
    eventRepo.insertEventsBatch([
      {
        eventId: "beta_evt_1",
        siteId: "tenant_beta",
        sessionId: "beta_sess_200",
        visitorId: "beta_vis_2",
        eventType: "page_view",
        pageUrl: "https://beta.com/checkout",
      },
      {
        eventId: "beta_evt_2",
        siteId: "tenant_beta",
        sessionId: "beta_sess_200",
        visitorId: "beta_vis_2",
        eventType: "purchase",
        pageUrl: "https://beta.com/order-confirmed",
        eventData: { amount: 4999 },
      },
    ]);
  });

  it("adversarial read: Tenant A cannot read Tenant B's session events by ID tampering", () => {
    // Malicious query: Tenant A asks for Tenant B's session ID
    const crossEvents = eventRepo.getSessionEvents("tenant_alpha", "beta_sess_200");
    expect(crossEvents.length).toBe(0);

    // Legitimate query: Tenant B asks for its own session
    const legitimateEvents = eventRepo.getSessionEvents("tenant_beta", "beta_sess_200");
    expect(legitimateEvents.length).toBe(2);
    expect(legitimateEvents[0].site_id).toBe("tenant_beta");
  });

  it("adversarial read: Tenant A cannot read Tenant B's event count or recent stream", () => {
    const alphaCount = eventRepo.getEventCount("tenant_alpha");
    const betaCount = eventRepo.getEventCount("tenant_beta");

    expect(alphaCount).toBe(2);
    expect(betaCount).toBe(2);

    const alphaRecent = eventRepo.getRecentEvents("tenant_alpha");
    expect(alphaRecent.every((e) => e.site_id === "tenant_alpha")).toBe(true);
    expect(alphaRecent.some((e) => e.site_id === "tenant_beta")).toBe(false);
  });

  it("cryptographic tamper defense: ciphertext swapping between tenants fails AAD verification", () => {
    const tenantAlpha = tenantRepo.getTenant("tenant_alpha")!;
    const tenantBeta = tenantRepo.getTenant("tenant_beta")!;

    // Malicious SQL write attack: swapping Tenant Alpha's encrypted secret into Tenant Beta's record
    db.run(
      `UPDATE tenants SET encrypted_hmac_secret = ? WHERE site_id = 'tenant_beta'`,
      [JSON.stringify(tenantAlpha.encryptedHmacSecret)]
    );

    const tamperedBeta = tenantRepo.getTenant("tenant_beta")!;

    // Attempting to decrypt the swapped ciphertext using Tenant Beta's identity must throw
    // because AES-256-GCM authenticated data (AAD) was bound to "tenant_alpha"
    expect(() => {
      decryptSecret(tamperedBeta.encryptedHmacSecret, "tenant_beta");
    }).toThrow(/Unsupported state or unable to authenticate data/i);
  });

  it("audit trail isolation: Tenant A cannot see Tenant B's security audit log entries", () => {
    tenantRepo.rotateHmacSecret("tenant_alpha", 24, "alpha_admin");
    tenantRepo.emergencyRevokeHmacSecret("tenant_beta", "beta_admin");

    const alphaLogs = tenantRepo.getAuditLogs("tenant_alpha");
    const betaLogs = tenantRepo.getAuditLogs("tenant_beta");

    expect(alphaLogs.every((log) => log.site_id === "tenant_alpha")).toBe(true);
    expect(betaLogs.every((log) => log.site_id === "tenant_beta")).toBe(true);
    expect(alphaLogs.some((log) => log.actor === "beta_admin")).toBe(false);
  });
});
