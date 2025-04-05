import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
})

export async function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      await limiter.check(request, 50) // Increased to 50 requests per minute for testing
      const referer = request.headers.get('referer')
      // Comment out or remove this check temporarily
      /*
      if (!referer || !referer.includes('your-domain.com')) {
        return new NextResponse('Unauthorized', { status: 401 })
      }
      */
      return NextResponse.next()
    } catch {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  }

  // Add security headers for all routes
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
