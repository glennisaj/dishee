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
    console.log('Analyzing reviews for placeId:', placeId) // Debug log

    if (!placeId) {
      return NextResponse.json({ error: 'Place ID is required' }, { status: 400 })
    }

    // Debug logs to track the flow
    console.log('Fetching place details...')
    const placeDetails = await getPlaceDetails(placeId, forceRefresh)
    console.log('Reviews fetched:', placeDetails.reviews?.length || 0)

    if (!placeDetails.reviews || placeDetails.reviews.length === 0) {
      return NextResponse.json({ 
        error: 'No reviews found for this restaurant',
        status: 'error' 
      }, { status: 404 })
    }

    console.log('Analyzing reviews with OpenAI...')
    const analysisResult = await analyzeDishesFromReviews(placeDetails.reviews)
    
    await addToRecentRestaurants({
      placeId,
      name: placeDetails.name,
      rating: placeDetails.rating,
      address: placeDetails.address,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      restaurantName: placeDetails,
      dishes: analysisResult.dishes,
      status: 'success'
    })

  } catch (error) {
    console.error('Analysis failed:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Analysis failed',
      status: 'error'
    }, { status: 500 })
  }
}
