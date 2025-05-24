interface SearchResultProps {
  prediction: {
    name: string
    address: string
  }
  onSelect: () => void
}

// If '@/lib/utils' does not exist, define cn here
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export function SearchResult({ prediction, onSelect }: SearchResultProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left p-4',
        'active:bg-violet-50', // Touch feedback
        'hover:bg-zinc-50',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500'
      )}
    >
      <div className="font-medium">{prediction.name}</div>
      <div className="text-sm text-zinc-500">{prediction.address}</div>
    </button>
  )
}