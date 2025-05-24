import { NextResponse } from 'next/server'
import { redis } from '@/utils/redis'
import { RecentlyAnalyzedRestaurant } from '@/types/api'

export async function GET() {
  try {
    const recentRestaurants = await redis.get('recent:restaurants')
    console.log('Raw Redis data:', recentRestaurants)

    if (!recentRestaurants) {
      console.log('No restaurants found in Redis')
      return NextResponse.json([])
    }

    // Handle the data based on its type
    let restaurants = typeof recentRestaurants === 'string' 
      ? JSON.parse(recentRestaurants) 
      : recentRestaurants

    // Ensure we have an array
    if (!Array.isArray(restaurants)) {
      console.log('Converting non-array to array:', restaurants)
      restaurants = []
    }

    // Validate and clean the data
    const validRestaurants = (restaurants as RecentlyAnalyzedRestaurant[])
      .filter((r: RecentlyAnalyzedRestaurant) => r && r.placeId && r.name) // Ensure required fields exist
      .map((r: RecentlyAnalyzedRestaurant) => ({
        placeId: r.placeId,
        name: r.name,
        address: r.address || '',
        rating: r.rating || 0,
        timestamp: r.timestamp || new Date().toISOString()
      }))

    console.log('Returning restaurants:', validRestaurants)
    return NextResponse.json(validRestaurants)

  } catch (error) {
    console.error('Error in recent-restaurants API:', error)
    return NextResponse.json([])
  }
}
