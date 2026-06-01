import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

export function getIp(request: Request | NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous"
  );
}

/** Simple in-memory sliding-window fallback when Upstash isn't configured. */
function createMemoryLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();

  return {
    async limit(identifier: string) {
      const now = Date.now();
      const timestamps = (hits.get(identifier) ?? []).filter(
        (t) => now - t < windowMs
      );
      timestamps.push(now);
      hits.set(identifier, timestamps);
      return { success: timestamps.length <= max };
    },
  };
}

function checkUpstashConfigured(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return !!(
    url &&
    token &&
    !url.includes("your-upstash") &&
    !token.includes("your-upstash")
  );
}

const upstashConfigured = checkUpstashConfigured();

if (!upstashConfigured) {
  console.warn(
    "[rate-limit] Upstash not configured — using in-memory fallback"
  );
}

function createUpstashLimiter(
  max: number,
  window: `${number} ${"s" | "m" | "h" | "d"}`,
  prefix: string
) {
  const redis = Redis.fromEnv();
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(max, window), prefix });
}

export const loginLimiter = upstashConfigured
  ? createUpstashLimiter(5, "10 m", "ratelimit:login")
  : createMemoryLimiter(5, 10 * 60 * 1000);

export const forgotPasswordLimiter = upstashConfigured
  ? createUpstashLimiter(3, "10 m", "ratelimit:forgot-password")
  : createMemoryLimiter(3, 10 * 60 * 1000);
