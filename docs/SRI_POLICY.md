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

## 3. Deprecation & Permanent Availability Policy
- **Permanent Hosting**: Published version bundles (`v1.0.3`, `v1.0.4`, etc.) are **NEVER deleted or removed from the CDN**. Storefronts with pinned SRI tags will never break due to 404s.
- **Meaning of Deprecation**:
  - The version is marked as `"deprecated"` in `scripts/sri-manifest.json`.
  - The merchant dashboard displays a non-blocking upgrade recommendation, showing which bundle version their site is reporting.
  - No new feature enhancements are backported to deprecated bundles.
  - Both deprecated and stable files continue to be served with immutable CDN caching headers (`Cache-Control: public, max-age=31536000, immutable`).
- **Zero Storefront Disruption**: Even after a major release, legacy versions remain accessible indefinitely with valid integrity hashes.

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
