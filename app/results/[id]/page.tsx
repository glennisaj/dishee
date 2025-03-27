'use client'
import { useState, use, useEffect } from 'react'
import { Star, AlertCircle } from 'lucide-react'
import { AnalyzeReviewsResponse, ErrorResponse } from '@/types/api'

interface ResultsPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { id } = use(params)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<AnalyzeReviewsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analyze-reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ placeId: id }),
        })

        if (!response.ok) {
          const errorData = await response.json() as ErrorResponse
          throw new Error(errorData.error || 'Failed to analyze restaurant')
        }

        const responseData = await response.json() as AnalyzeReviewsResponse
        setData(responseData)
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-zinc-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-zinc-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
            <p className="text-lg text-zinc-600">Analyzing restaurant reviews...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-16">
        {/* Restaurant Header */}
        {data && data.restaurantName && (
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-zinc-900 mb-4">
              {data.restaurantName.name}
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Star className="w-5 h-5 text-amber-400 fill-current" />
              <span className="text-lg font-semibold text-zinc-900">
                {data.restaurantName.rating}
              </span>
              <span className="text-zinc-500">
                ({data.restaurantName.reviews?.length || 0} reviews)
              </span>
            </div>
            <p className="text-zinc-600">{data.restaurantName.address}</p>
          </div>
        )}

        {/* Dishes Section */}
        {data && data.dishes && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-8 text-center">
              Most Recommended Dishes
            </h2>
            <div className="space-y-6">
              {data.dishes.map((dish: any, index: number) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-violet-100 text-violet-800 text-sm font-medium rounded-full mb-2">
                        #{dish.rank} Top Pick
                      </span>
                      <h3 className="text-xl font-bold text-zinc-900">
                        {dish.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-zinc-600 mb-4">
                    {dish.description}
                  </p>
                  <blockquote className="border-l-4 border-violet-200 pl-4 italic text-zinc-600">
                    "{dish.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
