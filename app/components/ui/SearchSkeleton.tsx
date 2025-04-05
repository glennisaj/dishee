export function SearchSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-zinc-100 rounded-lg mb-2" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-zinc-100 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
