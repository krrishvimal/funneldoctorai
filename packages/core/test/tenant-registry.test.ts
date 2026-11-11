import { describe, it, expect } from "vitest";
import { TenantRegistryService } from "../src/tenant-registry.js";
import crypto from "node:crypto";

describe("TenantRegistryService", () => {
  it("registers a merchant tenant with secure public key and HMAC secret", () => {
    const registry = new TenantRegistryService();
    const tenant = registry.registerTenant({
      siteId: "fashion-store.in",
      merchantName: "Fashion Store India",
      domain: "fashion-store.in",
    });

    expect(tenant.siteId).toBe("fashion-store.in");
    expect(tenant.merchantName).toBe("Fashion Store India");
    expect(tenant.domain).toBe("fashion-store.in");
    expect(tenant.publicKey.startsWith("fd_pk_")).toBe(true);
    expect(tenant.currentHmacSecret.startsWith("fd_sec_")).toBe(true);
    expect(tenant.status).toBe("active");
    expect(tenant.allowedOrigins).toContain("https://fashion-store.in");
    expect(tenant.allowedOrigins).toContain("https://www.fashion-store.in");
  });

  it("authorizes registered browser origins and referrers", () => {
    const registry = new TenantRegistryService();
    registry.registerTenant({
      siteId: "kurtas.com",
      merchantName: "Kurtas Official",
      domain: "kurtas.com",
      allowedOrigins: ["https://kurtas.com", "https://shop.kurtas.com"],
    });

    expect(registry.isAuthorizedOrigin("kurtas.com", "https://kurtas.com")).toBe(true);
    expect(registry.isAuthorizedOrigin("kurtas.com", "https://kurtas.com/products/summer-kurta")).toBe(true);
    expect(registry.isAuthorizedOrigin("kurtas.com", "https://shop.kurtas.com")).toBe(true);
    expect(registry.isAuthorizedOrigin("kurtas.com", "https://evil-spoof.com")).toBe(false);
    expect(registry.isAuthorizedOrigin("kurtas.com", null)).toBe(false);
    expect(registry.isAuthorizedOrigin("nonexistent", "https://kurtas.com")).toBe(false);
  });

  it("handles cryptographic HMAC secret rotation with dual-secret overlap window", () => {
    const registry = new TenantRegistryService();
    const tenant = registry.registerTenant({
      siteId: "gadgets.in",
      merchantName: "Gadgets Store",
      domain: "gadgets.in",
    });

    const oldSecret = tenant.currentHmacSecret;
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
    // New secret continues to verify
    expect(registry.verifyTenantSignature("gadgets.in", testPayload, newSig)).toBe(true);
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
