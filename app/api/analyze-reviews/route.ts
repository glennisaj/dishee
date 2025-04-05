import { NextResponse } from 'next/server'
import { getPlaceDetails, verifyGoogleApiKey } from '@/utils/google-places'
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
    // Verify API key first
    if (!verifyGoogleApiKey()) {
      return Response.json(
        { error: 'Google Places API is not configured correctly' },
        { status: 500 }
      )
    }

    const { placeId, forceRefresh = false } = await request.json()
    
    console.log('API received:', { placeId, forceRefresh })

    if (!placeId) {
      console.error('No placeId provided in request') // Debug log
      return Response.json(
        { error: 'Place ID is required' },
        { status: 400 }
      )
    }

    console.log('Fetching details for placeId:', placeId) // Debug log
    const placeDetails = await getPlaceDetails(placeId)
    
    let restaurantData;
    let dishes;
    
    const cachedRestaurant = await getRestaurantFromCache(placeId)
    const cachedAnalysis = await getAnalysisFromCache(placeId)
    
    if (cachedRestaurant && cachedAnalysis && !forceRefresh) {
      console.log('Using cached data for:', placeId)
      restaurantData = cachedRestaurant
      dishes = cachedAnalysis.dishes
    } else {
      console.log('Fetching fresh data for:', placeId)
      // Fetch fresh data
      restaurantData = await getPlaceDetails(placeId)
      const analysisResult = await analyzeDishesFromReviews(restaurantData.reviews)
      dishes = analysisResult.dishes
      
      // Cache the results
      await setRestaurantInCache(placeId, restaurantData)
      await setAnalysisInCache(placeId, {
        dishes: dishes,
        lastAnalyzed: new Date().toISOString()
      })
    }

    // Add to recent restaurants with proper error handling
    try {
      await addToRecentRestaurants({
        placeId,
        name: restaurantData.name,
        address: restaurantData.address,
        rating: restaurantData.rating,
        timestamp: new Date().toISOString()
      })
    } catch (e) {
      console.error('Failed to update recent restaurants:', e)
      // Continue execution even if recent restaurants update fails
    }

    return NextResponse.json({
      placeId,
      details: restaurantData,
      analysis: dishes,
      cached: Boolean(cachedRestaurant && cachedAnalysis && !forceRefresh)
    })

  } catch (error) {
    console.error('API Error:', error)
    return Response.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}
