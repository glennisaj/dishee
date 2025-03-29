import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: { placeId: string } }
) {
  const placeId = params.placeId

  // Set up SSE headers
  const headersList = headers()
  const responseHeaders = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  // Function to send updates
  const sendUpdate = async (data: any) => {
    await writer.write(
      new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)
    )
  }

  // Start checking for analysis results
  const checkInterval = setInterval(async () => {
    try {
      const results = await getCachedAnalysis(placeId)
      if (results) {
        await sendUpdate({ status: 'complete', dishes: results })
        clearInterval(checkInterval)
        writer.close()
      } else {
        await sendUpdate({ status: 'analyzing' })
      }
    } catch (error) {
      console.error('Error checking analysis status:', error)
      await sendUpdate({ status: 'error', message: 'Analysis failed' })
      clearInterval(checkInterval)
      writer.close()
    }
  }, 1000) // Check every second

  // Clean up if client disconnects
  request.signal.addEventListener('abort', () => {
    clearInterval(checkInterval)
    writer.close()
  })

  return new Response(stream.readable, {
    headers: responseHeaders,
  })
}
