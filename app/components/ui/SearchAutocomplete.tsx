'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, MapPin, X, ArrowLeft } from 'lucide-react'
import { getPlacePredictions } from '@/utils/google-places'
import Image from 'next/image'
import { getLocationFromIP } from '@/utils/geolocation'
import { type Prediction } from '@/types/places'
import { useIsMobile } from '../../hooks/useIsMobile'
import { cn } from '../../lib/utils'

interface Prediction {
  placeId: string
  name: string
  address: string
}

interface SearchAutocompleteProps {
  isSticky?: boolean
}

export default function SearchAutocomplete({ isSticky = false }: SearchAutocompleteProps) {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const isMobile = useIsMobile()
  const router = useRouter()
  const [input, setInput] = useState('')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceTimeout = useRef<NodeJS.Timeout | undefined>()
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const componentRef = useRef<HTMLDivElement>(null) // Add ref for the component
  const inputRef = useRef<HTMLInputElement>(null) // Add input ref

  // Handle clicks outside the component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setPredictions([]) // Clear predictions when clicking outside
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Updated location detection with fallback
  useEffect(() => {
    const getLocation = async () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            })
            setLocationError(null)
          },
          async (error) => {
            console.log('Falling back to IP-based location')
            try {
              const ipLocation = await getLocationFromIP()
              setUserLocation(ipLocation)
              setLocationError(null)
            } catch (err) {
              setLocationError("Using default location")
              setUserLocation({
                lat: 40.7128,
                lng: -74.0060
              })
            }
          }
        )
      } else {
        // Browser doesn't support geolocation, use IP-based
        const ipLocation = await getLocationFromIP()
        setUserLocation(ipLocation)
      }
    }

    getLocation()
  }, [])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    setError(null)

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    if (value.length < 3) {
      setPredictions([])
      return
    }

    setIsLoading(true)
    debounceTimeout.current = setTimeout(async () => {
      try {
        // Use the imported getPlacePredictions function directly
        const results = await getPlacePredictions(value, userLocation || undefined)
        setPredictions(results)
        setError(null)
      } catch (err) {
        console.error('Search error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch suggestions')
        setPredictions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }

  const handleSelectPlace = (prediction: Prediction) => {
    router.push(`/results/${prediction.placeId}`)
    setPredictions([]) // Clear predictions after selection
    setInput('') // Optional: clear input after selection
  }

  const handleClearSearch = () => {
    setInput('')
    setPredictions([])
    inputRef.current?.focus() // Return focus to input after clearing
  }

  // Handle back navigation on mobile
  const handleBack = () => {
    setIsSearchActive(false)
    setInput('')
    setPredictions([])
  }

  return (
    <div ref={componentRef} className={cn(
      'relative w-full max-w-3xl mx-auto',
      isSticky && isMobile && 'sticky top-0 left-0 w-full bg-white z-[9999] border-b border-zinc-200'
    )}>
      {/* Back button when search is active on mobile */}
      {isMobile && isSearchActive && (
        <button 
          onClick={handleBack}
          className="absolute left-4 top-4 p-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}
      
      <div className={cn(
        'relative',
        isMobile && 'px-4 py-2'
      )}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onFocus={() => setIsSearchActive(true)}
          placeholder={isMobile ? "Search restaurants..." : "Search for a restaurant..."}
          className={cn(
            'w-full px-4 py-5',
            'pl-14',
            'pr-10',
            'text-base font-semibold',
            'text-zinc-900',
            'bg-white',
            'border border-zinc-200',
            'rounded-lg shadow-sm',
            'focus:outline-none focus:border-violet-500',
            'focus:ring-1 focus:ring-violet-500',
            'placeholder:text-zinc-900',
            'placeholder:font-semibold',
            isMobile && isSticky && 'rounded-none border-0 shadow-none'
          )}
        />

        <div className="absolute inset-y-0 left-0 flex items-center pl-5">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-zinc-400" />
          )}
        </div>

        {input && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3 group"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-zinc-400 hover:text-zinc-600 transition-colors" />
          </button>
        )}
      </div>

      {locationError && (
        <div className="mt-2 flex items-center text-sm text-amber-600">
          <MapPin className="w-4 h-4 mr-1" />
          {locationError}
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}

      {predictions.length > 0 && (
        <div className={cn(
          'absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-zinc-200',
          isMobile && 'fixed left-0 right-0 mt-0'
        )}>
          {predictions.map((prediction) => (
            <button
              key={prediction.placeId}
              onClick={() => handleSelectPlace(prediction)}
              className={cn(
                'w-full px-4 py-3 text-left',
                'hover:bg-zinc-50',
                'transition-colors',
                'first:rounded-t-lg last:rounded-b-lg'
              )}
            >
              <div className="font-semibold text-zinc-900">
                {prediction.name}
              </div>
              <div className="text-sm font-medium text-zinc-600">
                {prediction.address}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}