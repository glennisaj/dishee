import { NextResponse } from 'next/server'
import { extractPlaceId, getPlaceDetails, findPlaceId } from '../../../utils/google-places'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    // Extract CID from the URL
    const cid = await extractPlaceId(url)
    
    // Convert CID to Place ID
    const placeId = await findPlaceId(url)
    console.log('Converted Place ID:', placeId) // Debug log
    
    // Get place details using the converted Place ID
    const placeDetails = await getPlaceDetails(placeId)

    return NextResponse.json({ 
      restaurantId: placeId,
      details: placeDetails,
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
