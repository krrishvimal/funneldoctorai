import { describe, it, expect } from "vitest";
import { getShopifyApiVersion, getShopifyDraftOrdersEndpoint, isShopifyApiVersionExpiring } from "../src/shopify-config.js";

describe("Shopify API Versioning & Deprecation Guard", () => {
  it("resolves default active version as 2026-10 or configured environment", () => {
    const version = getShopifyApiVersion();
    expect(version).toMatch(/^\d{4}-\d{2}$/);
  });

  it("constructs Draft Orders endpoint dynamically without hardcoding", () => {
    const url = getShopifyDraftOrdersEndpoint("demo-store.myshopify.com", "2026-10");
    expect(url).toBe("https://demo-store.myshopify.com/admin/api/2026-10/draft_orders.json");
  });

  it("flags aged API versions (>300 days old) with warning", () => {
    const result = isShopifyApiVersionExpiring("2024-01");
    expect(result.isExpiring).toBe(true);
    expect(result.warning).toContain("approaching or past retirement");
  });

  it("passes current recent API versions without warning", () => {
    const result = isShopifyApiVersionExpiring("2026-10");
    expect(result.isExpiring).toBe(false);
  });
});
