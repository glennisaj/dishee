import { NextResponse } from 'next/server'
import { getPlaceDetails } from '@/utils/google-places'
import { analyzeDishesFromReviews } from '@/utils/openai'
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
    const { placeId }: AnalyzeReviewsRequest = await request.json()

    if (!placeId) {
      const errorResponse: ErrorResponse = {
        error: 'Place ID is required',
        status: 400
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    // Check cache
    console.log('Checking cache for placeId:', placeId)
    const cachedData = await getRestaurantWithDishes(placeId)

    if (cachedData) {
      console.log('Cache hit! Returning cached data')
      const response: AnalyzeReviewsResponse = {
        restaurantName: {
          name: cachedData.name,
          rating: cachedData.rating,
          address: cachedData.address,
          reviews: {
            length: cachedData.review_count || 0
          }
        },
        dishes: cachedData.dishes,
        status: 'success',
        source: 'cache'
      }
      return NextResponse.json(response)
    }

    console.log('Cache miss. Fetching fresh data...')
    
    // Get fresh data
    const placeDetails = await getPlaceDetails(placeId)
    
    // Add proper typing for reviews
    const reviews: Review[] = placeDetails.reviews.map((review: Review) => ({
      text: review.text,
      rating: review.rating
    }))

    const dishAnalysis = await analyzeDishesFromReviews(reviews)

    // Save to cache
    console.log('Saving analysis to cache...')
    await saveRestaurantAnalysis(
      placeId,
      {
        name: placeDetails.name,
        address: placeDetails.address,
        rating: placeDetails.rating,
        review_count: placeDetails.reviews.length,
        last_analyzed: new Date().toISOString()
      },
      dishAnalysis
    )

    const response: AnalyzeReviewsResponse = {
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
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error analyzing reviews:', error)
    const errorResponse: ErrorResponse = {
      error: 'Failed to analyze reviews',
      status: 500
    }
    return NextResponse.json(errorResponse, { status: 500 })
  }
}
