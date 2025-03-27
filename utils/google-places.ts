// Verify API key is available
if (!process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY) {
  throw new Error('Missing GOOGLE_PLACES_API_KEY environment variable')
}

// URL validation regex patterns
const GOOGLE_MAPS_PATTERNS = {
  FULL_URL: /^https:\/\/(www\.)?google\.com\/maps\/place\/[^\/]+\/.+/,
  SHORT_URL: /^https:\/\/maps\.app\.goo\.gl\/.+/
}

export function isValidGoogleMapsUrl(url: string): { isValid: boolean; urlType?: 'full' | 'short' } {
  if (GOOGLE_MAPS_PATTERNS.FULL_URL.test(url)) {
    return { isValid: true, urlType: 'full' }
  }
  
  if (GOOGLE_MAPS_PATTERNS.SHORT_URL.test(url)) {
    return { isValid: true, urlType: 'short' }
  }

  return { isValid: false }
}

export async function extractPlaceId(url: string) {
  try {
    const { isValid, urlType } = isValidGoogleMapsUrl(url)
    
    if (!isValid) {
      throw new Error('Invalid Google Maps URL')
    }

    if (urlType === 'short') {
      // Handle shortened URL by following redirect
      const response = await fetch(url)
      url = response.url // Get the full URL after redirect
    }

    // Extract place_id from the full URL
    const placeIdMatch = url.match(/place\/[^\/]+\/([^\/\?]+)/)
    if (!placeIdMatch) {
      throw new Error('Could not extract place ID from URL')
    }

    return placeIdMatch[1]
  } catch (error) {
    console.error('Error extracting place ID:', error)
    throw error
  }
}
