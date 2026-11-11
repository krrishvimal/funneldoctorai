# Changelog

All notable changes to the FunnelDoctor AI codebase are documented in this file.

## [Milestone 1] - Code Complete, Field Verification Pending (2026-11-11)

### Status Summary
- **Code Status**: Code complete across all client telemetry, API ingest, stats engine, heuristics synthesizer, and enterprise security modules.
- **Verification Status**: Unit and integration test suites are 100% green (179 passing tests across vitest, dynamic SRI scanner, and enterprise SSRF security suites).
- **Field Verification**: Live field verification on a dedicated Shopify development store and physical Android/iOS hardware remains pending (workbook defined in `docs/FIELD_VERIFICATION_CHECKLIST.md`).

---

### Security & Compliance Hardening
- **Zero-Bypass SSRF Defense**: Enforced comprehensive subnet validation blocking RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), loopback (127.0.0.0/8, ::1), cloud metadata (169.254.169.254 AWS/GCP IMDS), carrier-grade NAT (100.64.0.0/10), benchmarking (198.18.0.0/15), NAT64, 6to4, and IPv4-mapped IPv6.
- **Port 443 Enforcement**: Webhook dispatches are strictly restricted to HTTPS port 443; cleartext HTTP port 80 and arbitrary ports are rejected.
- **True Socket Pinning & TLS SNI**: Agent forces socket connection directly to pre-resolved IP while preserving TLS SNI `host` header so certificate validation against the hostname is strictly maintained.
- **Crawler Redirect Hop Re-validation**: In `dom-inspector.ts`, manual redirect hopping validates destination protocols, merchant domain ownership, and subnets on every single hop, preventing redirect-based SSRF bounce into cloud metadata.
- **Cryptographic Anti-Replay HMAC**: Signs `timestamp + "." + deliveryId + "." + rawBody` with 5-minute freshness tolerance and timing-safe equal buffer checks guarded against length mismatch `RangeError` exceptions.
- **PII Scrubbing & Default-Deny Classifier**: Added regex splitting for acronym runs (`OTPCode` -> `OTP Code`) and camelCase (`upiPin` -> `upi Pin`), with deny-first evaluation and default-deny fallback for unknown input fields. Explicitly allowed Indian postal code variations (`pin_code`, `pincode`, `postal-code`).
- **Storefront Safe Boot**: Wrapped client browser boot sequence in `try ... catch` fail-safe to guarantee 0% crash risk on merchant storefronts.

### Architecture & Integrations
- **Dynamic Cart Permalinks**: Replaced static Liquid cart loop with dynamic `/cart.js` fetch at click time to capture real-time AJAX cart drawer changes, appending `&attributes[_fd_vid]=` for cross-browser visitor ID continuity. Renamed feature to "Quick Checkout Link" to clearly distinguish from native checkout 1-tap UPI.
- **Shopify Web Pixel Event Schema**: Aligned event tracking with official Shopify checkout specifications (`checkout_started`, `checkout_contact_info_submitted`, `checkout_address_info_submitted`, `checkout_shipping_info_submitted`, `payment_info_submitted`, `checkout_completed`).
- **Configurable Shopify API Versioning**: Added `packages/core/src/shopify-config.ts` with configurable version resolver (`process.env.SHOPIFY_API_VERSION || '2026-10'`) and automated 300-day deprecation warning checks.
- **SRI Immutability Policy**: Implemented permanent immutability checks (`scripts/check-sri-immutability.mjs`) locking published bundles (`v1.0.3` [deprecated], `v1.0.4` [current_stable]) against `scripts/sri-manifest.json`.

---

## [Milestone 2 Kickoff] - Foundations & State Persistence

### Foundations Completed (Gate 2)
- **Universal StateStore Abstraction (`packages/core/src/state-store.ts`)**:
  - Implemented sliding-window distributed rate limiter with atomic timestamps.
  - Fail-open policy on rate limiting (prevents dropping legitimate merchant sales).
  - Fail-closed policy for kill switch and circuit breakers.
  - Pluggable for Redis in clustered environments, with in-memory fallback for local dev and tests.
