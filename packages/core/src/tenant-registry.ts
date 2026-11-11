/**
 * @file tenant-registry.ts
 * @description Dynamic Tenant Registry Service for FunnelDoctor AI.
 * Replaces static hardcoded maps with a structured service supporting:
 * - Dynamic merchant tenant registration
 * - Origin / Referer validation against registered domains
 * - Cryptographic HMAC secret rotation with configurable overlap grace periods
 * - Emergency per-tenant kill-switch / pause toggling
 */

import crypto from "node:crypto";
import { encryptSecret, decryptSecret, EncryptedSecretPayload } from "./crypto-vault.js";

export type TenantStatus = "active" | "paused" | "revoked";

/**
 * Merchant Tenant Record.
 * Note on Cryptographic Direction:
 * 1. Inbound Webhook / Telemetry Verification: Used to verify merchant-signed payloads sent into FunnelDoctor.
 * 2. Outbound Alert Webhook Signing: Used by FunnelDoctor to sign incident payloads dispatched to merchant endpoints.
 * HMAC secrets are stored encrypted at rest using AES-256-GCM.
 */
export interface TenantRecord {
  siteId: string;
  merchantName: string;
  domain: string;
  allowedOrigins: string[];
  publicKey: string;
  encryptedHmacSecret: EncryptedSecretPayload;
  encryptedPreviousHmacSecret?: EncryptedSecretPayload;
  hmacRotationExpiresAt?: number; // Timestamp when previous secret stops verifying
  status: TenantStatus;
  createdAt: number;
  updatedAt: number;
}

export interface RegisterTenantInput {
  siteId: string;
  merchantName: string;
  domain: string;
  allowedOrigins?: string[];
  initialSecret?: string;
}

export class TenantRegistryService {
  private tenants = new Map<string, TenantRecord>();

  constructor(initialTenants: Array<Omit<TenantRecord, "encryptedHmacSecret"> & { currentHmacSecret: string }> = []) {
    initialTenants.forEach((t) => {
      const encrypted = encryptSecret(t.currentHmacSecret, t.siteId);
      this.tenants.set(t.siteId, {
        siteId: t.siteId,
        merchantName: t.merchantName,
        domain: t.domain,
        allowedOrigins: t.allowedOrigins,
        publicKey: t.publicKey,
        encryptedHmacSecret: encrypted,
        status: t.status,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      });
    });
  }

