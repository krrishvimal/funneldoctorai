/**
 * @file tenant-repository.ts
 * @description Persistent Database Repository for Merchant Tenants with Audit Logging.
 * 
 * Guarantees:
 * 1. Durable System of Record: All tenants and secrets are persisted in the SQL database.
 * 2. Cryptographic Envelope Encryption: HMAC secrets are encrypted at rest with AES-256-GCM.
 * 3. Additional Authenticated Data (AAD): siteId is bound as AAD to prevent cross-tenant ciphertext swapping.
 * 4. Audit Trail: All rotations, revocations, and status mutations append to audit_logs.
 */

import crypto from "node:crypto";
import { DatabaseAdapter } from "./adapter.js";
import { DbTenant, DbAuditLog } from "./schema.js";
import { encryptSecret, decryptSecret, EncryptedSecretPayload } from "../crypto-vault.js";
import { TenantRecord, TenantStatus, RegisterTenantInput } from "../tenant-registry.js";

export class TenantRepository {
  private db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  /**
   * Registers a new tenant and persists it to the durable database.
   * Encrypts the generated or provided HMAC secret with AES-256-GCM and AAD binding.
   */
  public registerTenant(
    input: RegisterTenantInput,
    actor = "system",
    ipAddress: string | null = null
  ): { tenant: TenantRecord; rawSecret: string } {
    const rawSecret = input.initialSecret || `fd_sec_${crypto.randomBytes(24).toString("hex")}`;
    const publicKey = `pk_live_${crypto.randomBytes(16).toString("hex")}`;
    const allowedOrigins = input.allowedOrigins || [`https://${input.domain}`];
    const now = Date.now();

    // Cryptographic Envelope Encryption with Tenant AAD Binding
    const encryptedSecret = encryptSecret(rawSecret, input.siteId);

    const record: TenantRecord = {
      siteId: input.siteId,
      merchantName: input.merchantName,
      domain: input.domain,
      allowedOrigins,
      publicKey,
      encryptedHmacSecret: encryptedSecret,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    this.db.transaction(() => {
      this.db.run(
        `INSERT INTO tenants (
          site_id, merchant_name, domain, allowed_origins, public_key,
          encrypted_hmac_secret, encrypted_previous_hmac_secret, hmac_rotation_expires_at,
          status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.siteId,
          record.merchantName,
          record.domain,
          JSON.stringify(record.allowedOrigins),
          record.publicKey,
          JSON.stringify(record.encryptedHmacSecret),
          null,
          null,
          record.status,
          record.createdAt,
          record.updatedAt,
        ]
      );

      this.logAudit({
        site_id: record.siteId,
        actor,
        action: "TENANT_REGISTERED",
        details: JSON.stringify({
          merchantName: record.merchantName,
          domain: record.domain,
          allowedOrigins: record.allowedOrigins,
          publicKey: record.publicKey,
        }),
        ip_address: ipAddress,
        created_at: now,
      });
    });

    return { tenant: record, rawSecret };
  }

  /**
   * Retrieves a tenant by siteId.
   */
  public getTenant(siteId: string): TenantRecord | null {
    const row = this.db.get<DbTenant>(`SELECT * FROM tenants WHERE site_id = ?`, [siteId]);
    if (!row) return null;

    return this.mapDbRowToTenant(row);
  }

  /**
   * Retrieves a tenant by public key.
   */
  public getTenantByPublicKey(publicKey: string): TenantRecord | null {
    const row = this.db.get<DbTenant>(`SELECT * FROM tenants WHERE public_key = ?`, [publicKey]);
    if (!row) return null;

    return this.mapDbRowToTenant(row);
  }

  /**
   * Rotates a tenant's HMAC secret with an overlap grace period (default 24h).
   */
  public rotateHmacSecret(
    siteId: string,
    overlapHours = 24,
    actor = "system",
    ipAddress: string | null = null
  ): { newSecret: string; previousSecret: string; expiresAt: number } {
    const tenant = this.getTenant(siteId);
    if (!tenant) throw new Error(`Tenant '${siteId}' not found.`);

    const newSecret = `fd_sec_${crypto.randomBytes(24).toString("hex")}`;
    const previousSecret = decryptSecret(tenant.encryptedHmacSecret, tenant.siteId);
    const expiresAt = Date.now() + overlapHours * 60 * 60 * 1000;
    const now = Date.now();

    const encryptedNew = encryptSecret(newSecret, tenant.siteId);
    const encryptedPrev = encryptSecret(previousSecret, tenant.siteId);

    this.db.transaction(() => {
      this.db.run(
        `UPDATE tenants SET 
          encrypted_hmac_secret = ?,
          encrypted_previous_hmac_secret = ?,
          hmac_rotation_expires_at = ?,
          updated_at = ?
        WHERE site_id = ?`,
        [JSON.stringify(encryptedNew), JSON.stringify(encryptedPrev), expiresAt, now, siteId]
      );

      this.logAudit({
        site_id: siteId,
        actor,
        action: "SECRET_ROTATED",
        details: JSON.stringify({ overlapHours, expiresAt }),
        ip_address: ipAddress,
        created_at: now,
      });
    });

    return { newSecret, previousSecret, expiresAt };
  }

  /**
   * Emergency revocation of a compromised secret.
   * Overlap is immediately purged (0-second grace).
   */
  public emergencyRevokeHmacSecret(
    siteId: string,
    actor = "security_admin",
    ipAddress: string | null = null
  ): { newSecret: string } {
    const tenant = this.getTenant(siteId);
    if (!tenant) throw new Error(`Tenant '${siteId}' not found.`);

    const newSecret = `fd_sec_${crypto.randomBytes(24).toString("hex")}`;
    const encryptedNew = encryptSecret(newSecret, tenant.siteId);
    const now = Date.now();

    this.db.transaction(() => {
      this.db.run(
        `UPDATE tenants SET 
          encrypted_hmac_secret = ?,
          encrypted_previous_hmac_secret = NULL,
          hmac_rotation_expires_at = NULL,
          updated_at = ?
        WHERE site_id = ?`,
        [JSON.stringify(encryptedNew), now, siteId]
      );

      this.logAudit({
        site_id: siteId,
        actor,
        action: "EMERGENCY_REVOCATION",
        details: JSON.stringify({ reason: "compromised_secret", overlapGraceHours: 0 }),
        ip_address: ipAddress,
        created_at: now,
      });
    });

    return { newSecret };
  }

  /**
   * Updates tenant status (active, paused, revoked).
   */
  public setTenantStatus(
    siteId: string,
    status: TenantStatus,
    actor = "system",
    ipAddress: string | null = null
  ): void {
    const now = Date.now();
    this.db.transaction(() => {
      const res = this.db.run(`UPDATE tenants SET status = ?, updated_at = ? WHERE site_id = ?`, [
        status,
        now,
        siteId,
      ]);
      if (res.changes === 0) throw new Error(`Tenant '${siteId}' not found.`);

      this.logAudit({
        site_id: siteId,
        actor,
        action: "STATUS_CHANGED",
        details: JSON.stringify({ newStatus: status }),
        ip_address: ipAddress,
        created_at: now,
      });
    });
  }

  /**
   * Retrieves audit logs for a tenant.
   */
  public getAuditLogs(siteId: string, limit = 50): DbAuditLog[] {
    return this.db.all<DbAuditLog>(
      `SELECT * FROM audit_logs WHERE site_id = ? ORDER BY created_at DESC LIMIT ?`,
      [siteId, limit]
    );
  }

  private logAudit(entry: DbAuditLog): void {
    this.db.run(
      `INSERT INTO audit_logs (site_id, actor, action, details, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [entry.site_id, entry.actor, entry.action, entry.details, entry.ip_address, entry.created_at]
    );
  }

  private mapDbRowToTenant(row: DbTenant): TenantRecord {
    return {
      siteId: row.site_id,
      merchantName: row.merchant_name,
      domain: row.domain,
      allowedOrigins: JSON.parse(row.allowed_origins),
      publicKey: row.public_key,
      encryptedHmacSecret: JSON.parse(row.encrypted_hmac_secret),
      encryptedPreviousHmacSecret: row.encrypted_previous_hmac_secret
        ? JSON.parse(row.encrypted_previous_hmac_secret)
        : undefined,
      hmacRotationExpiresAt: row.hmac_rotation_expires_at ?? undefined,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
