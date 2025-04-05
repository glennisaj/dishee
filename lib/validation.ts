import { z } from 'zod'

export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  placeId: z.string().optional()
})

// Use in your API routes
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = searchSchema.parse(body)
    // Process validated data
  } catch (error) {
    return Response.json({ error: 'Invalid input' }, { status: 400 })
  }
} 