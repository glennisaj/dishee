import { NextResponse } from 'next/server'
import { getRecentlyAnalyzed } from '@/utils/db'
import { RecentlyAnalyzedResponse } from '@/types/api'

export async function GET() {
  try {
    const restaurants = await getRecentlyAnalyzed()
    
    const response: RecentlyAnalyzedResponse = {
      restaurants,
      status: 'success'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching recent restaurants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent restaurants', status: 'error' },
      { status: 500 }
    )
  }
}
