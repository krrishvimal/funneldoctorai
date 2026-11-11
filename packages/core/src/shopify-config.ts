/**
 * @file shopify-config.ts
 * @description Centralized, configurable Shopify API versioning and deprecation warning service.
 * Shopify releases API versions quarterly (YYYY-MM) and retires each version after 12 months.
 */

export const DEFAULT_SHOPIFY_API_VERSION = "2026-10";

/**
 * Resolves current active Shopify API version from environment or default.
 */
export function getShopifyApiVersion(): string {
  if (typeof process !== "undefined" && process.env && process.env.SHOPIFY_API_VERSION) {
    return process.env.SHOPIFY_API_VERSION;
  }
  return DEFAULT_SHOPIFY_API_VERSION;
}

/**
 * Constructs official Shopify Admin Draft Orders endpoint URL.
 */
export function getShopifyDraftOrdersEndpoint(storeDomain: string, version: string = getShopifyApiVersion()): string {
  const cleanDomain = storeDomain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  return `https://${cleanDomain}/admin/api/${version}/draft_orders.json`;
}

/**
 * Checks whether the configured Shopify API version is nearing deprecation (>300 days old).
 */
export function isShopifyApiVersionExpiring(versionStr: string = getShopifyApiVersion()): {
  isExpiring: boolean;
  ageDays: number;
  warning?: string;
} {
  const match = versionStr.match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    return { isExpiring: false, ageDays: 0 };
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const releaseDate = new Date(year, month - 1, 1).getTime();
  const now = Date.now();
  const ageDays = Math.floor((now - releaseDate) / (1000 * 60 * 60 * 24));

  if (ageDays > 300) {
    return {
      isExpiring: true,
      ageDays,
      warning: `Shopify API version ${versionStr} is ${ageDays} days old and approaching or past retirement. Update SHOPIFY_API_VERSION.`,
    };
  }

  return { isExpiring: false, ageDays };
}
