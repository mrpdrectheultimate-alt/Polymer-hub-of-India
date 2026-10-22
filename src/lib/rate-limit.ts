/**
 * In-memory sliding-window rate limiter for Next.js App Router API routes.
 * Supports configurable window duration, request limits, and automatic entry pruning.
 */

interface RateLimitRecord {
  timestamps: number[]
}

const rateLimitStore = new Map<string, RateLimitRecord>()

// Clean up stale entries every 5 minutes to prevent memory leaks
const PRUNE_INTERVAL_MS = 5 * 60 * 1000
let lastPruned = Date.now()

function pruneStore(windowMs: number) {
  const now = Date.now()
  if (now - lastPruned < PRUNE_INTERVAL_MS) return
  lastPruned = now

  for (const [key, record] of rateLimitStore.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs)
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(key)
    } else {
      rateLimitStore.set(key, { timestamps: validTimestamps })
    }
  }
}

export interface RateLimitOptions {
  /**
   * Maximum allowed requests within the time window. Default: 10
   */
  limit?: number
  /**
   * Time window in milliseconds. Default: 60,000 (1 minute)
   */
  windowMs?: number
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Checks if a given identifier (e.g. IP or user ID) is within rate limits.
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit ?? 10
  const windowMs = options.windowMs ?? 60 * 1000
  const now = Date.now()

  pruneStore(windowMs)

  const record = rateLimitStore.get(key) || { timestamps: [] }
  const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs)

  if (validTimestamps.length >= limit) {
    const oldestTimestamp = validTimestamps[0]
    const reset = oldestTimestamp + windowMs

    return {
      success: false,
      limit,
      remaining: 0,
      reset,
    }
  }

  validTimestamps.push(now)
  rateLimitStore.set(key, { timestamps: validTimestamps })

  return {
    success: true,
    limit,
    remaining: limit - validTimestamps.length,
    reset: now + windowMs,
  }
}

/**
 * Extracts client IP address safely from standard proxy headers.
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Return first IP if comma-separated list
    const firstIp = forwardedFor.split(',')[0].trim()
    if (firstIp) return firstIp
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  const cfConnectingIp = req.headers.get('cf-connecting-ip')
  if (cfConnectingIp) return cfConnectingIp.trim()

  return '127.0.0.1'
}
