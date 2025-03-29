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
    const { placeId, forceRefresh } = await request.json()
    let restaurantData;
    let dishes;
    
    const cachedRestaurant = await getRestaurantFromCache(placeId)
    const cachedAnalysis = await getAnalysisFromCache(placeId)
    
    if (cachedRestaurant && cachedAnalysis && !forceRefresh) {
      restaurantData = cachedRestaurant
      dishes = cachedAnalysis.dishes
    } else {
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

    // Single location for updating recently analyzed
    await addToRecentRestaurants({
      placeId,
      name: restaurantData.name,
      address: restaurantData.address,
      rating: restaurantData.rating,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      restaurantName: restaurantData,
      dishes: dishes,
      status: 'success'
    })

  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Analysis failed',
      status: 'error'
    }, { status: 500 })
  }
}
