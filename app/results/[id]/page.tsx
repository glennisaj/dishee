'use client'
import { useState, use, useEffect } from 'react'
import { Star } from 'lucide-react'

interface ResultsPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { id } = use(params)
  const [isLoading, setIsLoading] = useState(true)
  const [restaurantDetails, setRestaurantDetails] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
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
          throw new Error('Failed to analyze restaurant')
        }

        const data = await response.json()
        setRestaurantDetails(data.restaurantName)
        setAnalysis(data.dishes)
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to load restaurant analysis. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

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

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-16">
        {/* Restaurant Header */}
        {restaurantDetails && (
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-zinc-900 mb-4">
              {restaurantDetails.name}
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Star className="w-5 h-5 text-amber-400 fill-current" />
              <span className="text-lg font-semibold text-zinc-900">
                {restaurantDetails.rating}
              </span>
              <span className="text-zinc-500">
                ({restaurantDetails.reviews?.length || 0} reviews)
              </span>
            </div>
            <p className="text-zinc-600">{restaurantDetails.address}</p>
          </div>
        )}

        {/* Dishes Section */}
        {analysis && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-8 text-center">
              Most Recommended Dishes
            </h2>
            <div className="space-y-6">
              {analysis.map((dish: any, index: number) => (
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
