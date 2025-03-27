import { NextResponse } from 'next/server'
import { getPlaceDetails } from '../../../utils/google-places'
import { analyzeDishesFromReviews } from '../../../utils/openai'

export async function POST(request: Request) {
  try {
    const { placeId } = await request.json()

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      )
    }

    // Get place details including reviews
    const placeDetails = await getPlaceDetails(placeId)

    // Format reviews for analysis
    const reviews = placeDetails.reviews.map(review => ({
      text: review.text,
      rating: review.rating
    }))

    // Analyze reviews to identify dishes
    const dishAnalysis = await analyzeDishesFromReviews(reviews)

    return NextResponse.json({
      restaurantName: {
        name: placeDetails.name,
        rating: placeDetails.rating,
        reviewCount: placeDetails.reviews.length,
        address: placeDetails.address
      },
      dishes: dishAnalysis,
      status: 'success'
    })

  } catch (error) {
    console.error('Error analyzing reviews:', error)
    return NextResponse.json(
      { error: 'Failed to analyze reviews' },
      { status: 500 }
    )
  }
}
