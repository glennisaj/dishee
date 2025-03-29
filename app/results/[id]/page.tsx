'use client'

import { useEffect, useState } from 'react'
import { Loader2, Star, MapPin, Quote } from 'lucide-react'
import { RestaurantDetails, DishAnalysis } from '@/types/api'
import { useParams } from 'next/navigation'

export default function ResultsPage() {
  const params = useParams()
  const placeId = decodeURIComponent(params?.id as string)
  
  console.log('Params received:', params)
  console.log('PlaceId extracted:', placeId)
  
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null)
  const [dishes, setDishes] = useState<DishAnalysis[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResults() {
      if (!placeId) {
        console.error('No placeId provided')
        setError('Restaurant ID is missing')
        setIsLoading(false)
        return
      }

      try {
        console.log('Starting analysis for placeId:', placeId)
        
        const response = await fetch('/api/analyze-reviews', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            placeId: placeId,
            forceRefresh: true
          })
        })

        console.log('Response status:', response.status)

        const data = await response.json()
        console.log('API Response:', data)

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch results')
        }

        setRestaurant(data.restaurantName)
        setDishes(data.dishes)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching results:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setIsLoading(false)
      }
    }

    console.log('Results page mounted with placeId:', placeId)
    fetchResults()
  }, [placeId])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {restaurant && (
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-3">
            {restaurant.name}
          </h1>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-5 h-5 fill-current" />
              <span className="ml-1 font-semibold">{restaurant.rating}</span>
            </div>
          </div>
          <div className="flex items-center text-zinc-600">
            <MapPin className="w-4 h-4 mr-2" />
            <p>{restaurant.address}</p>
          </div>
        </div>
      )}

      {dishes && dishes.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-8 text-zinc-900">
            Most Recommended Dishes
          </h2>
          <div className="space-y-8">
            {dishes.map((dish, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md border border-zinc-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                    #{index + 1} Top Pick
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900">
                    {dish.name}
                  </h3>
                </div>
                
                <p className="text-zinc-700 mb-4 leading-relaxed">
                  {dish.description}
                </p>
                
                {dish.quote && (
                  <div className="flex gap-2 items-start border-l-4 border-violet-200 pl-4">
                    <Quote className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
                    <p className="text-sm italic text-zinc-600">
                      "{dish.quote}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600 mb-4" />
          <p className="text-zinc-600">Analyzing restaurant reviews...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-700 font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
