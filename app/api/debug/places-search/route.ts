import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || 'test restaurant'
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  const locationBias = lat && lng ? {
    locationBias: {
      circle: {
        center: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng)
        },
        radius: 5000.0 // 5km radius
      }
    }
  } : {}

  const response = await fetch(
    `https://places.googleapis.com/v1/places:searchText?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress'
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "en",
        ...locationBias
      })
    }
  )

  const data = await response.json()
  
  // Add error logging
  if (!response.ok) {
    console.error('Google Places API error:', data)
    return NextResponse.json({ error: data.error }, { status: response.status })
  }

  return NextResponse.json(data)
}
