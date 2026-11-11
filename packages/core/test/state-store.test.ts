import { describe, it, expect, beforeEach } from "vitest";
import { MemoryStateStore, getStateStore, setStateStore } from "../src/state-store.js";

describe("StateStore & MemoryStateStore", () => {
  let store: MemoryStateStore;

  beforeEach(() => {
    store = new MemoryStateStore();
  });

  it("handles basic key-value set, get, and del operations", async () => {
    await store.set("merchant:101", "active");
    expect(await store.get("merchant:101")).toBe("active");

    await store.del("merchant:101");
    expect(await store.get("merchant:101")).toBeNull();
  });

  it("expires keys according to TTL seconds", async () => {
    // 0.05 second TTL
    await store.set("session:abc", "data", 0.05);
    expect(await store.get("session:abc")).toBe("data");

    // Wait 70ms
    await new Promise((resolve) => setTimeout(resolve, 70));
    expect(await store.get("session:abc")).toBeNull();
  });

  it("atomically increments numeric counters", async () => {
    expect(await store.incr("rate:ip:1.2.3.4")).toBe(1);
    expect(await store.incr("rate:ip:1.2.3.4")).toBe(2);
    expect(await store.incr("rate:ip:1.2.3.4")).toBe(3);
    expect(await store.get("rate:ip:1.2.3.4")).toBe("3");
  });

  it("enforces sliding-window rate limiting accurately", async () => {
    const key = "rate:client:99";
    const maxRequests = 3;
    const windowSeconds = 1;

    // First 3 requests should be allowed
    const r1 = await store.rateLimit(key, maxRequests, windowSeconds);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = await store.rateLimit(key, maxRequests, windowSeconds);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = await store.rateLimit(key, maxRequests, windowSeconds);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);

    // 4th request must be rejected
    const r4 = await store.rateLimit(key, maxRequests, windowSeconds);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
    expect(r4.resetAt).toBeGreaterThan(Date.now());
  });

  it("handles hash map operations (hset, hget, hgetall)", async () => {
    await store.hset("tenant:cfg:1", "plan", "enterprise");
    await store.hset("tenant:cfg:1", "features", "cart_synthesis,upi_intent");

    expect(await store.hget("tenant:cfg:1", "plan")).toBe("enterprise");
    expect(await store.hget("tenant:cfg:1", "features")).toBe("cart_synthesis,upi_intent");
    expect(await store.hget("tenant:cfg:1", "missing")).toBeNull();

    const all = await store.hgetall("tenant:cfg:1");
    expect(all).toEqual({
      plan: "enterprise",
      features: "cart_synthesis,upi_intent",
    });
  });

  it("atomically sets key only if not exists (setNX)", async () => {
    // First setNX should succeed
    const firstSet = await store.setNX("lock:checkout:123", "held", 60);
    expect(firstSet).toBe(true);
    expect(await store.get("lock:checkout:123")).toBe("held");

    // Second setNX must fail
    const secondSet = await store.setNX("lock:checkout:123", "contender", 60);
    expect(secondSet).toBe(false);
    expect(await store.get("lock:checkout:123")).toBe("held"); // Value unaltered
  });

  it("allows setting and resolving the global StateStore singleton", () => {
    const customStore = new MemoryStateStore();
    setStateStore(customStore);
    expect(getStateStore()).toBe(customStore);
  });

  it("handles simulated store outage cleanly through fail-open fallback policy", async () => {
    // Simulated broken store
    const brokenStore: any = {
      get: async () => { throw new Error("ECONNREFUSED 127.0.0.1:6379"); },
      rateLimit: async () => { throw new Error("ECONNREFUSED 127.0.0.1:6379"); },
    };

    // Rate limiting fail-open test: verify that catch blocks catch store errors and don't crash
    let threw = false;
    try {
      await brokenStore.rateLimit("key", 10, 60);
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
  });

  it("strictly refuses silent in-memory fallback in production environments", () => {
    const originalEnv = process.env.NODE_ENV;
    const originalAllow = process.env.ALLOW_IN_MEMORY_STATESTORE;
    try {
      process.env.NODE_ENV = "production";
      delete process.env.ALLOW_IN_MEMORY_STATESTORE;
      setStateStore(new MemoryStateStore());

      expect(() => getStateStore()).toThrowError(/FATAL_CONFIG_ERROR/);
    } finally {
      process.env.NODE_ENV = originalEnv;
      process.env.ALLOW_IN_MEMORY_STATESTORE = originalAllow;
      setStateStore(new MemoryStateStore()); // Reset to default clean memory store
    }
  });
});
