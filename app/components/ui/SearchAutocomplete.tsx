'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, X } from 'lucide-react'

interface SimplePrediction {
  id: string
  name: string
  address: string
}

export default function SearchAutocomplete() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [predictions, setPredictions] = useState<SimplePrediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debounceTimeout = useRef<NodeJS.Timeout>()
  const inputRef = useRef<HTMLInputElement>(null)

  const searchPlaces = async (query: string) => {
    try {
      // Get user's location
      const position = await getCurrentPosition()
      
      const response = await fetch(
        `/api/debug/places-search?query=${encodeURIComponent(query)}&lat=${position.latitude}&lng=${position.longitude}`
      )
      const data = await response.json()

      if (data.places) {
        return data.places.map((place: any) => ({
          id: place.id,
          name: place.displayName?.text || 'Unknown',
          address: place.formattedAddress || ''
        }))
      }
      return []
    } catch (error) {
      console.error('Search error:', error)
      return []
    }
  }

  // Get user's location
  const getCurrentPosition = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        resolve({ latitude: 0, longitude: 0 }) // Default if geolocation not available
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        () => {
          resolve({ latitude: 0, longitude: 0 }) // Default if user denies permission
        }
      )
    })
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    if (value.length < 3) {
      setPredictions([])
      return
    }

    setIsLoading(true)
    debounceTimeout.current = setTimeout(async () => {
      const results = await searchPlaces(value)
      setPredictions(results)
      setIsLoading(false)
    }, 300)
  }

  const clearInput = () => {
    setInput('')
    setPredictions([])
    inputRef.current?.focus()
  }

  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-zinc-200 px-4 py-3 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-3xl mx-auto">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Search for a restaurant..."
            className="w-full px-4 py-3 pl-12 pr-10 text-base font-bold 
              text-zinc-900 placeholder:text-zinc-900 placeholder:font-semibold 
              bg-white/90 border border-zinc-200 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent 
              transition-all duration-200 sm:py-4"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-zinc-400" />
            )}
          </div>
          {input && (
            <button
              onClick={clearInput}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {predictions.length > 0 && (
          <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-zinc-200 max-h-[60vh] overflow-y-auto">
            {predictions.map((place) => (
              <button
                key={place.id}
                onClick={() => {
                  router.push(`/results/${place.id}`)
                  setPredictions([])
                  setInput('')
                }}
                className="w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors duration-150"
              >
                <div className="font-bold text-zinc-900">{place.name}</div>
                <div className="text-sm text-zinc-600">{place.address}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}