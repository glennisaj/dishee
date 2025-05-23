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
        
        <div className="grid gap-4 p-4">
          {restaurants.slice(0, 4).map((restaurant) => (
            <button
              key={restaurant.placeId}
              onClick={() => handleRestaurantClick(restaurant)}
              className="w-full text-left p-4 rounded-lg border border-zinc-200 hover:border-violet-500 transition-colors"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-black truncate">
                  {restaurant.name}
                </h3>
                <p className="text-sm text-zinc-600">
                  {restaurant.address}
                </p>
              </div>
              {restaurant.rating && (
                <div className="text-sm text-zinc-600">Rating: {restaurant.rating}⭐</div>
              )}
            </button>
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
