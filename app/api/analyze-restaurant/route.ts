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

// CURRENT (UNSAFE) - Client-side exposure
const apiKey = process.env.GOOGLE_PLACES_API_KEY

// SAFER APPROACH - Create a server-side endpoint
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  
  // Use server-side environment variable
  const apiKey = process.env.GOOGLE_PLACES_API_KEY // Remove NEXT_PUBLIC_
  
  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places:searchText`,
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey || '',
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress'
        }),
        body: JSON.stringify({ textQuery: query })
      }
    )
    
    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error('Places API error:', error)
    return Response.json({ error: 'Failed to fetch places' }, { status: 500 })
  }
}
