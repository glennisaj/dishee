import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Upstash Redis credentials')
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Cache durations in seconds
export const CACHE_TIMES = {
  RESTAURANT_DETAILS: 7 * 24 * 60 * 60,  // 7 days
  ANALYSIS_RESULTS: 21 * 24 * 60 * 60,   // 21 days
}
