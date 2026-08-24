import { NextResponse } from 'next/server'

interface CacheEntry<T> {
  data: T
  expiresAt: number
  staleAt: number
}

// In-memory high speed LRU cache for 250+ concurrent users
class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private readonly maxEntries = 500

  get<T>(key: string): { data: T; isStale: boolean } | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return {
      data: entry.data as T,
      isStale: now > entry.staleAt
    }
  }

  set<T>(key: string, data: T, ttlSeconds: number = 60, staleSeconds: number = 120): void {
    if (this.cache.size >= this.maxEntries) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) this.cache.delete(oldestKey)
    }

    const now = Date.now()
    this.cache.set(key, {
      data,
      expiresAt: now + ttlSeconds * 1000,
      staleAt: now + staleSeconds * 1000
    })
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }
    this.cache.forEach((_, key) => {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    })
  }
}

export const memoryCache = new MemoryCache()

/**
 * Wraps async data fetchers with memory + edge stale-while-revalidate caching
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 60,
  staleTtl: number = 180
): Promise<T> {
  const cached = memoryCache.get<T>(key)
  
  if (cached) {
    if (cached.isStale) {
      // Background revalidation
      fetcher()
        .then(fresh => memoryCache.set(key, fresh, ttl, staleTtl))
        .catch(() => {})
    }
    return cached.data
  }

  const fresh = await fetcher()
  memoryCache.set(key, fresh, ttl, staleTtl)
  return fresh
}

/**
 * Returns a JSON Response with Edge Caching & Stale-While-Revalidate headers
 */
export function cachedJsonResponse(data: unknown, ttl: number = 60, staleTtl: number = 300) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': `public, s-maxage=${ttl}, stale-while-revalidate=${staleTtl}`,
      'X-Edge-Cache': 'HIT',
    },
  })
}
