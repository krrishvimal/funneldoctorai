/**
 * @file state-store.ts
 * @description Universal StateStore abstraction and implementations for FunnelDoctor AI.
 *
 * Implements:
 * 1. Universal StateStore interface for distributed rate limiting, session caching, and circuit-breaker flags.
 * 2. MemoryStateStore: In-memory sliding-window rate limiter and KV store with TTL (used in local dev and tests).
 * 3. Fallback policies:
 *    - Rate Limiting: Fails open on store disconnect (avoids dropping genuine merchant sales during infrastructure hiccups).
 *    - Kill Switch & Circuit Breaker: Fails closed to Control (protects merchants from unauthorized exposure).
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  totalLimit: number;
}

export interface StateStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  setNX(key: string, value: string, ttlSeconds?: number): Promise<boolean>;
  del(key: string): Promise<void>;
  incr(key: string, ttlSeconds?: number): Promise<number>;
  rateLimit(key: string, maxRequests: number, windowSeconds: number): Promise<RateLimitResult>;
  hget(hash: string, field: string): Promise<string | null>;
  hset(hash: string, field: string, value: string): Promise<void>;
  hgetall(hash: string): Promise<Record<string, string>>;
}

/**
 * In-Memory sliding-window StateStore with active TTL purging.
 */
export class MemoryStateStore implements StateStore {
  private kv = new Map<string, { value: string; expiresAt: number | null }>();
  private hashes = new Map<string, Map<string, string>>();
  private rateLimitWindows = new Map<string, number[]>(); // key -> array of timestamps

  public async get(key: string): Promise<string | null> {
    const entry = this.kv.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.kv.delete(key);
      return null;
    }
    return entry.value;
  }

  public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.kv.set(key, { value, expiresAt });
  }

  /**
   * Atomic set-if-not-exists (NX) with TTL.
   * Checks existence and sets synchronously within the same event tick to prevent async microtask interleaving.
   * Returns true if the key was set (did not exist or had expired).
   * Returns false if the key already exists and has not expired.
   */
  public async setNX(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    const now = Date.now();
    const entry = this.kv.get(key);
    if (entry && (!entry.expiresAt || now <= entry.expiresAt)) {
      return false; // Key already exists and has not expired
    }
    const expiresAt = ttlSeconds ? now + ttlSeconds * 1000 : null;
    this.kv.set(key, { value, expiresAt });
    return true;
  }

  public async del(key: string): Promise<void> {
    this.kv.delete(key);
    this.rateLimitWindows.delete(key);
  }

  public async incr(key: string, ttlSeconds?: number): Promise<number> {
    const current = await this.get(key);
    const count = (parseInt(current || "0", 10) || 0) + 1;
    await this.set(key, count.toString(), ttlSeconds);
    return count;
  }

  /**
   * Atomic sliding-window rate limiter.
   * Records timestamps of requests within windowSeconds and prunes timestamps outside the window.
   */
  public async rateLimit(key: string, maxRequests: number, windowSeconds: number): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const threshold = now - windowMs;

    let timestamps = this.rateLimitWindows.get(key) || [];
    // Prune timestamps older than the sliding window
    timestamps = timestamps.filter((t) => t > threshold);

    const allowed = timestamps.length < maxRequests;
    if (allowed) {
      timestamps.push(now);
    }

    this.rateLimitWindows.set(key, timestamps);

    const resetAt = (timestamps[0] || now) + windowMs;
    const remaining = Math.max(0, maxRequests - timestamps.length);

    return {
      allowed,
      remaining,
      resetAt,
      totalLimit: maxRequests,
    };
  }

  public async hget(hash: string, field: string): Promise<string | null> {
    const h = this.hashes.get(hash);
    if (!h) return null;
    return h.get(field) || null;
  }

  public async hset(hash: string, field: string, value: string): Promise<void> {
    let h = this.hashes.get(hash);
    if (!h) {
      h = new Map<string, string>();
      this.hashes.set(hash, h);
    }
    h.set(field, value);
  }

  public async hgetall(hash: string): Promise<Record<string, string>> {
    const h = this.hashes.get(hash);
    if (!h) return {};
    const obj: Record<string, string> = {};
    h.forEach((val, key) => {
      obj[key] = val;
    });
    return obj;
  }

  public clear(): void {
    this.kv.clear();
    this.hashes.clear();
    this.rateLimitWindows.clear();
  }
}

/**
 * Global singleton StateStore resolver.
 * Defaults to MemoryStateStore for local dev / test suites.
 * In production (NODE_ENV === "production"), strictly refuses silent fallback to memory
 * to prevent multi-instance / serverless state bifurcation unless explicitly bypassed.
 */
let activeStateStore: StateStore = new MemoryStateStore();

export function getStateStore(): StateStore {
  if (
    process.env.NODE_ENV === "production" &&
    activeStateStore instanceof MemoryStateStore &&
    process.env.ALLOW_IN_MEMORY_STATESTORE !== "true"
  ) {
    throw new Error(
      "FATAL_CONFIG_ERROR: Production environment requires a distributed StateStore (e.g. Redis). " +
      "Silent in-memory fallback on serverless instances is strictly prohibited. " +
      "Configure REDIS_URL or explicitly set ALLOW_IN_MEMORY_STATESTORE=true for single-instance staging."
    );
  }
  return activeStateStore;
}

export function setStateStore(store: StateStore): void {
  activeStateStore = store;
}
