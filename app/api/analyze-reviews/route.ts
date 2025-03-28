import { NextResponse } from 'next/server'
import { getPlaceDetails } from '@/utils/google-places'
import { analyzeDishesFromReviews } from '@/utils/openai'
import { 
  getRestaurantFromCache, 
  setRestaurantInCache,
  getAnalysisFromCache,
  setAnalysisInCache,
  isCacheFresh,
  addToRecentRestaurants
} from '@/utils/cache-utils'
import { CACHE_TIMES } from '@/utils/redis'
import { getRestaurantWithDishes, saveRestaurantAnalysis } from '@/utils/db'
import { 
  AnalyzeReviewsRequest, 
  AnalyzeReviewsResponse, 
  ErrorResponse 
} from '@/types/api'

// Add interface for review structure
interface Review {
  text: string
  rating: number
  time?: string
}

export async function POST(request: Request) {
  try {
    const { placeId } = await request.json()

    if (!placeId) {
      return NextResponse.json({
        error: 'Place ID is required',
        status: 'error'
      }, { status: 400 })
    }

    // First, try to get cached data
    const cachedRestaurant = await getRestaurantFromCache(placeId)
    const cachedAnalysis = await getAnalysisFromCache(placeId)

    // Debug: Log the cached data structure
    console.log('Cached Restaurant:', cachedRestaurant)
    console.log('Cached Analysis:', cachedAnalysis)

    // If we have both cached and they're fresh, return them
    if (cachedRestaurant && cachedAnalysis) {
      console.log('Cache hit for both restaurant and analysis')
      return NextResponse.json({
        restaurantName: {
          name: cachedRestaurant.name,
          rating: cachedRestaurant.rating,
          address: cachedRestaurant.address,
          reviews: {
            length: cachedRestaurant.reviews.length
          }
        },
        dishes: Array.isArray(cachedAnalysis.dishes.dishes) 
          ? cachedAnalysis.dishes.dishes 
          : cachedAnalysis.dishes,
        status: 'success',
        source: 'cache'
      })
    }

    // If we need to fetch fresh data
    console.log('Cache miss - fetching fresh data')
    const placeDetails = await getPlaceDetails(placeId)
    
    // Add to recent restaurants list
    console.log('Adding restaurant to recent list:', placeDetails.name)
    await addToRecentRestaurants({
      id: placeId,
      name: placeDetails.name,
      address: placeDetails.address,
      rating: placeDetails.rating,
      last_analyzed: new Date().toISOString()
    })

    // Cache the restaurant details
    await setRestaurantInCache(placeId, {
      name: placeDetails.name,
      address: placeDetails.address,
      rating: placeDetails.rating,
      reviews: placeDetails.reviews,
      lastFetched: new Date().toISOString()
    })

    // Only analyze reviews if we don't have fresh analysis
    if (!cachedAnalysis) {
      console.log('Analyzing reviews...')
      const dishAnalysis = await analyzeDishesFromReviews(placeDetails.reviews)
      
      // Debug: Log the fresh analysis
      console.log('Fresh Analysis:', dishAnalysis)

      // Cache the analysis with correct structure
      await setAnalysisInCache(placeId, {
        dishes: dishAnalysis,
        lastAnalyzed: new Date().toISOString()
      })

      return NextResponse.json({
        restaurantName: {
          name: placeDetails.name,
          rating: placeDetails.rating,
          address: placeDetails.address,
          reviews: {
            length: placeDetails.reviews.length
          }
        },
        dishes: dishAnalysis,
        status: 'success',
        source: 'fresh'
      })
    }

    // Return fresh restaurant data with cached analysis
    return NextResponse.json({
      restaurantName: {
        name: placeDetails.name,
        rating: placeDetails.rating,
        address: placeDetails.address,
        reviews: {
          length: placeDetails.reviews.length
        }
      },
      dishes: cachedAnalysis.dishes,
      status: 'success',
      source: 'mixed'
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 })
  }
}
