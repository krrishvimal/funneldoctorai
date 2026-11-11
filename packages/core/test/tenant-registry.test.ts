import { describe, it, expect } from "vitest";
import { TenantRegistryService } from "../src/tenant-registry.js";
import { decryptSecret } from "../src/crypto-vault.js";
import crypto from "node:crypto";

describe("TenantRegistryService", () => {
  it("registers a merchant tenant with encrypted HMAC secret at rest", () => {
    const registry = new TenantRegistryService();
    const { tenant, rawSecret } = registry.registerTenant({
      siteId: "fashion-store.in",
      merchantName: "Fashion Store India",
      domain: "fashion-store.in",
    });

    expect(tenant.siteId).toBe("fashion-store.in");
    expect(tenant.merchantName).toBe("Fashion Store India");
    expect(tenant.domain).toBe("fashion-store.in");
    expect(tenant.publicKey.startsWith("fd_pk_")).toBe(true);
    expect(rawSecret.startsWith("fd_sec_")).toBe(true);

    // Cryptographic check: secret at rest is AES-256-GCM ciphertext, NOT plaintext
    expect(tenant.encryptedHmacSecret.ciphertext).toBeDefined();
    expect(tenant.encryptedHmacSecret.ciphertext).not.toBe(rawSecret);
    expect(decryptSecret(tenant.encryptedHmacSecret)).toBe(rawSecret);

    expect(tenant.status).toBe("active");
    expect(tenant.allowedOrigins).toContain("https://fashion-store.in");
    expect(tenant.allowedOrigins).toContain("https://www.fashion-store.in");
  });

  it("authorizes registered browser origins and rejects cross-tenant spoofing", () => {
    const registry = new TenantRegistryService();
    registry.registerTenant({
      siteId: "tenant-a.com",
      merchantName: "Tenant A",
      domain: "tenant-a.com",
      allowedOrigins: ["https://tenant-a.com"],
    });

    registry.registerTenant({
      siteId: "tenant-b.com",
      merchantName: "Tenant B",
      domain: "tenant-b.com",
      allowedOrigins: ["https://tenant-b.com"],
    });

    // Valid origins for respective tenants
    expect(registry.isAuthorizedOrigin("tenant-a.com", "https://tenant-a.com")).toBe(true);
    expect(registry.isAuthorizedOrigin("tenant-b.com", "https://tenant-b.com")).toBe(true);

    // Cross-tenant spoofing attempt: Tenant B origin calling Tenant A siteId
    expect(registry.isAuthorizedOrigin("tenant-a.com", "https://tenant-b.com")).toBe(false);
    expect(registry.isAuthorizedOrigin("tenant-b.com", "https://tenant-a.com")).toBe(false);

    // Malicious or unverified origin
    expect(registry.isAuthorizedOrigin("tenant-a.com", "https://evil-hacker.com")).toBe(false);
    expect(registry.isAuthorizedOrigin("tenant-a.com", null)).toBe(false);
  });

  it("handles cryptographic HMAC secret rotation with dual-secret overlap window", () => {
    const registry = new TenantRegistryService();
    const { rawSecret: oldSecret } = registry.registerTenant({
      siteId: "gadgets.in",
      merchantName: "Gadgets Store",
      domain: "gadgets.in",
    });

    const testPayload = JSON.stringify({ event: "CHECKOUT_COMPLETED", revenue: 4999 });

    // Generate signature using old secret
    const oldSig = `sha256=${crypto.createHmac("sha256", oldSecret).update(testPayload).digest("hex")}`;
    expect(registry.verifyTenantSignature("gadgets.in", testPayload, oldSig)).toBe(true);

    // Rotate secret with 24h overlap
    const { newSecret, previousSecret, expiresAt } = registry.rotateHmacSecret("gadgets.in", 24);
    expect(previousSecret).toBe(oldSecret);
    expect(newSecret).not.toBe(oldSecret);
    expect(expiresAt).toBeGreaterThan(Date.now());

    // Generate signature using new secret
    const newSig = `sha256=${crypto.createHmac("sha256", newSecret).update(testPayload).digest("hex")}`;

    // BOTH signatures must verify during the 24-hour overlap window!
    expect(registry.verifyTenantSignature("gadgets.in", testPayload, newSig)).toBe(true);
    expect(registry.verifyTenantSignature("gadgets.in", testPayload, oldSig)).toBe(true);

    // Tampered payload must fail
    expect(registry.verifyTenantSignature("gadgets.in", testPayload + "tampered", newSig)).toBe(false);

    // Once rotation grace period expires, old secret must be rejected
    const stored = registry.getTenant("gadgets.in")!;
    stored.hmacRotationExpiresAt = Date.now() - 1000; // Force expired overlap window
    expect(registry.verifyTenantSignature("gadgets.in", testPayload, oldSig)).toBe(false);
    expect(registry.verifyTenantSignature("gadgets.in", testPayload, newSig)).toBe(true);
  });

  it("performs emergency revocation for leaked secrets without 24-hour overlap", () => {
    const registry = new TenantRegistryService();
    const { rawSecret: leakedSecret } = registry.registerTenant({
      siteId: "compromised-store.com",
      merchantName: "Compromised Store",
      domain: "compromised-store.com",
    });

    const payload = JSON.stringify({ event: "ORDER_CREATED" });
    const leakedSig = `sha256=${crypto.createHmac("sha256", leakedSecret).update(payload).digest("hex")}`;
    expect(registry.verifyTenantSignature("compromised-store.com", payload, leakedSig)).toBe(true);

    // Emergency Revocation (Zero overlap window!)
    const { newSecret } = registry.emergencyRevokeHmacSecret("compromised-store.com");
    expect(newSecret).not.toBe(leakedSecret);

    // Leaked secret must be IMMEDIATELY rejected with zero overlap grace
    expect(registry.verifyTenantSignature("compromised-store.com", payload, leakedSig)).toBe(false);

    // Only newly generated secret verifies
    const newSig = `sha256=${crypto.createHmac("sha256", newSecret).update(payload).digest("hex")}`;
    expect(registry.verifyTenantSignature("compromised-store.com", payload, newSig)).toBe(true);
  });

  it("acts as a remote kill switch via setTenantStatus (pause / revoke / resume)", () => {
    const registry = new TenantRegistryService();
    registry.registerTenant({
      siteId: "active-store.com",
      merchantName: "Active Store",
      domain: "active-store.com",
    });

    expect(registry.isAuthorizedOrigin("active-store.com", "https://active-store.com")).toBe(true);

    // Pause tenant -> immediate kill switch
    registry.setTenantStatus("active-store.com", "paused");
    expect(registry.isAuthorizedOrigin("active-store.com", "https://active-store.com")).toBe(false);

    // Resume tenant
    registry.setTenantStatus("active-store.com", "active");
    expect(registry.isAuthorizedOrigin("active-store.com", "https://active-store.com")).toBe(true);

    // Revoke tenant
    registry.setTenantStatus("active-store.com", "revoked");
    expect(registry.isAuthorizedOrigin("active-store.com", "https://active-store.com")).toBe(false);
  });
});
