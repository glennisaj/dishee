'use client'
import { useIsMobile } from '../../hooks/useIsMobile'
import SearchAutocomplete from './SearchAutocomplete'

export default function HeroSection() {
  const isMobile = useIsMobile()

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-zinc-900">
            Find the best dishes at any restaurant
          </h1>
          <p className="mx-auto max-w-[700px] text-zinc-900 font-semibold md:text-xl">
            Search for a restaurant and discover their most recommended dishes based on real customer reviews.
          </p>
          {!isMobile && (
            <div className="w-full max-w-3xl mx-auto mt-6">
              <SearchAutocomplete isSticky={false} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
