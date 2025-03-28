import { NextResponse } from 'next/server'
import { redis } from '@/utils/redis'

export async function GET() {
  try {
    // Test write
    await redis.set('test-key', 'Hello from Redis!')
    
    // Test read
    const value = await redis.get('test-key')
    
    // Test delete
    await redis.del('test-key')
    
    return NextResponse.json({
      status: 'success',
      message: 'Redis connection working',
      testValue: value
    })
  } catch (error) {
    console.error('Redis test failed:', error)
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Redis test failed',
    }, { status: 500 })
  }
}
