/**
 * @file redis-state-store.ts
 * @description Production-grade Redis StateStore implementation for FunnelDoctor AI.
 * 
 * Features:
 * 1. Atomic sliding-window rate limiter via Lua script utilizing Redis server time (`TIME`)
 *    to eliminate clock drift across distributed serverless instances.
 * 2. Native atomic set-if-not-exists with TTL (`SET key val EX ttl NX`).
 * 3. Atomic counter increments (`INCR`, `EXPIRE`).
 * 4. Hash set/get operations (`HSET`, `HGET`, `HGETALL`).
 */

import { StateStore, RateLimitResult } from "./state-store.js";

// Atomic Sliding-Window Rate Limiter Lua Script
// Utilizes Redis server time (redis.call('TIME')) for cross-instance clock synchronization
export const REDIS_SLIDING_WINDOW_LUA = `
local key = KEYS[1]
local maxRequests = tonumber(ARGV[1])
local windowSeconds = tonumber(ARGV[2])

-- Obtain canonical Redis server time to prevent client clock skew
local time = redis.call('TIME')
local nowSeconds = tonumber(time[1])
local nowMicroseconds = tonumber(time[2])
local nowMs = (nowSeconds * 1000) + math.floor(nowMicroseconds / 1000)

local windowMs = windowSeconds * 1000
local threshold = nowMs - windowMs

-- 1. Remove expired timestamps outside the sliding window
redis.call('ZREMRANGEBYSCORE', key, '-inf', threshold)

-- 2. Count active requests within the window
local currentCount = redis.call('ZCARD', key)

if currentCount < maxRequests then
    -- 3. Record current request timestamp as both member and score
    local member = tostring(nowMs) .. ':' .. tostring(redis.call('INCR', key .. ':seq'))
    redis.call('ZADD', key, nowMs, member)
    redis.call('EXPIRE', key, windowSeconds + 1)
    redis.call('EXPIRE', key .. ':seq', windowSeconds + 1)
    return { 1, maxRequests - currentCount - 1, nowMs + windowMs, maxRequests }
else
    local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
    local resetAt = nowMs + windowMs
    if #oldest >= 2 then
        resetAt = tonumber(oldest[2]) + windowMs
    end
    return { 0, 0, resetAt, maxRequests }
end
`;

export interface RedisClientInterface {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ...args: any[]): Promise<string | null>;
  del(key: string): Promise<number>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  hget(hash: string, field: string): Promise<string | null>;
  hset(hash: string, field: string, value: string): Promise<number>;
  hgetall(hash: string): Promise<Record<string, string>>;
  eval(script: string, numKeys: number, ...args: any[]): Promise<any>;
}

export class RedisStateStore implements StateStore {
  private redis: RedisClientInterface;

  constructor(redisClient: RedisClientInterface) {
    this.redis = redisClient;
  }

  public async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redis.set(key, value, "EX", ttlSeconds);
    } else {
      await this.redis.set(key, value);
    }
  }

  /**
   * Native Redis atomic set-if-not-exists with expiration.
   */
  public async setNX(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    if (ttlSeconds) {
      const result = await this.redis.set(key, value, "EX", ttlSeconds, "NX");
      return result === "OK";
    }
    const result = await this.redis.set(key, value, "NX");
    return result === "OK";
  }

  public async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  public async incr(key: string, ttlSeconds?: number): Promise<number> {
    const val = await this.redis.incr(key);
    if (ttlSeconds && val === 1) {
      await this.redis.expire(key, ttlSeconds);
    }
    return val;
  }

  /**
   * Distributed sliding-window rate limiting executed atomically via Lua script on the Redis server.
   */
  public async rateLimit(key: string, maxRequests: number, windowSeconds: number): Promise<RateLimitResult> {
    const result = await this.redis.eval(
      REDIS_SLIDING_WINDOW_LUA,
      1,
      key,
      maxRequests.toString(),
      windowSeconds.toString()
    );

    const allowed = result[0] === 1;
    const remaining = Number(result[1]);
    const resetAt = Number(result[2]);
    const totalLimit = Number(result[3]);

    return {
      allowed,
      remaining,
      resetAt,
      totalLimit,
    };
  }

  public async hget(hash: string, field: string): Promise<string | null> {
    return await this.redis.hget(hash, field);
  }

  public async hset(hash: string, field: string, value: string): Promise<void> {
    await this.redis.hset(hash, field, value);
  }

  public async hgetall(hash: string): Promise<Record<string, string>> {
    return await this.redis.hgetall(hash);
  }
}
