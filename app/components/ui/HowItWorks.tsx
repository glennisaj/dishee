export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Paste a link",
      description: "Enter any Google Maps restaurant link to get started with your culinary exploration"
    },
    {
      number: "2",
      title: "AI analysis",
      description: "Our AI scans recent reviews to find the most mentioned and highly rated dishes"
    },
    {
      number: "3",
      title: "Get recommendations",
      description: "See the top dishes with context about why they're loved by other diners"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4 text-center">How it works</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Three simple steps to discover the best dishes at any restaurant
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-24 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gray-200 -z-10"></div>

          {steps.map((step) => (
            <div key={step.number} className="bg-white p-8 border border-gray-200 rounded-lg hover:border-gray-300 transition-all hover:shadow-md">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/10 text-black mb-6 ring-4 ring-white">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
