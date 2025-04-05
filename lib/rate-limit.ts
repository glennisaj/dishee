import { LRUCache } from 'lru-cache'
import type { NextRequest } from 'next/server'

type Options = {
  interval: number
  uniqueTokenPerInterval: number
}

export function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: async (request: NextRequest, limit: number) => {
      const ip = request.ip ?? '127.0.0.1'
      const tokenCount = (tokenCache.get(ip) as number[]) || [0]
      if (!tokenCount || Date.now() > tokenCount[0]) {
        tokenCache.set(ip, [Date.now() + options?.interval!])
        return true
      }
      if (tokenCount.length > limit) {
        throw new Error('Rate limit exceeded')
      }
      tokenCount.push(Date.now())
      tokenCache.set(ip, tokenCount)
      return true
    },
  }
}
