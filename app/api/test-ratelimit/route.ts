import { NextResponse } from 'next/server'
import { redis } from '@/utils/redis'

export async function GET() {
  try {
    // Test Redis connection
    await redis.ping()
    
    return NextResponse.json({ 
      message: 'Success', 
      timestamp: Date.now(),
      redis: 'connected'
    })
  } catch (error) {
    console.error('Redis error:', error)
    return NextResponse.json({ 
      message: 'Error', 
      error: error instanceof Error ? error.message : 'Redis connection failed',
      timestamp: Date.now()
    }, { status: 500 })
  }
}
