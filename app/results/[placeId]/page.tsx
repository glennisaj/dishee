'use client'

import React, { useEffect, useState } from 'react'
import { Loader2, Star, MapPin, Quote, Clock, Phone } from 'lucide-react'
import { RestaurantDetails, DishAnalysis } from '@/types/api'
import { useParams } from 'next/navigation'
import { LoadingState } from '@/app/components/ui/LoadingState'

export default function ResultsPage() {
  const params = useParams()
  const placeId = params?.placeId
  
  console.log('Results page params:', params)
  console.log('Extracted placeId:', placeId)
  
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null)
  const [dishes, setDishes] = useState<DishAnalysis[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!placeId || placeId === 'undefined') {
      console.error('Invalid or missing placeId')
      setError('Invalid restaurant ID')
      setIsLoading(false)
      return
    }

    async function fetchResults() {
      try {
        console.log('Fetching results for placeId:', placeId)
        
        const response = await fetch('/api/analyze-reviews', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ placeId })
        })

        const data = await response.json()
        console.log('API Response:', data)

        if (!response.ok) {
          throw new Error(data.error?.message || JSON.stringify(data.error) || 'Failed to fetch results')
        }

        // Make sure we're setting the correct data structure
        setRestaurant({
          name: data.details?.name || '',
          rating: data.details?.rating || 0,
          address: data.details?.address || '',
          reviews: data.details?.reviews || [],
          lastFetched: data.details?.lastFetched || new Date().toISOString(),
          cuisineType: data.details?.cuisineType || '',
          businessHours: data.details?.businessHours || { open: '', close: '' },
          phoneNumber: data.details?.phoneNumber || '',
          priceRange: data.details?.priceRange || '',
          totalReviews: data.details?.totalReviews || 0,
        })
        
        setDishes(data.analysis || [])
      } catch (err) {
        console.error('Error in fetchResults:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [placeId])

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-zinc-800"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {restaurant && (
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 mb-3">
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="ml-1 font-semibold text-amber-700 text-lg">{restaurant.rating}</span>
              {restaurant.totalReviews && (
                <span className="text-zinc-600 text-base ml-2">({restaurant.totalReviews} reviews)</span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-4">
              {restaurant.cuisineType && (
                <span className="bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-sm font-semibold">
                  {restaurant.cuisineType.replace(/_/g, ' ').replace(/Restaurant/gi, '').trim().replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              )}
              {restaurant.priceRange && restaurant.priceRange !== 'Unknown' && (
                <span className="bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-sm font-semibold">
                  {restaurant.priceRange}
                </span>
              )}
            </div>
            <div className="flex items-center text-zinc-600 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              <p>{restaurant.address}</p>
            </div>
            {/* Hours + Phone (stacked vertically for mobile) */}
            <div className="flex flex-col gap-1 text-zinc-700 text-base">
              {restaurant.businessHours && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 mr-1 text-zinc-500" />
                  {restaurant.businessHours.open} - {restaurant.businessHours.close}
                </span>
              )}
              {restaurant.phoneNumber && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4 mr-1 text-zinc-500" />
                  {(() => {
                    // Remove spaces, dashes, and parentheses for normalization
                    const digits = restaurant.phoneNumber.replace(/[^\d\+]/g, '');
                    // US number: +1XXXXXXXXXX or 1XXXXXXXXXX
                    if (/^(\+1|1)?(\d{10})$/.test(digits)) {
                      // Remove country code if present
                      const num = digits.replace(/^\+?1/, '');
                      return `(${num.slice(0,3)}) ${num.slice(3,6)}-${num.slice(6,10)}`;
                    }
                    // Otherwise, show as-is
                    return restaurant.phoneNumber;
                  })()}
                </span>
              )}
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
      </div>
    </div>
  )
}
