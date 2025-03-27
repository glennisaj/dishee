'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import { getPlacePredictions } from '@/utils/google-places'

interface Prediction {
  id: string
  name: string
  address: string
}

export default function SearchAutocomplete() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceTimeout = useRef<NodeJS.Timeout>()
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)

  // Get user's location on component mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  // Handle input changes with debouncing
  const handleInputChange = (value: string) => {
    setInput(value)
    setError(null)

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Set new timeout
    debounceTimeout.current = setTimeout(async () => {
      if (value.length >= 3) {
        setIsLoading(true)
        try {
          const results = await getPlacePredictions(value)
          setPredictions(results)
        } catch (err) {
          setError('Failed to fetch suggestions')
          setPredictions([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setPredictions([])
      }
    }, 300) // 300ms debounce
  }

  const handleSelectPlace = (prediction: Prediction) => {
    router.push(`/results/${prediction.id}`)
  }

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Search for a restaurant..."
          className="w-full px-4 py-3 pl-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          aria-label="Search restaurants"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-zinc-400" />
          )}
        </div>
      </div>

      {/* Predictions dropdown */}
      {predictions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-zinc-200">
          {predictions.map((prediction) => (
            <button
              key={prediction.id}
              onClick={() => handleSelectPlace(prediction)}
              className="w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="font-medium text-zinc-900">{prediction.name}</div>
              <div className="text-sm text-zinc-500">{prediction.address}</div>
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  )
}
