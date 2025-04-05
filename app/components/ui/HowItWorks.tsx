export default function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-violet-600">How It Works</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find the best dishes in three easy steps
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-16 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600">
                  <span className="text-white">1</span>
                </div>
                Search for a Restaurant
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Type the name of any restaurant and select it from the suggestions. Our smart search helps you find the exact place you're looking for.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600">
                  <span className="text-white">2</span>
                </div>
                AI Analysis
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Our AI analyzes hundreds of recent reviews to identify the most recommended dishes at the restaurant.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600">
                  <span className="text-white">3</span>
                </div>
                Get Recommendations
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  See the top dishes with detailed descriptions and real customer quotes to help you order with confidence.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
