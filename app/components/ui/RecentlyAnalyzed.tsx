'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Clock, ChevronRight, Loader2 } from 'lucide-react'
import { RecentlyAnalyzedRestaurant } from '@/types/api'

export default function RecentlyAnalyzed() {
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<RecentlyAnalyzedRestaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecentRestaurants = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/recent-restaurants')
      
      // Log the response for debugging
      console.log('Response status:', response.status)
      
      const data = await response.json()
      console.log('Received data:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recent restaurants')
      }

      if (!data.restaurants || !Array.isArray(data.restaurants)) {
        console.error('Invalid data structure:', data)
        throw new Error('Invalid response format')
      }

      setRestaurants(data.restaurants.slice(0, 4))
      setError(null)
    } catch (err) {
      console.error('Error fetching recent restaurants:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setRestaurants([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecentRestaurants()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchRecentRestaurants, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
      </div>
    )
  }

  // Only hide component if there's no data AND no error
  if (restaurants.length === 0 && !error) {
    return null
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">
          Recently Analyzed Restaurants
        </h2>
        
        {error ? (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {restaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => router.push(`/results/${restaurant.id}`)}
                className="group p-6 bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-200 text-left"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-zinc-900 group-hover:text-violet-600 transition-colors">
                    {restaurant.name}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-violet-600 transition-colors" />
                </div>
                
                <p className="text-sm text-zinc-600 mb-4">
                  {restaurant.address}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-zinc-900">
                      {restaurant.rating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-zinc-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimeAgo(restaurant.last_analyzed)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
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