- **Dynamic Tenant Registry (`packages/core/src/tenant-registry.ts`)**:
  - Structured merchant registration with cryptographic public keys (`fd_pk_*`) and HMAC secrets (`fd_sec_*`).
  - Origin / Referer validation against registered domains.
  - 24-hour dual-secret overlap window for zero-downtime HMAC secret rotation.
  - Remote per-tenant kill switch (`active`, `paused`, `revoked`).
- **Webhook Delivery Deduplication (`packages/core/src/delivery-id-store.ts`)**:
  - StateStore-backed deduplication store for webhook delivery IDs with 24-hour TTL to eliminate duplicate event replay.
- **Ingest API Migration (`apps/web/src/app/api/ingest/route.ts`)**:
  - Replaced hardcoded tenant maps with `TenantRegistryService`.
  - Replaced instance-level rate limit maps with `StateStore.rateLimit()`.

---

## [Milestone 2 - Gate 3] - Data Layer, Persistence & DPDP Compliance (2026-11-11)

### Status Summary
- **Gate 3 Status**: Code complete and fully verified.
- **Verification Status**: 203 automated checks passing across 7 suites in `docs/TEST_REPORT.md` (up from 192).

### Implemented Capabilities
- **Durable Database Persistence (`packages/core/src/database/adapter.ts`, `schema.ts`)**:
  - Embedded zero-dependency SQL persistence engine via `node:sqlite` with WAL mode and foreign key cascades.
  - Parameterized queries with 100% protection against SQL injection.
- **Durable Tenant Repository (`packages/core/src/database/tenant-repository.ts`)**:
  - System of record for merchant tenants, status mutations, and encrypted credentials.
  - AES-256-GCM envelope encryption with AAD tenant binding (`siteId` bound to ciphertext to prevent cross-tenant swaps).
  - Append-only audit log recording every rotation, emergency revoke, and configuration mutation.
- **Strict Tenant-Isolated Event Store (`packages/core/src/database/event-repository.ts`)**:
  - High-throughput batch telemetry event ingestion.
  - Hard tenant isolation enforced on every query (`WHERE site_id = ?`).
  - Conversion funnel and dropoff aggregation queries.
- **DPDP / GDPR 90-Day Retention Engine (`packages/core/src/database/retention-engine.ts`)**:
  - Automatic 90-day retention cutoff: raw event clickstreams and device identifiers are hard-purged.
  - Anonymized historical preservation: expiring events are aggregated into `aggregated_funnel_metrics` prior to deletion.
  - Tamper-evident compliance ledger in `retention_runs`.
- **Disaster Recovery & Backup Service (`packages/core/src/database/backup-restore.ts`)**:
  - Automated SQL snapshot dump generator and restore verification suite validating row counts, foreign keys, and cryptographic secret consistency post-restore.

---

## [Milestone 2 - Gate 4] - Statistical Validation & Benchmarking (2026-11-11)

### Status Summary
- **Gate 4 Status**: Code complete and mathematically verified.
- **Verification Status**: 212 automated checks passing across 7 suites in `docs/TEST_REPORT.md` (up from 203).

### Implemented Capabilities
- **Automated Monte Carlo A/A Simulation Engine (`packages/core/src/aa-simulator.ts`)**:
  - Simulates 1,000 independent A/A experiments with 2,000 visitors per variant and 4% true conversion rate.
  - Proves empirical false positive rate $\alpha_{empirical} \approx 0.05$ (bounded tightly within 3-sigma tolerance $[3.0\%, 7.0\%]$), eliminating phantom CRO significance.
  - Verifies uniform distribution of p-values under the null hypothesis (mean p-value $\approx 0.50$).
- **SciPy Golden Reference Dataset Benchmarks (`packages/core/test/scipy-golden-dataset.test.ts`)**:
  - Two-proportion pooled Z-test validated against `scipy.stats.proportions_ztest` (Z-scores, p-values, unpooled 95% confidence intervals).
  - Validated against gold-standard null cases ($Z = 0.0000, p = 1.0000$) and unequal sample sizes ($N_1 = 8000, N_2 = 2000$).
- **Fisher's Exact Test & Agresti-Caffo Small-Sample Engine**:
  - Validated exact hypergeometric distribution calculations against `scipy.stats.fisher_exact` across 2x2 contingency matrices (including Lady Tasting Tea and extreme separation cases).
  - Enforced small-sample fallback when conversion count $< 5$, clamping confidence intervals strictly within $[-1.0, 1.0]$.


