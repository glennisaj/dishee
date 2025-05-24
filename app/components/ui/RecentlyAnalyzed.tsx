'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Clock, ChevronRight, Loader2 } from 'lucide-react'
import { RecentlyAnalyzedRestaurant } from '@/types/api'

interface RecentRestaurant {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  timestamp?: string;
  totalReviews?: number;
  cuisineType?: string;
  priceRange?: string;
}

export default function RecentlyAnalyzed() {
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<RecentRestaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecentRestaurants() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/recent-restaurants')
        const data = await response.json()
        
        console.log('Received data:', data)

        if (Array.isArray(data)) {
          setRestaurants(data)
        } else {
          console.error('Invalid data structure:', data)
          setError('Failed to load recent restaurants')
        }
      } catch (error) {
        console.error('Error:', error)
        setError('Failed to load recent restaurants')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentRestaurants()
  }, [])

  const handleRestaurantClick = (restaurant: RecentRestaurant) => {
    console.log('Clicking restaurant:', restaurant) // Debug log
    if (!restaurant.placeId) {
      console.error('No placeId in restaurant data')
      return
    }
    
    router.push(`/results/${restaurant.placeId}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm p-4 text-center">
        {error}
      </div>
    )
  }

  if (!restaurants.length) {
    return (
      <div className="text-zinc-500 text-sm p-4 text-center">
        No recent restaurants
      </div>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          What's Trending
        </h2>
        <p className="text-base leading-7 text-gray-600 mb-4">
          People recently viewed these restaurants
        </p>
        <div className="grid gap-6 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {restaurants.slice(0, 4).map((restaurant) => (
            <div
              key={restaurant.placeId}
              onClick={() => handleRestaurantClick(restaurant)}
              className="cursor-pointer bg-white rounded-2xl shadow-md border border-zinc-100 hover:shadow-lg transition-shadow duration-200 flex flex-col items-stretch min-h-[320px] p-6"
              style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.06)' }}
            >
              {/* Title */}
              <h3 className="font-bold text-lg text-black mb-1 truncate">
                {restaurant.name}
              </h3>
              {/* Address */}
              <p className="text-sm text-zinc-600 mb-2 truncate">
                {(() => {
                  // Remove zip code and anything after state
                  // Match: ...<city>, <state> <zip>[, ...]
                  const match = restaurant.address.match(/^(.*?,\s*[^,]+,\s*[A-Z]{2})/);
                  return match ? match[1] : restaurant.address;
                })()}
              </p>
              {/* Rating + review count */}
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-semibold text-amber-700 text-base">{restaurant.rating}</span>
                {restaurant.totalReviews ? (
                  <span className="text-zinc-500 text-sm ml-1">({restaurant.totalReviews} reviews)</span>
                ) : null}
              </div>
              {/* Cuisine + Price Range */}
              <div className="flex items-center gap-2 mb-4">
                {restaurant.cuisineType && (
                  <span className="bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-xs font-semibold">
                    {restaurant.cuisineType.replace(/_/g, ' ').replace(/Restaurant/gi, '').trim().replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                )}
                {restaurant.priceRange && restaurant.priceRange !== 'Unknown' && (
                  <span className="bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-xs font-semibold">
                    {restaurant.priceRange}
                  </span>
                )}
              </div>
              {/* Spacer to push button to bottom */}
              <div className="flex-grow" />
              {/* View Details button */}
              <button
                className="w-full mt-2 py-2 rounded-lg border border-zinc-200 bg-white text-black font-semibold hover:bg-zinc-50 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return 'Recently'
  
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  }

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`
    }
  }

  return 'Just now'
}
