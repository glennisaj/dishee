interface ResultsPageProps {
  params: {
    id: string
  }
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  // In the future, we'll fetch restaurant data here
  const restaurantId = params.id

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Analyzing restaurant...
      </h1>
      <p className="text-zinc-600">
        Restaurant ID: {restaurantId}
      </p>
      {/* We'll add the actual results display here later */}
    </div>
  )
}
