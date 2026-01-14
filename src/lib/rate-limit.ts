/**
 * Rate Limiting Service using Upstash Redis
 *
 * En production: Utilise Redis pour un rate limiting distribué et persistant
 * En développement: Fallback vers une Map en mémoire si Redis n'est pas configuré
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Configuration des différents limiteurs
export const RATE_LIMITS = {
  // AI Chat: 20 requêtes par heure par utilisateur
  AI_CHAT: {
    requests: 20,
    window: "1 h" as const,
    prefix: "ratelimit:ai-chat",
  },
  // API générale: 100 requêtes par minute par IP
  API_GENERAL: {
    requests: 100,
    window: "1 m" as const,
    prefix: "ratelimit:api",
  },
  // Auth: 5 requêtes par minute (protection brute force)
  AUTH: {
    requests: 5,
    window: "1 m" as const,
    prefix: "ratelimit:auth",
  },
  // Quiz génération: 10 par heure
  QUIZ_GENERATION: {
    requests: 10,
    window: "1 h" as const,
    prefix: "ratelimit:quiz-gen",
  },
  // Exercices génération: 20 par heure
  EXERCISE_GENERATION: {
    requests: 20,
    window: "1 h" as const,
    prefix: "ratelimit:exercise-gen",
  },
} as const;

type RateLimitType = keyof typeof RATE_LIMITS;

// Fallback en mémoire pour le développement
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function createMemoryRateLimiter(config: (typeof RATE_LIMITS)[RateLimitType]): (
  identifier: string,
) => Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  // Parse window string to ms
  const windowMs = parseWindow(config.window);

  return async (identifier: string) => {
    const key = `${config.prefix}:${identifier}`;
    const now = Date.now();
    const stored = memoryStore.get(key);

    if (!stored || now > stored.resetAt) {
      memoryStore.set(key, { count: 1, resetAt: now + windowMs });
      return {
        success: true,
        limit: config.requests,
        remaining: config.requests - 1,
        reset: now + windowMs,
      };
    }

    if (stored.count >= config.requests) {
      return {
        success: false,
        limit: config.requests,
        remaining: 0,
        reset: stored.resetAt,
      };
    }

    stored.count++;
    return {
      success: true,
      limit: config.requests,
      remaining: config.requests - stored.count,
      reset: stored.resetAt,
    };
  };
}

function parseWindow(window: string): number {
  const match = window.match(/^(\d+)\s*(s|m|h|d)$/);
  if (!match) return 60000; // Default 1 minute

  const [, value, unit] = match;
  const num = parseInt(value, 10);

  switch (unit) {
    case "s":
      return num * 1000;
    case "m":
      return num * 60 * 1000;
    case "h":
      return num * 60 * 60 * 1000;
    case "d":
      return num * 24 * 60 * 60 * 1000;
    default:
      return 60000;
  }
}

// Check if Redis is configured
function isRedisConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

// Create Redis client (lazy initialization)
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (!isRedisConfigured()) {
    return null;
  }

  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  return redisClient;
}

// Cache des rate limiters
const rateLimiters = new Map<
  RateLimitType,
  Ratelimit | ReturnType<typeof createMemoryRateLimiter>
>();

/**
 * Get or create a rate limiter for the specified type
 */
function getRateLimiter(
  type: RateLimitType,
): Ratelimit | ReturnType<typeof createMemoryRateLimiter> {
  if (rateLimiters.has(type)) {
    return rateLimiters.get(type)!;
  }

  const config = RATE_LIMITS[type];
  const redis = getRedisClient();

  if (redis) {
    // Production: Use Redis
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.requests, config.window),
      prefix: config.prefix,
      analytics: true,
    });
    rateLimiters.set(type, limiter);
    return limiter;
  } else {
    // Development: Use memory fallback
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[Rate Limit] Redis non configuré, utilisation du fallback mémoire pour ${type}`,
      );
    }
    const limiter = createMemoryRateLimiter(config);
    rateLimiters.set(type, limiter);
    return limiter;
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Check rate limit for a specific identifier and type
 *
 * @param identifier - User ID, IP address, or other unique identifier
 * @param type - Type of rate limit to check
 * @returns Rate limit result with success status and metadata
 */
export async function checkRateLimit(
  identifier: string,
  type: RateLimitType,
): Promise<RateLimitResult> {
  const limiter = getRateLimiter(type);

  try {
    const result =
      limiter instanceof Ratelimit
        ? await limiter.limit(identifier)
        : await limiter(identifier);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: result.success
        ? undefined
        : Math.ceil((result.reset - Date.now()) / 1000),
    };
  } catch (error) {
    // En cas d'erreur Redis, permettre la requête (fail-open)
    console.error(`[Rate Limit] Error checking ${type}:`, error);
    return {
      success: true,
      limit: RATE_LIMITS[type].requests,
      remaining: RATE_LIMITS[type].requests - 1,
      reset: Date.now() + parseWindow(RATE_LIMITS[type].window),
    };
  }
}

/**
 * Helper to create rate limit headers for responses
 */
export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  const headers: HeadersInit = {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };

  if (result.retryAfter) {
    headers["Retry-After"] = result.retryAfter.toString();
  }

  return headers;
}

/**
 * Check if running in production with Redis
 */
export function isUsingRedis(): boolean {
  return isRedisConfigured();
}
