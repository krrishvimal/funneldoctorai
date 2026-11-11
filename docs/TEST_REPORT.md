# FunnelDoctor AI: Consolidated Test Verification Report

**Report Generated:** 2026-11-11T08:19:06.301Z
**Execution Time:** 12.49s
**Milestone Status:** Milestone 1: code complete, field verification pending.

## Summary

| Suite | Status | Tests Passed | Purpose |
| :--- | :--- | :--- | :--- |
| @funneldoctor/core (Vitest) | **PASS** | 49 | Stats engine, state store, tenant registry, delivery ID deduplication, heuristics, shopify config |
| @funneldoctor/tracker (Vitest) | **PASS** | 41 | PII scrub, Indian postal PIN allowlist, credential deny-first classifier, safe boot |
| SRI Immutability & Manifest Validator | **PASS** | 2 | Dynamic scan of public version directories (v1.0.3, v1.0.4) against sri-manifest.json |
| Enterprise SSRF, Pinning, Anti-Replay & Permalinks | **PASS** | 30 | Subnet filtering, port 443 governance, Happy Eyeballs agent, DNS rebinding, HMAC anti-replay |

**Total Tests Verified:** 122 passed, 0 failed

## Detailed Suite Breakdown

### @funneldoctor/core (Vitest)
*Status: PASS*

```
✓ test/tenant-registry.test.ts (4 tests) 22ms
✓ test/experiment-runner.test.ts (3 tests) 26ms
✓ test/stats-engine.test.ts (16 tests) 98ms
✓ test/multi-stack-synthesizer.test.ts (1 test) 15ms
✓ test/funnel-parser.test.ts (3 tests) 14ms
✓ test/shopify-config.test.ts (4 tests) 23ms
✓ test/state-store.test.ts (6 tests) 94ms
✓ test/delivery-id-store.test.ts (3 tests) 95ms
✓ test/auditor.test.ts (1 test) 83ms
✓ test/dom-inspector.test.ts (3 tests) 18ms
✓ test/domain-auditor.test.ts (5 tests) 113ms
```

### @funneldoctor/tracker (Vitest)
*Status: PASS*

```
✓ test/pii-masker.test.ts (8 tests) 11ms
✓ test/field-allowlist.test.ts (33 tests) 13ms
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

