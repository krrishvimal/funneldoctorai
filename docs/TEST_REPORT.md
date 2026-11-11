# FunnelDoctor AI: Consolidated Test Verification Report

**Report Generated:** 2026-11-11T08:48:25.021Z
**Execution Time:** 18.50s
**Milestone Status:** Milestone 1: code complete, field verification pending.

## Summary

| Suite | Status | Tests Passed | Purpose |
| :--- | :--- | :--- | :--- |
| @funneldoctor/core (Vitest) | **PASS** | 55 | Stats engine, state store, tenant registry, delivery ID deduplication, heuristics, shopify config |
| @funneldoctor/tracker (Vitest) | **PASS** | 43 | PII scrub, Indian postal PIN allowlist, credential deny-first classifier, safe boot |
| SRI Immutability & Manifest Validator | **PASS** | 2 | Dynamic scan of public version directories (v1.0.3, v1.0.4) against sri-manifest.json |
| Enterprise SSRF, Pinning, Anti-Replay & Permalinks | **PASS** | 30 | Subnet filtering, port 443 governance, Happy Eyeballs agent, DNS rebinding, HMAC anti-replay |
| Phase 1 & 2: Headless DOM & PII Scrubbing Suite | **PASS** | 22 | Form fatigue, numeric keyboard checks, UPI intent detection, zero-knowledge PII scrubbing |
| Phase 3: Statistical Engine & Cohort Safeguards | **PASS** | 18 | Pooled Z, Agresti-Caffo small sample, SRM detection, Simpson's Paradox, FDR q-values |
| Phase 4 & 5: Multi-Stack Remediation & Incident Alerting | **PASS** | 19 | Liquid snippet synthesis, circuit breaker sub-50ms trip, Slack/Teams/PagerDuty dispatch |

**Total Tests Verified:** 189 passed, 0 failed

## Detailed Suite Breakdown

### @funneldoctor/core (Vitest)
*Status: PASS*

```
✓ test/stats-engine.test.ts (16 tests) 57ms
✓ test/shopify-config.test.ts (4 tests) 16ms
✓ test/funnel-parser.test.ts (3 tests) 13ms
✓ test/multi-stack-synthesizer.test.ts (1 test) 15ms
✓ test/crypto-vault.test.ts (2 tests) 22ms
✓ test/tenant-registry.test.ts (5 tests) 39ms
✓ test/delivery-id-store.test.ts (4 tests) 97ms
✓ test/experiment-runner.test.ts (3 tests) 30ms
✓ test/state-store.test.ts (8 tests) 106ms
✓ test/auditor.test.ts (1 test) 32ms
✓ test/dom-inspector.test.ts (3 tests) 31ms
✓ test/domain-auditor.test.ts (5 tests) 147ms
```

### @funneldoctor/tracker (Vitest)
*Status: PASS*

```
✓ test/resilience.test.ts (2 tests) 8ms
✓ test/pii-masker.test.ts (8 tests) 20ms
✓ test/field-allowlist.test.ts (33 tests) 20ms
```

### SRI Immutability & Manifest Validator
*Status: PASS*

```
✅ PASS: v1.0.3 [deprecated] verified immutable: sha384-xcpt/f62Rzx7mkV4eEPyWsmt6dQ0fkcdTplK2spcWno7/90v0WnlSU3ZwCQ6Happ
✅ PASS: v1.0.4 [current_stable] verified immutable: sha384-xsi1CrDRxInIfUNB3NbLKxS+UP6YULzNNRaVehyj+TNEKR00E6p78hYQmLLGO1KC
```

### Enterprise SSRF, Pinning, Anti-Replay & Permalinks
*Status: PASS*

