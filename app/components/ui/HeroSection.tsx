'use client'
import SearchAutocomplete from '@/app/components/ui/SearchAutocomplete'

export default function HeroSection() {
  return (
    <section className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
            Find the best dishes at any restaurant
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Search for a restaurant and discover their most recommended dishes based on real customer reviews.
          </p>
          <div className="mt-10">
            <SearchAutocomplete />
          </div>
        </div>
      </div>
    </section>
  )
}
