/**
 * @file delivery-id-store.ts
 * @description Webhook Delivery ID Deduplication Store for FunnelDoctor AI.
 * 
 * Prevents webhook replay attacks and duplicate processing by persisting
 * unique delivery IDs (such as X-FunnelDoctor-Delivery-Id or Shopify X-Shopify-Webhook-Id)
 * with a configurable TTL (default: 24 hours / 86400 seconds) using the StateStore abstraction.
 */

import { getStateStore, StateStore } from "./state-store.js";

export interface DeliveryIdRecord {
  deliveryId: string;
  source: string;
  recordedAt: number;
}

export class DeliveryIdStore {
  private store: StateStore;
  private prefix = "fd:delivery:";
  private defaultTtlSeconds = 86400; // 24 hours

  constructor(customStore?: StateStore, ttlSeconds?: number) {
    this.store = customStore || getStateStore();
    if (ttlSeconds) {
      this.defaultTtlSeconds = ttlSeconds;
    }
  }

  /**
   * Attempts to claim a delivery ID.
   * Returns true if successfully claimed (first time seen, not a duplicate).
   * Returns false if already recorded within the TTL (duplicate/replay).
   */
  public async claimDeliveryId(deliveryId: string, source = "generic"): Promise<boolean> {
    if (!deliveryId || typeof deliveryId !== "string" || !deliveryId.trim()) {
      return false;
    }

    const cleanId = deliveryId.trim();
    const key = `${this.prefix}${cleanId}`;

    const existing = await this.store.get(key);
    if (existing !== null) {
      return false; // Duplicate delivery ID detected
    }

    const record: DeliveryIdRecord = {
      deliveryId: cleanId,
      source,
      recordedAt: Date.now(),
    };

    await this.store.set(key, JSON.stringify(record), this.defaultTtlSeconds);
    return true; // Successfully recorded
  }

  /**
   * Checks if a delivery ID has already been recorded without claiming it.
   */
  public async isDuplicate(deliveryId: string): Promise<boolean> {
    if (!deliveryId || typeof deliveryId !== "string" || !deliveryId.trim()) {
      return true; // Malformed ID fails closed
    }

    const cleanId = deliveryId.trim();
    const key = `${this.prefix}${cleanId}`;
    const existing = await this.store.get(key);
    return existing !== null;
  }
}

export const deliveryIdStore = new DeliveryIdStore();
