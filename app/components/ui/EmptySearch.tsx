export function EmptySearch() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Search className="w-12 h-12 text-zinc-300 mb-4" />
      <p className="text-zinc-500 text-center">
        No results found. Try a different search term.
      </p>
    </div>
  )
}