```
✅ PASS [1]: Blocks 0.0.0.0/8 broadcast and current network space
✅ PASS [2]: Blocks 127.0.0.0/8 loopback subnet
✅ PASS [3]: Blocks AWS/GCP IMDS metadata service (169.254.169.254)
✅ PASS [4]: Blocks RFC 1918 Class A subnet (10.0.0.0/8)
✅ PASS [5]: Blocks RFC 1918 Class B subnet (172.16.0.0/12)
✅ PASS [6]: Blocks RFC 1918 Class C subnet (192.168.0.0/16)
✅ PASS [7]: Blocks RFC 6598 Carrier-Grade NAT (100.64.0.0/10)
✅ PASS [8]: Blocks RFC 2544 Benchmark testing subnet (198.18.0.0/15)
✅ PASS [9]: Blocks Multicast address space (224.0.0.0/4)
✅ PASS [10]: Blocks Reserved Class E address space (240.0.0.0/4)
✅ PASS [11]: Blocks IPv6 loopback and unspecified address (::1, ::/128)
✅ PASS [12]: Blocks IPv6 Link-Local range (fe80::/10)
✅ PASS [13]: Blocks IPv6 Unique Local address range (fc00::/7)
✅ PASS [14]: Blocks IPv4-Mapped IPv6 addresses (::ffff:0:0/96)
✅ PASS [15]: Blocks NAT64 IPv4/IPv6 translation prefix (64:ff9b::/96) targeting localhost
✅ PASS [16]: Blocks 6to4 tunneling (2002::/16) encapsulating loopback address
✅ PASS [17]: Allows HTTPS webhook on port 443
✅ PASS [18]: Prohibits cleartext HTTP port 80 webhooks to prevent data leakage
✅ PASS [19]: Prohibits arbitrary non-standard ports (e.g. 8080)
✅ PASS [20]: Lookup scalar signature: returns address string when options.all is unset
✅ PASS [21]: Lookup Happy Eyeballs signature: returns [{ address, family }] when options.all = true
✅ PASS [22]: Live Socket Pinning: Agent connects real socket to pinned IP while preserving Host header
✅ PASS [23]: Redirect Re-validation: Secondary DNS query returning 127.0.0.1 fails closed
✅ PASS [24]: HMAC Anti-Replay: Signs timestamp + deliveryId + rawBody with timing-safe comparison
✅ PASS [25]: Timing-Safe Length Guard: Explicit length check prevents RangeError crash on malformed signature
✅ PASS [26]: Per-Delivery Protection: Reject tampered or replayed delivery ID
✅ PASS [27]: Single Trusted Header: Binds strictly to configured hosting platform IP header
✅ PASS [28]: Dynamic Cart Permalinks: Reconstructs all line items and quantities into permalink slug (/cart/id:qty,id:qty?checkout)
✅ PASS [29]: Intent Fallback: Android Chrome intent includes S.browser_fallback_url= to handle non-Chrome devices
✅ PASS [30]: Crawler SSRF Defense: Prohibits non-HTTP schemes (file:, chrome:, data:) and blocks internal subnets
```

### Phase 1 & 2: Headless DOM & PII Scrubbing Suite
*Status: PASS*

```
✅ PASS [1]: Form Fatigue: Detects excessive input fields (>6 fields)
✅ PASS [2]: Phone Keyboard Check: Flags missing numeric keypad (forces QWERTY)
✅ PASS [3]: UPI Friction Check: Flags manual VPA typing requirement (Missing 1-Tap UPI Intent)
✅ PASS [4]: Shipping Transparency Check: Flags hidden delivery fee surcharge
✅ PASS [5]: Heuristic Risk Score: Calculates high mobile churn risk score
✅ PASS [6]: Streamlined Form: Recognizes 4-field mobile-first checkout
✅ PASS [7]: Mobile Phone Input: Confirms native numeric keypad enabled
✅ PASS [8]: 1-Tap UPI Intent: Confirms GPay/PhonePe deep-link buttons detected
✅ PASS [9]: Sticky Mobile CTA: Confirms 'Buy Now' button stays fixed on scroll
✅ PASS [10]: Optimized Risk Score: Confirms low friction score for streamlined store
✅ PASS [11]: Domain Auditor: Successfully generated complete audit payload
✅ PASS [12]: Domain Auditor: Output contains live domInspection metrics and riskScore
✅ PASS [13]: Standalone Tracker Bundle: funneldoctor.js exists in apps/web/public
✅ PASS [14]: PII Scrub: Email is cryptographic masked before dispatch
✅ PASS [15]: PII Scrub: Phone number is masked (zero phone numbers leaked)
✅ PASS [16]: PII Scrub: Indian UPI VPA is masked correctly
✅ PASS [17]: PII Scrub: Card numbers scrubbed to PCI-DSS compliant last 4 digits
✅ PASS [18]: PII Scrub: Aadhaar numbers scrubbed to last 4 digits
✅ PASS [19]: PII Scrub: Passwords and CVVs are completely [REDACTED]
✅ PASS [20]: Deep Recursive Scrub: Telemetry metadata string attributes are also scrubbed
✅ PASS [21]: Telemetry Aggregation: Correct average dwell time calculated
✅ PASS [22]: Telemetry Aggregation: Rage click frequency correctly counted
```