  /**
   * Registers a new merchant tenant and generates unique public and encrypted HMAC secrets.
   * Cryptographically binds the tenant's siteId as AAD to prevent cross-tenant ciphertext swapping.
   */
  public registerTenant(input: RegisterTenantInput): { tenant: TenantRecord; rawSecret: string } {
    const cleanDomain = input.domain.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const siteId = input.siteId.toLowerCase().trim();

    const allowedOrigins = input.allowedOrigins || [
      `https://${cleanDomain}`,
      `https://www.${cleanDomain}`,
    ];

    const publicKey = `fd_pk_${crypto.randomBytes(12).toString("hex")}`;
    const rawSecret = input.initialSecret || `fd_sec_${crypto.randomBytes(24).toString("hex")}`;
    const encryptedHmacSecret = encryptSecret(rawSecret, siteId);

    const tenant: TenantRecord = {
      siteId,
      merchantName: input.merchantName,
      domain: cleanDomain,
      allowedOrigins,
      publicKey,
      encryptedHmacSecret,
      status: "active",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.tenants.set(siteId, tenant);
    return { tenant, rawSecret };
  }

  public getTenant(siteId: string): TenantRecord | null {
    return this.tenants.get(siteId.toLowerCase().trim()) || null;
  }

  /**
   * Decrypts and retrieves the active HMAC secret for outbound webhook signing.
   */
  public getActiveSigningSecret(siteId: string): string | null {
    const tenant = this.getTenant(siteId);
    if (!tenant || tenant.status !== "active") return null;
    return decryptSecret(tenant.encryptedHmacSecret, tenant.siteId);
  }

  /**
   * Validates whether an incoming HTTP Origin or Referer header matches the tenant's authorized origins.
   * Rejects cross-tenant spoofing attempts.
   */
  public isAuthorizedOrigin(siteId: string, originOrReferer: string | null): boolean {
    const tenant = this.getTenant(siteId);
    if (!tenant || tenant.status !== "active") return false;
    if (!originOrReferer) return false;

    const lower = originOrReferer.toLowerCase().trim();

    return tenant.allowedOrigins.some((allowed) => {
      const allowedClean = allowed.toLowerCase().trim();
      return lower === allowedClean || lower.startsWith(allowedClean + "/") || lower.startsWith(allowedClean + ":");
    });
  }

  /**
   * Rotates a tenant's HMAC secret with an overlap grace period (default 24 hours).
   * During the overlap period, payloads signed with either the old or new secret will verify.
   */
  public rotateHmacSecret(siteId: string, overlapHours = 24): { newSecret: string; previousSecret: string; expiresAt: number } {
    const tenant = this.getTenant(siteId);
    if (!tenant) throw new Error(`Tenant '${siteId}' not found.`);

    const newSecret = `fd_sec_${crypto.randomBytes(24).toString("hex")}`;
    const previousSecret = decryptSecret(tenant.encryptedHmacSecret, tenant.siteId);
    const expiresAt = Date.now() + overlapHours * 60 * 60 * 1000;

    tenant.encryptedPreviousHmacSecret = encryptSecret(previousSecret, tenant.siteId);
    tenant.hmacRotationExpiresAt = expiresAt;
    tenant.encryptedHmacSecret = encryptSecret(newSecret, tenant.siteId);
    tenant.updatedAt = Date.now();

    return { newSecret, previousSecret, expiresAt };
  }

  /**
   * Emergency revocation of a compromised secret.
   * Instantly invalidates previous secret, wipes overlap grace period, and generates a fresh secret.
   */
  public emergencyRevokeHmacSecret(siteId: string): { newSecret: string } {
    const tenant = this.getTenant(siteId);
    if (!tenant) throw new Error(`Tenant '${siteId}' not found.`);

    const newSecret = `fd_sec_${crypto.randomBytes(24).toString("hex")}`;
    tenant.encryptedHmacSecret = encryptSecret(newSecret, tenant.siteId);
    tenant.encryptedPreviousHmacSecret = undefined;
    tenant.hmacRotationExpiresAt = undefined;
    tenant.updatedAt = Date.now();

    return { newSecret };
  }

  /**
   * Verifies an HMAC signature against current and (if in overlap period) previous secret.
   */
  public verifyTenantSignature(siteId: string, payloadString: string, signatureWithPrefix: string): boolean {
    const tenant = this.getTenant(siteId);
    if (!tenant || tenant.status !== "active") return false;

    const signature = signatureWithPrefix.replace(/^sha256=/, "");

    // 1. Verify against decrypted current secret with AAD
    const currentSecret = decryptSecret(tenant.encryptedHmacSecret, tenant.siteId);
    const expectedCurrent = crypto.createHmac("sha256", currentSecret).update(payloadString).digest("hex");
    if (this.timingSafeCheck(signature, expectedCurrent)) {
      return true;
    }

    // 2. Check previous secret if within rotation overlap window
    if (tenant.encryptedPreviousHmacSecret && tenant.hmacRotationExpiresAt && Date.now() <= tenant.hmacRotationExpiresAt) {
      const previousSecret = decryptSecret(tenant.encryptedPreviousHmacSecret, tenant.siteId);
      const expectedPrevious = crypto.createHmac("sha256", previousSecret).update(payloadString).digest("hex");
      if (this.timingSafeCheck(signature, expectedPrevious)) {
        return true;
      }
    }

    return false;
  }

  private timingSafeCheck(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    try {
      return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
    } catch {
      return false;
    }
  }

  /**
   * Sets tenant operational status (active, paused, revoked) acting as an instant remote kill switch.
   */
  public setTenantStatus(siteId: string, status: TenantStatus): void {
    const tenant = this.getTenant(siteId);
    if (!tenant) throw new Error(`Tenant '${siteId}' not found.`);
    tenant.status = status;
    tenant.updatedAt = Date.now();
  }

  public listTenants(): TenantRecord[] {
    return Array.from(this.tenants.values());
  }
}

// Global default service initialized with seeded demo/sandbox stores
export const tenantRegistry = new TenantRegistryService([
  {
    siteId: "example-store.com",
    merchantName: "Example D2C Apparel",
    domain: "example-store.com",
    allowedOrigins: ["https://example-store.com", "https://www.example-store.com"],
    publicKey: "fd_pk_example_prod_89a3f",
    currentHmacSecret: "fd_sec_example_secret_key_89a3f",
    status: "active",
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    siteId: "demo-store.myshopify.com",
    merchantName: "Shopify Partner Demo Store",
    domain: "demo-store.myshopify.com",
    allowedOrigins: ["https://demo-store.myshopify.com"],
    publicKey: "fd_pk_demo_store_test_123",
    currentHmacSecret: "fd_sec_demo_store_secret_123",
    status: "active",
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    siteId: "snitch.co.in",
    merchantName: "SNITCH Menswear",
    domain: "snitch.co.in",
    allowedOrigins: ["https://snitch.co.in", "https://www.snitch.co.in"],
    publicKey: "fd_pk_snitch_prod_live",
    currentHmacSecret: "fd_sec_snitch_hmac_secret",
    status: "active",
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
]);
