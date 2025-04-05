// Verify API key is available
if (!process.env.GOOGLE_PLACES_API_KEY) {
  throw new Error('Missing GOOGLE_PLACES_API_KEY environment variable')
}

// Use this key in your API calls
const apiKey = process.env.GOOGLE_PLACES_API_KEY

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
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
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

// Add this function to check API key
export function verifyGoogleApiKey() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  console.log('API Key available:', Boolean(apiKey))
  console.log('API Key length:', apiKey?.length)
  // Don't log the full key for security
  console.log('API Key preview:', apiKey?.substring(0, 8) + '...')
  return Boolean(apiKey)
}

// Use in your getPlaceDetails function
export async function getPlaceDetails(placeId: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  
  if (!verifyGoogleApiKey()) {
    throw new Error('Google Places API key is not configured correctly')
  }

  try {
    // Add headers and fields parameter
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-FieldMask': 'id,displayName,formattedAddress,rating,reviews,types,primaryType,editorialSummary'
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Google Places API Error:', errorData)
      throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    
    // Transform the response to match your expected format
    return {
      place_id: data.id,
      name: data.displayName?.text,
      formatted_address: data.formattedAddress,
      rating: data.rating,
      reviews: data.reviews?.map((review: any) => ({
        text: review.text?.text,
        rating: review.rating,
        time: review.relativePublishTimeDescription,
        author_name: review.authorAttribution?.displayName
      })) || []
    }
  } catch (error) {
    console.error('Error in getPlaceDetails:', error)
    throw error
  }
}

interface Prediction {
  placeId: string;
  name: string;
  address: string;
  id: string; // For backward compatibility
}

export async function getPlacePredictions(
  input: string,
  location?: { lat: number; lng: number }
): Promise<Prediction[]> {
  try {
    const response = await fetch(`/api/places/search?query=${encodeURIComponent(input)}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch predictions')
    }

    const data = await response.json()
    console.log('Raw API response:', data)

    if (!data.predictions || !Array.isArray(data.predictions)) {
      console.error('Invalid API response format:', data)
      return []
    }

    // Transform the predictions to match our interface
    return data.predictions.map((prediction: any) => ({
      placeId: prediction.place_id,
      name: prediction.structured_formatting?.main_text || prediction.description || '',
      address: prediction.structured_formatting?.secondary_text || '',
      id: prediction.place_id // Keep this for backward compatibility
    }))
  } catch (error) {
    console.error('Error fetching predictions:', error)
    return []
  }
}
