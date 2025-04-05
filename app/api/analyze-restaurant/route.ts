import { NextResponse } from 'next/server'
import { extractPlaceId, getPlaceDetails, findPlaceId } from '../../../utils/google-places'
import { analyzeDishesFromReviews } from '../../../utils/openai'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    // First get the CID from the URL
    const cid = await extractPlaceId(url)
    console.log('Extracted CID:', cid)
    
    // Convert CID to proper Place ID
    const placeId = await findPlaceId(url)
    console.log('Converted to Place ID:', placeId)
    
    // Get place details using the proper Place ID
    const placeDetails = await getPlaceDetails(placeId)

    // Analyze reviews immediately
    const reviews = placeDetails.reviews.map((review: { text: any; rating: any }) => ({
      text: review.text,
      rating: review.rating
    }))

    const dishAnalysis = await analyzeDishesFromReviews(reviews)

    return NextResponse.json({ 
      restaurantId: placeId, // Use the converted Place ID
      details: placeDetails,
      analysis: dishAnalysis,
      status: 'success' 
    })

  } catch (error) {
    console.error('Error processing restaurant URL:', error)
    return NextResponse.json(
      { error: 'Failed to process restaurant URL' },
      { status: 500 }
    )
  }
}
