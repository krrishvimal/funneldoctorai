import { describe, it, expect, vi } from "vitest";
import { RedisStateStore, RedisClientInterface } from "../src/redis-state-store.js";

describe("RedisStateStore (Production Distributed Store)", () => {
  it("interacts with Redis client using atomic commands", async () => {
    const mockStorage = new Map<string, string>();
    const mockClient: RedisClientInterface = {
      get: vi.fn(async (key: string) => mockStorage.get(key) || null),
      set: vi.fn(async (key: string, value: string, ...args: any[]) => {
        if (args.includes("NX") && mockStorage.has(key)) {
          return null;
        }
        mockStorage.set(key, value);
        return "OK";
      }),
      del: vi.fn(async (key: string) => {
        const existed = mockStorage.delete(key);
        return existed ? 1 : 0;
      }),
      incr: vi.fn(async (key: string) => {
        const val = (parseInt(mockStorage.get(key) || "0", 10) || 0) + 1;
        mockStorage.set(key, val.toString());
        return val;
      }),
      expire: vi.fn(async () => 1),
      hget: vi.fn(async () => null),
      hset: vi.fn(async () => 1),
      hgetall: vi.fn(async () => ({})),
      eval: vi.fn(async () => [1, 59, Date.now() + 60000, 60]), // Simulated Lua response
    };

    const redisStore = new RedisStateStore(mockClient);

    // Test set and get
    await redisStore.set("session:123", "active", 3600);
    expect(mockClient.set).toHaveBeenCalledWith("session:123", "active", "EX", 3600);

    // Test atomic setNX
    const firstSet = await redisStore.setNX("lock:pay", "token", 30);
    expect(firstSet).toBe(true);

    const secondSet = await redisStore.setNX("lock:pay", "different_token", 30);
    expect(secondSet).toBe(false);

    // Test atomic distributed rate limiting via Lua script
    const rateLimit = await redisStore.rateLimit("rate:ip:10.0.0.1", 60, 60);
    expect(rateLimit.allowed).toBe(true);
    expect(rateLimit.remaining).toBe(59);
    expect(mockClient.eval).toHaveBeenCalled();
  });
});
