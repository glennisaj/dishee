'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { isValidGoogleMapsUrl } from '../../../utils/google-places'

export default function HeroSection() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    // Set initial loading message
    setLoadingMessage(url.includes('maps.app.goo.gl') 
      ? 'Expanding shortened URL...' 
      : 'Processing restaurant...')

    try {
      const { isValid } = isValidGoogleMapsUrl(url)
      
      if (!isValid) {
        setError('Please enter a valid Google Maps URL')
        return
      }

      // Call our API route
      setLoadingMessage('Fetching restaurant details...')
      const response = await fetch('/api/analyze-restaurant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze restaurant')
      }

      const data = await response.json()
      router.push(`/results/${data.restaurantId}`)
    } catch (error) {
      setError('Error processing URL. Please try again.')
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
    }
  }

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-100 to-zinc-50 -z-10"></div>
      
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <div className="inline-block">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-900/10 text-zinc-900 mb-6 inline-block">
            AI-Powered Recommendations
          </span>
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-zinc-900">
          Discover the{" "}
          <span className="relative inline-block">
            best dishes
            <span className="absolute bottom-2 left-0 w-full h-2 bg-zinc-900/20 -z-10 rounded"></span>
          </span>{" "}
          at any restaurant
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-600">
          Stop guessing what to order. Our AI analyzes recent reviews to recommend the most loved dishes at any restaurant.
        </p>

        <div className="mt-10 w-full max-w-md">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Paste Google Maps link"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value)
                    setError(null)
                  }}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    error ? 'border-red-500' : 'border-zinc-200'
                  } focus:outline-none focus:border-zinc-300 text-zinc-900 placeholder:text-zinc-500 disabled:bg-zinc-50 disabled:text-zinc-400`}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-500">
                    {error}
                  </p>
                )}
                {isLoading && loadingMessage && (
                  <p className="mt-2 text-sm text-zinc-600">
                    {loadingMessage}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors disabled:bg-zinc-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Recommend dishes →'
                )}
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-zinc-500">
            Try it with{' '}
            <a href="#" className="underline hover:text-zinc-900 transition-colors">
              this example restaurant
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
