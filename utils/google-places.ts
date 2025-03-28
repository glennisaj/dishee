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

export async function extractPlaceId(url: string): Promise<string> {
  try {
    const { isValid, urlType } = isValidGoogleMapsUrl(url)
    
    if (!isValid) {
      throw new Error('Invalid Google Maps URL')
    }

    console.log('Initial URL:', url); // Debug log

    if (urlType === 'short') {
      const response = await fetch(url)
      url = response.url
      console.log('Expanded URL:', url); // Debug log
    }

    // Try different patterns to extract CID
    let cid: string | null = null;

    // Pattern 1: Look for CID pattern
    const cidMatch = url.match(/0x[0-9a-fA-F]+:0x[0-9a-fA-F]+/)
    if (cidMatch) {
      cid = cidMatch[0]
      console.log('Found CID:', cid);
    }

    // Pattern 2: Look for place_id in URL
    if (!cid) {
      const placeIdMatch = url.match(/[?&]place_id=([^&]+)/)
      if (placeIdMatch) {
        cid = placeIdMatch[1]
        console.log('Found place_id:', cid);
      }
    }

    // Pattern 3: Look for data field
    if (!cid) {
      const dataMatch = url.match(/!1s([^!]+)!/)
      if (dataMatch) {
        cid = dataMatch[1]
        console.log('Found data field:', cid);
      }
    }

    if (!cid) {
      // If we can't find a CID, try using the findPlaceId function directly
      console.log('No CID found, trying direct place search');
      return await findPlaceId(url);
    }

    return cid
  } catch (error) {
    console.error('Error extracting identifier:', error)
    throw error
  }
}

export async function findPlaceId(query: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Places API key is not configured');
  }

  try {
    // For shortened URLs, extract the identifier
    if (query.includes('maps.app.goo.gl')) {
      // Extract the identifier from the short URL
      const shortId = query.split('/').pop();
      console.log('Short URL identifier:', shortId);
      
      // First, get the full URL
      const response = await fetch(query);
      const fullUrl = response.url;
      console.log('Expanded URL:', fullUrl);

      // Try to extract the name from the expanded URL
      const nameMatch = fullUrl.match(/place\/([^/@]+)/);
      let searchQuery = '';
      
      if (nameMatch) {
        searchQuery = decodeURIComponent(nameMatch[1].replace(/\+/g, ' '));
        console.log('Extracted name:', searchQuery);
      }

      // Extract coordinates as fallback
      const coordMatch = fullUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        const [lat, lng] = [coordMatch[1], coordMatch[2]];
        console.log('Extracted coordinates:', lat, lng);
      }

      // Make the search request with both name and location
      const findPlaceUrl = `https://places.googleapis.com/v1/places:searchText`;
      const searchResponse = await fetch(findPlaceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress'
        },
        body: JSON.stringify({
          textQuery: searchQuery,
          locationBias: coordMatch ? {
            circle: {
              center: {
                latitude: parseFloat(coordMatch[1]),
                longitude: parseFloat(coordMatch[2])
              },
              radius: 100.0 // Search within 100 meters
            }
          } : undefined,
          maxResultCount: 1
        })
      });

      if (!searchResponse.ok) {
        throw new Error('Failed to find place from short URL');
      }

      const data = await searchResponse.json();
      console.log('Search response:', data);

      if (!data.places?.[0]?.id) {
        throw new Error('No place found for short URL');
      }

      return data.places[0].id;
    }

    // For full URLs, extract the name and search
    let searchQuery = query;
    const nameMatch = query.match(/place\/([^/@]+)/);
    if (nameMatch) {
      searchQuery = decodeURIComponent(nameMatch[1].replace(/\+/g, ' '));
    }

    const findPlaceUrl = `https://places.googleapis.com/v1/places:searchText`;
    const response = await fetch(findPlaceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress'
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        maxResultCount: 1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Find Place API Response:', errorText);
      throw new Error('Failed to find place');
    }

    const data = await response.json();
    console.log('Find Place Response:', data);

    if (!data.places?.[0]?.id) {
      throw new Error('No place found');
    }

    return data.places[0].id;
  } catch (error) {
    console.error('Error finding place:', error);
    throw error;
  }
}

interface PlaceDetails {
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  reviews: {
    text: string;
    time: number;
    rating: number;
  }[];
}

export async function getPlaceDetails(placeId: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  
  if (!apiKey) {
    throw new Error('Google Places API key is not configured')
  }

  const response = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,formattedAddress,rating,userRatingCount,reviews`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,rating,userRatingCount,reviews'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch place details: ${await response.text()}`)
  }

  const data = await response.json()
  
  return {
    name: data.displayName.text,
    address: data.formattedAddress,
    rating: data.rating,
    reviews: data.reviews?.map((review: any) => ({
      text: review.text?.text || '',
      rating: review.rating || 0,
      time: review.relativePublishTime || ''
    })) || []
  }
}

export async function getPlacePredictions(
  input: string,
  location?: { lat: number; lng: number }
) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  
  if (!apiKey) {
    throw new Error('Google Places API key is not configured')
  }

  const response = await fetch(
    'https://places.googleapis.com/v1/places:searchText',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress'
      },
      body: JSON.stringify({
        textQuery: input,
        locationBias: location ? {
          circle: {
            center: {
              latitude: location.lat,
              longitude: location.lng
            },
            radius: 20000.0
          }
        } : undefined,
        maxResultCount: 5
      })
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch predictions: ${await response.text()}`)
  }

  const data = await response.json()
  return data.places.map((place: any) => ({
    id: place.id,
    name: place.displayName.text,
    address: place.formattedAddress
  }))
}
