# FunnelDoctor AI: Subresource Integrity (SRI) & Script Versioning Policy

## 1. Core Principle: Permanent Immutability
All client-side JavaScript assets published under semantic version directories (e.g., `apps/web/public/v1.0.3/`, `apps/web/public/v1.0.4/`) are **strictly immutable**. 
- Once a bundle is released and its SHA-384 SRI hash is recorded in `scripts/sri-manifest.json`, the underlying files (`funneldoctor.global.js`) must **NEVER** be modified in place.
- Any attempt to overwrite or mutate a published bundle in a git commit or CI pipeline is blocked by `scripts/check-sri-immutability.mjs`.

## 2. Release & Versioning Lifecycle
When bug fixes, feature enhancements, or telemetry changes are implemented:
1. **Semantic Version Bump**: Build outputs are generated into a new semantic directory path (e.g., `apps/web/public/v1.0.5/funneldoctor.global.js`).
2. **SRI Hash Generation**: The new bundle's SHA-384 hash is calculated:
   ```bash
   openssl dgst -sha384 -binary dist/funneldoctor.global.js | openssl base64 -A
   ```
3. **Manifest Entry**: The new version is registered in `scripts/sri-manifest.json` as `current_stable`.
4. **Previous Versions**: The previous version is marked as `deprecated`, but remains served indefinitely to avoid breaking merchant storefronts with pinned script tags.

## 3. Deprecation & Sunset Policy
- **Minimum Deprecation Grace Period**: 90 days.
- During the grace period:
  - Both `deprecated` and `current_stable` scripts are served via HTTP CDN with immutable caching headers (`Cache-Control: public, max-age=31536000, immutable`).
  - Merchants using deprecated script tags receive non-breaking notifications in their dashboard and via automated health checks.
  - Deprecated bundles continue to verify against their published SRI hashes.
- **Sunset Procedure**: A bundle is only sunset after active merchant migration is confirmed. Under no circumstance will a script tag fail closed due to hash tampering.

## 4. Current Version Directory Manifest
| Version | Status | Published Date | SHA-384 Integrity Hash |
| :--- | :--- | :--- | :--- |
| `v1.0.3` | **Deprecated** (Grace Period Active) | 2026-11-10 | `sha384-xcpt/f62Rzx7mkV4eEPyWsmt6dQ0fkcdTplK2spcWno7/90v0WnlSU3ZwCQ6Happ` |
| `v1.0.4` | **Current Stable** | 2026-11-11 | `sha384-xsi1CrDRxInIfUNB3NbLKxS+UP6YULzNNRaVehyj+TNEKR00E6p78hYQmLLGO1KC` |

## 5. Merchant Integration Tag Standard
```html
<!-- FunnelDoctor AI Telemetry Tag (v1.0.4) -->
<script
  src="https://cdn.funneldoctor.ai/v1.0.4/funneldoctor.global.js"
  integrity="sha384-xsi1CrDRxInIfUNB3NbLKxS+UP6YULzNNRaVehyj+TNEKR00E6p78hYQmLLGO1KC"
  crossorigin="anonymous"
  async
></script>
```
