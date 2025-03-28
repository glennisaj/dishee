import { NextResponse } from 'next/server'
import { getRecentRestaurants } from '@/utils/cache-utils'

export async function GET() {
  try {
    // Add debug logging
    console.log('Fetching recent restaurants...')
    
    const restaurants = await getRecentRestaurants()
    
    // Log what we're returning
    console.log('Recent restaurants:', restaurants)
    
    // Ensure we're returning the correct structure
    return NextResponse.json({ 
      restaurants: restaurants,
      status: 'success'
    })
  } catch (error) {
    console.error('Error in recent-restaurants API:', error)
    // Return a proper error response
    return NextResponse.json(
      { 
        restaurants: [],
        status: 'error',
        message: 'Failed to fetch recent restaurants'
      }, 
      { status: 500 }
    )
  }
}
