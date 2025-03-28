import { redis, CACHE_TIMES } from './redis'

// Define strict types for our data structures
interface RestaurantDetails {
  name: string
  address: string
  rating: number
  reviews: Array<{
    text: string
    rating: number
    time?: string
  }>
  lastFetched: string
}

// Match the OpenAI response structure exactly
interface DishAnalysis {
  name: string
  rank: number
  description: string
  quote: string
}

interface AnalysisResults {
  dishes: DishAnalysis[]  // Single level dishes array
  lastAnalyzed: string
}

// Add the RecentlyAnalyzedRestaurant interface
export interface RecentlyAnalyzedRestaurant {
  id: string
  name: string
  address: string
  rating: number
  last_analyzed: string
}

export async function getRestaurantFromCache(placeId: string): Promise<RestaurantDetails | null> {
  try {
    const key = `restaurant:${placeId}`
    const cached = await redis.get(key)
    return cached ? (cached as RestaurantDetails) : null
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

export async function setRestaurantInCache(placeId: string, details: RestaurantDetails): Promise<void> {
  try {
    const key = `restaurant:${placeId}`
    await redis.set(key, details, {
      ex: CACHE_TIMES.RESTAURANT_DETAILS
    })
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

export async function getAnalysisFromCache(placeId: string): Promise<AnalysisResults | null> {
  try {
    const key = `analysis:${placeId}`
    const cached = await redis.get(key)
    
    if (!cached) return null

    // Ensure correct structure when retrieving from cache
    const analysis = cached as AnalysisResults
    if ('dishes' in analysis && 'dishes' in analysis.dishes) {
      // Fix double-nested structure if found
      return {
        dishes: (analysis.dishes as any).dishes,
        lastAnalyzed: analysis.lastAnalyzed
      }
    }
    
    return analysis
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

export async function setAnalysisInCache(placeId: string, analysis: AnalysisResults): Promise<void> {
  try {
    const key = `analysis:${placeId}`
    
    // Ensure correct structure before caching
    const analysisToCache = {
      dishes: Array.isArray(analysis.dishes) ? analysis.dishes : [],
      lastAnalyzed: analysis.lastAnalyzed || new Date().toISOString()
    }

    await redis.set(key, analysisToCache, {
      ex: CACHE_TIMES.ANALYSIS_RESULTS
    })
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

// Helper to check if cached data is still fresh
export function isCacheFresh(timestamp: string, maxAge: number): boolean {
  const date = new Date(timestamp)
  const now = new Date()
  const ageInSeconds = (now.getTime() - date.getTime()) / 1000
  return ageInSeconds < maxAge
}

// Add this function to cache-utils.ts
export async function clearCache(placeId: string): Promise<void> {
  try {
    await redis.del(`restaurant:${placeId}`)
    await redis.del(`analysis:${placeId}`)
    console.log('Cache cleared for:', placeId)
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}

// Add these new functions
export async function addToRecentRestaurants(restaurant: RecentlyAnalyzedRestaurant): Promise<void> {
  try {
    const key = 'recent:restaurants'
    
    // Debug: Log the addition attempt
    console.log('Adding to recent restaurants:', restaurant)
    
    // Get existing list
    const recent = await redis.get(key)
    console.log('Existing recent restaurants:', recent)
    
    // Initialize or use existing array
    const currentList = Array.isArray(recent) ? recent : []
    
    // Remove duplicate if exists and add new entry to start
    const updated = currentList
      .filter((r: RecentlyAnalyzedRestaurant) => r.id !== restaurant.id)
    updated.unshift(restaurant)

    // Keep only last 5 restaurants
    const limited = updated.slice(0, 5)
    
    // Debug: Log what we're saving
    console.log('Saving recent restaurants:', limited)
    
    // Save with expiration
    await redis.set(key, limited, {
      ex: CACHE_TIMES.RESTAURANT_DETAILS // Use same expiration as restaurant details
    })
  } catch (error) {
    console.error('Error updating recent restaurants:', error)
  }
}

export async function getRecentRestaurants(): Promise<RecentlyAnalyzedRestaurant[]> {
  try {
    const key = 'recent:restaurants'
    const recent = await redis.get(key)
    
    // Debug: Log what we're retrieving
    console.log('Retrieved from Redis:', recent)
    
    // Ensure we always return an array
    if (!recent) return []
    if (!Array.isArray(recent)) {
      console.error('Invalid recent restaurants data structure:', recent)
      return []
    }
    
    return recent
  } catch (error) {
    console.error('Error getting recent restaurants:', error)
    return []
  }
}