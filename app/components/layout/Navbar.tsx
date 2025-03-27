import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          Dishee
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}