### Phase 3: Statistical Engine & Cohort Safeguards
*Status: PASS*

```
✅ PASS [1]: Uses pooled Z-test for large sample sizes
✅ PASS [2]: Correctly determines high statistical significance (p < 0.001)
✅ PASS [3]: Unpooled 95% Confidence Interval is strictly positive for true lift
✅ PASS [4]: Plain English verdict follows Grade 6-8 standard without frequentist fallacies
✅ PASS [5]: Automatically switches to Agresti-Caffo adjustment for small sample sizes
✅ PASS [6]: Agresti-Caffo confidence interval remains strictly bounded within [-1, 1]
✅ PASS [7]: Honestly flags insufficient sample size to store owners
✅ PASS [8]: Benjamini-Hochberg processes all 6 cohort hypotheses
✅ PASS [9]: Adjusted FDR q-values are monotonically non-decreasing
✅ PASS [10]: Correctly discriminates verified friction cohorts from random variation
✅ PASS [11]: Calculates weekly revenue leakage (₹/week) per cohort
✅ PASS [12]: Identifies premature peeking bias and calculates exact remaining visitors needed
✅ PASS [13]: Accurately detects Android Instagram In-App WebView from user agent string
✅ PASS [14]: Accurately detects native iOS Safari browser
✅ PASS [15]: Correctly ranks recommendations in descending order of ICE score
✅ PASS [16]: Accurately detects Simpson's Paradox when aggregate reverses subgroup trends
✅ PASS [17]: Data Quality: Filters crawler bots and deduplicates rapid burst beacons
✅ PASS [18]: Full Domain Auditor generates complete statistical breakdown with root causes & COD RTO
```

### Phase 4 & 5: Multi-Stack Remediation & Incident Alerting
*Status: PASS*

```
✅ PASS [1]: Synthesizes React/Next.js/Tailwind Component with 1-Tap UPI Intent
✅ PASS [2]: Synthesizes Shopify Liquid Snippet with numeric divided_by: 100.0 (Bug #1 Fix)
✅ PASS [3]: Includes Snippet Placement Guide (Cart Drawer / Theme sections vs Plus Checkout)
✅ PASS [4]: Generates concrete canary A/B experiment protocol with N>=250 and differential error limits
✅ PASS [5]: Deterministic sticky visitor routing (Identical session gets identical variant)
✅ PASS [6]: Maintains HEALTHY state under normal operational telemetry
✅ PASS [7]: Automated Circuit Breaker: Instantly trips when error rate breaches 0.5%
✅ PASS [8]: Automated Circuit Breaker: Instantly forces 100% of traffic back to Control
✅ PASS [9]: Rollback Execution Latency: Sub-50 millisecond instantaneous automated rollback
✅ PASS [10]: Enterprise Alerting API endpoint exists at apps/web/src/app/api/alerts/route.ts
✅ PASS [11]: Alerting endpoint implements multi-platform dispatch (Slack, Teams, PagerDuty)
✅ PASS [12]: Alerting endpoint handles critical incident severity levels
✅ PASS [13]: SSRF Defense & HMAC-SHA256 Request Signing: Blocks Cloud IMDS, Localhost, Private Subnets
✅ PASS [14]: PagerDuty P1 Restriction & 15-Minute Alert Debouncing
✅ PASS [15]: Generates Boardroom Executive CRO Audit Document
✅ PASS [16]: Calculates Annualized Financial Exposure as Range (40x - 56x) with Festive Seasonality
✅ PASS [17]: Presents Honest Projected ROI Range (Eliminating single-point 24.8x claims)
✅ PASS [18]: Diagnostic Statistical Audit Summary: FDR Monotonic q-values & Indian COD Netting
✅ PASS [19]: Softened Privacy & Compliance: Data minimization disclosure with legal disclaimer
```

