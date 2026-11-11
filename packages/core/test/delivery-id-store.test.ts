import { describe, it, expect } from "vitest";
import { DeliveryIdStore } from "../src/delivery-id-store.js";
import { MemoryStateStore } from "../src/state-store.js";

describe("DeliveryIdStore (Webhook Deduplication)", () => {
  it("claims a unique delivery ID on first receipt and rejects duplicate attempts", async () => {
    const memoryStore = new MemoryStateStore();
    const deliveryStore = new DeliveryIdStore(memoryStore, 3600);

    const deliveryId = "del_01HXYZ789TEST";

    // First receipt: claim succeeds
    const firstClaim = await deliveryStore.claimDeliveryId(deliveryId, "shopify_webhook");
    expect(firstClaim).toBe(true);

    // Second receipt: claim rejected as duplicate
    const secondClaim = await deliveryStore.claimDeliveryId(deliveryId, "shopify_webhook");
    expect(secondClaim).toBe(false);

    // Check duplicate status directly
    expect(await deliveryStore.isDuplicate(deliveryId)).toBe(true);
    expect(await deliveryStore.isDuplicate("different_id")).toBe(false);
  });

  it("handles malformed or empty delivery IDs safely", async () => {
    const deliveryStore = new DeliveryIdStore(new MemoryStateStore());

    expect(await deliveryStore.claimDeliveryId("")).toBe(false);
    expect(await deliveryStore.claimDeliveryId("   ")).toBe(false);
    expect(await deliveryStore.isDuplicate("")).toBe(true); // Fails closed
  });

  it("allows re-claiming after TTL has expired", async () => {
    const memoryStore = new MemoryStateStore();
    // 0.05 second TTL
    const deliveryStore = new DeliveryIdStore(memoryStore, 0.05);

    const deliveryId = "del_short_lived_123";
    expect(await deliveryStore.claimDeliveryId(deliveryId)).toBe(true);
    expect(await deliveryStore.isDuplicate(deliveryId)).toBe(true);

    // Wait 70ms for TTL expiration
    await new Promise((resolve) => setTimeout(resolve, 70));

    // Now it has expired, so it can be claimed again
    expect(await deliveryStore.isDuplicate(deliveryId)).toBe(false);
    expect(await deliveryStore.claimDeliveryId(deliveryId)).toBe(true);
  });
});
