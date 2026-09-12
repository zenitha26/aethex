/**
 * AETHEX Edge Sliding Window Log Rate Limiter
 * 
 * Implements Sliding Window Log algorithm via Upstash Redis REST API
 * with automatic high-performance in-memory fallback for local environments.
 * 
 * Mitigates credential stuffing, DDoS attacks, and expensive AI Vision Edge Function spam.
 */

interface RateLimitConfig {
  windowMs: number; // Duration in milliseconds
  maxRequests: number; // Maximum allowed requests within the window
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory sliding window log storage fallback (Map<Key, Array<Timestamp>>)
const inMemorySlidingLogs = new Map<string, number[]>();

/**
 * Executes a Sliding Window Log rate limit check for an IP or identifier.
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 20 }
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  const key = `aethex:ratelimit:${endpoint}:${identifier.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Production: Upstash Redis REST Pipeline (Edge runtime compatible)
  if (upstashUrl && upstashToken) {
    try {
      const response = await fetch(`${upstashUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          // Step 1: Remove timestamps outside the current sliding window
          ["ZREMRANGEBYSCORE", key, "0", String(windowStart)],
          // Step 2: Count requests remaining within the sliding window
          ["ZCARD", key],
          // Step 3: Add current request timestamp
          ["ZADD", key, String(now), `${now}:${Math.random().toString(36).slice(2, 7)}`],
          // Step 4: Set expiration for auto-cleanup
          ["EXPIRE", key, String(Math.ceil(config.windowMs / 1000) + 10)],
        ]),
      });

      if (response.ok) {
        const results = await response.json();
        // Index 1 contains ZCARD result (count before current addition)
        const requestCount = typeof results[1]?.result === "number" ? results[1].result : 0;

        if (requestCount >= config.maxRequests) {
          return {
            success: false,
            limit: config.maxRequests,
            remaining: 0,
            reset: now + config.windowMs,
          };
        }

        return {
          success: true,
          limit: config.maxRequests,
          remaining: Math.max(0, config.maxRequests - requestCount - 1),
          reset: now + config.windowMs,
        };
      }
    } catch (err) {
      console.warn("Upstash Redis connection notice (switching to in-memory sliding window):", err);
    }
  }

  // 2. Local Fallback: Precise In-Memory Sliding Window Log
  let timestamps = inMemorySlidingLogs.get(key) || [];
  
  // Prune expired entries outside current window
  timestamps = timestamps.filter((t) => t > windowStart);

  if (timestamps.length >= config.maxRequests) {
    inMemorySlidingLogs.set(key, timestamps);
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      reset: timestamps[0] + config.windowMs,
    };
  }

  timestamps.push(now);
  inMemorySlidingLogs.set(key, timestamps);

  // Periodic cleanup if map grows large
  if (inMemorySlidingLogs.size > 2000) {
    for (const [k, v] of inMemorySlidingLogs.entries()) {
      if (v.length === 0 || v[v.length - 1] < now - 120000) {
        inMemorySlidingLogs.delete(k);
      }
    }
  }

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - timestamps.length,
    reset: now + config.windowMs,
  };
}
