import { NextResponse } from 'next/server'
import { getPlaceDetails } from '@/utils/google-places'
import { analyzeDishesFromReviews } from '@/utils/openai'
import { getRestaurantWithDishes, saveRestaurantAnalysis } from '@/utils/db'

export async function POST(request: Request) {
  try {
    const { placeId } = await request.json()

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      )
    }

    // First, check if we have recent analysis in Supabase
    console.log('Checking cache for placeId:', placeId)
    const cachedData = await getRestaurantWithDishes(placeId)

    if (cachedData) {
      console.log('Cache hit! Returning cached data')
      return NextResponse.json({
        restaurantName: {
          name: cachedData.name,
          rating: cachedData.rating,
          address: cachedData.address,
        },
        dishes: cachedData.dishes,
        status: 'success',
        source: 'cache'
      })
    }

    console.log('Cache miss. Fetching fresh data...')
    
    // If not in cache, get fresh data
    const placeDetails = await getPlaceDetails(placeId)
    
    // Format reviews for analysis
    const reviews = placeDetails.reviews.map(review => ({
      text: review.text,
      rating: review.rating
    }))

    // Analyze reviews to identify dishes
    const dishAnalysis = await analyzeDishesFromReviews(reviews)

    // Save to Supabase
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

    return NextResponse.json({
      restaurantName: {
        name: placeDetails.name,
        rating: placeDetails.rating,
        address: placeDetails.address,
      },
      dishes: dishAnalysis,
      status: 'success',
      source: 'fresh'
    })

  } catch (error) {
    console.error('Error analyzing reviews:', error)
    return NextResponse.json(
      { error: 'Failed to analyze reviews' },
      { status: 500 }
    )
  }
}
