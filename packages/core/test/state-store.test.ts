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

  it("allows setting and resolving the global StateStore singleton", () => {
    const customStore = new MemoryStateStore();
    setStateStore(customStore);
    expect(getStateStore()).toBe(customStore);
  });
});
