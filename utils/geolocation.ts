interface IPGeolocation {
  lat: number;
  lng: number;
}

export async function getLocationFromIP(): Promise<IPGeolocation> {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    return {
      lat: parseFloat(data.latitude),
      lng: parseFloat(data.longitude)
    }
  } catch (error) {
    // Default to New York City coordinates if IP geolocation fails
    return {
      lat: 40.7128,
      lng: -74.0060
    }
  }
} 