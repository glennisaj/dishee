import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>()

export async function middleware(request: NextRequest) {
  // Skip rate limiting for non-API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? request.socket?.remoteAddress ?? '127.0.0.1'
  const now = Date.now()
  const windowMs = 10000 // 10 seconds
  const maxRequests = 50 // requests per window

  const current = rateLimit.get(ip) ?? { count: 0, timestamp: now }

  // Reset if window has passed
  if (now - current.timestamp > windowMs) {
    current.count = 0
    current.timestamp = now
  }

  if (current.count >= maxRequests) {
    return new NextResponse('Too many requests', {
      status: 429,
      headers: {
        'Retry-After': `${Math.ceil((current.timestamp + windowMs - now) / 1000)}`
      }
    })
  }

  current.count++
  rateLimit.set(ip, current)

  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', maxRequests.toString())
  response.headers.set('X-RateLimit-Remaining', (maxRequests - current.count).toString())
  
  return response
}

export const config = {
  matcher: '/api/:path*',
}
