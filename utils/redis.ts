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

interface RecentRestaurant {
  placeId: string;
  name: string;
  address: string;
  rating: number;
  timestamp: string;
}

export async function addToRecentRestaurants(restaurant: RecentRestaurant) {
  try {
    // Get existing restaurants
    const existing = await redis.get('recent:restaurants')
    console.log('Existing Redis data:', existing)

    let restaurants: RecentRestaurant[] = []
    
    // Handle existing data
    if (existing) {
      // If it's a string, parse it, otherwise use it directly
      restaurants = typeof existing === 'string' ? JSON.parse(existing) : existing
    }

    // Ensure restaurants is an array
    if (!Array.isArray(restaurants)) {
      restaurants = []
    }

    // Add new restaurant and limit to 4
    const updated = [
      restaurant,
      ...restaurants.filter(r => r.placeId !== restaurant.placeId)
    ].slice(0, 4)  // Changed from 5 to 4

    console.log('Storing restaurants:', updated)

    // Store as a stringified array
    await redis.set('recent:restaurants', JSON.stringify(updated))
    
    return updated
  } catch (error) {
    console.error('Error in addToRecentRestaurants:', error)
    return []
  }
}
