import { NextResponse } from 'next/server'
import { extractPlaceId } from '../../../utils/google-places'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    // Extract place ID from the URL
    const placeId = await extractPlaceId(url)

    // TODO: Add actual restaurant analysis logic here
    // For now, we'll just return the place ID
    return NextResponse.json({ 
      restaurantId: placeId,
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
