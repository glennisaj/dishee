'use client'
import { useIsMobile } from '../../hooks/useIsMobile'
import SearchAutocomplete from './SearchAutocomplete'

export default function MobileHeader() {
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-zinc-200">
      <div className="px-4 py-2">
        <SearchAutocomplete isSticky={true} />
      </div>
    </header>
  )
}
