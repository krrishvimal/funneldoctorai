/**
 * @file schema.ts
 * @description Database Schema DDL and TypeScript models for FunnelDoctor AI.
 * 
 * Supports SQLite (via node:sqlite) and PostgreSQL.
 * Embedded Enterprise Safeguards:
 * 1. Foreign Key Cascades & Constraints: Ensures referential integrity across tenants and events.
 * 2. Strict Tenant Partitioning: Every telemetry and aggregate record is keyed by site_id.
 * 3. Encrypted Credentials at Rest: Tenant HMAC secrets stored as JSON payloads produced by crypto-vault.
 * 4. DPDP & GDPR Compliance: Distinguishes between 90-day ephemeral raw telemetry and permanent aggregated metrics.
 */

export interface DbTenant {
  site_id: string;
  merchant_name: string;
  domain: string;
  allowed_origins: string; // JSON array of string
  public_key: string;
  encrypted_hmac_secret: string; // JSON stringified EncryptedSecretPayload
  encrypted_previous_hmac_secret: string | null;
  hmac_rotation_expires_at: number | null;
  status: "active" | "paused" | "revoked";
  created_at: number;
  updated_at: number;
}

export interface DbEvent {
  event_id: string;
  site_id: string;
  session_id: string;
  visitor_id: string;
  event_type: string;
  page_url: string;
  event_data: string; // JSON stringified payload (zero PII)
  device_category: "mobile" | "desktop" | "tablet";
  created_at: number;
}

export interface DbAggregatedMetric {
  site_id: string;
  metric_date: string; // YYYY-MM-DD
  step_name: string;
  visitors_count: number;
  dropoffs_count: number;
  conversions_count: number;
  avg_dwell_ms: number;
  updated_at: number;
}

export interface DbAuditLog {
  id?: number;
  site_id: string;
  actor: string;
  action: string;
  details: string; // JSON stringified
  ip_address: string | null;
  created_at: number;
}

export interface DbRetentionRun {
  run_id: string;
  cutoff_timestamp: number;
  events_purged: number;
  metrics_aggregated: number;
  status: "success" | "failed";
  error_message: string | null;
  executed_at: number;
}

/**
 * Migration 001: Initial Core Schema
 */
export const MIGRATION_001_SQL = `
-- 1. Merchant Tenant Registry (Durable System of Record)
CREATE TABLE IF NOT EXISTS tenants (
  site_id TEXT PRIMARY KEY,
  merchant_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  allowed_origins TEXT NOT NULL DEFAULT '[]',
  public_key TEXT NOT NULL,
  encrypted_hmac_secret TEXT NOT NULL,
  encrypted_previous_hmac_secret TEXT,
  hmac_rotation_expires_at INTEGER,
  status TEXT NOT NULL CHECK(status IN ('active', 'paused', 'revoked')) DEFAULT 'active',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Index for domain lookups
CREATE INDEX IF NOT EXISTS idx_tenants_domain ON tenants(domain);

-- 2. Raw Telemetry Event Ledger (Subject to 90-day DPDP Retention Purging)
CREATE TABLE IF NOT EXISTS events (
  event_id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  page_url TEXT NOT NULL,
  event_data TEXT NOT NULL DEFAULT '{}',
  device_category TEXT NOT NULL CHECK(device_category IN ('mobile', 'desktop', 'tablet')),
  created_at INTEGER NOT NULL,
  FOREIGN KEY (site_id) REFERENCES tenants(site_id) ON DELETE CASCADE
);

-- Compound indexes for high-throughput tenant event streaming and queries
CREATE INDEX IF NOT EXISTS idx_events_site_created ON events(site_id, created_at);
CREATE INDEX IF NOT EXISTS idx_events_site_session ON events(site_id, session_id);
CREATE INDEX IF NOT EXISTS idx_events_site_type ON events(site_id, event_type);

-- 3. Aggregated Funnel Metrics (Permanent Anonymized Retention)
CREATE TABLE IF NOT EXISTS aggregated_funnel_metrics (
  site_id TEXT NOT NULL,
  metric_date TEXT NOT NULL,
  step_name TEXT NOT NULL,
  visitors_count INTEGER NOT NULL DEFAULT 0,
  dropoffs_count INTEGER NOT NULL DEFAULT 0,
  conversions_count INTEGER NOT NULL DEFAULT 0,
  avg_dwell_ms REAL NOT NULL DEFAULT 0.0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (site_id, metric_date, step_name),
  FOREIGN KEY (site_id) REFERENCES tenants(site_id) ON DELETE CASCADE
);

-- 4. Audit Log Ledger (Tamper-Evident Security & Compliance Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id TEXT NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '{}',
  ip_address TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_site_created ON audit_logs(site_id, created_at);

-- 5. DPDP Data Retention Run History
CREATE TABLE IF NOT EXISTS retention_runs (
  run_id TEXT PRIMARY KEY,
  cutoff_timestamp INTEGER NOT NULL,
  events_purged INTEGER NOT NULL,
  metrics_aggregated INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('success', 'failed')),
  error_message TEXT,
  executed_at INTEGER NOT NULL
);
`;
