import { Loader2 } from 'lucide-react'

const steps = [
  { id: 1, text: 'Fetching restaurant reviews...' },
  { id: 2, text: 'Analyzing sentiment...' },
  { id: 3, text: 'Identifying top dishes...' },
  { id: 4, text: 'Generating recommendations...' }
]

export function LoadingState() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-lg mx-auto px-4">
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-black" />
        </div>
        
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center justify-center space-x-2 text-lg font-medium text-zinc-600"
            >
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
              </div>
              <span>{step.text}</span>
            </div>
          ))}
        </div>

        <p className="text-zinc-500">
          This may take a few moments...
        </p>
      </div>
    </div>
  )
}
