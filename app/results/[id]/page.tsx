import { getPlaceDetails } from '../../../utils/google-places'

interface ResultsPageProps {
  params: {
    id: string
  }
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await Promise.resolve(params)
  
  try {
    const details = await getPlaceDetails(id)

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{details.name}</h1>
        <p className="text-zinc-600 mb-4">{details.address}</p>
        <div className="flex items-center mb-6">
          <span className="text-zinc-900 font-semibold">Rating: {details.rating}</span>
          <span className="mx-2">•</span>
          <span className="text-zinc-600">{details.reviews.length} reviews</span>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Reviews</h2>
          {details.reviews.map((review, index) => (
            <div key={index} className="border-b border-zinc-200 pb-4">
              <div className="flex items-center mb-2">
                <span className="text-zinc-900">Rating: {review.rating}/5</span>
                <span className="mx-2">•</span>
                <span className="text-zinc-500 text-sm">{review.time}</span>
              </div>
              <p className="text-zinc-600">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Error loading restaurant details
        </h1>
        <p className="text-zinc-600">
          Unable to fetch details for this restaurant. Please try again later.
        </p>
      </div>
    )
  }
}
