export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="space-y-12">
          {/* About Me Section */}
          <section>
            <h1 className="text-4xl font-bold text-zinc-900 mb-8">About Me</h1>
            <p className="text-lg text-zinc-600 leading-relaxed">
              I'm a product manager with a diverse background spanning Fortune 100 companies, 
              high-growth startups, and publicly traded tech organizations. While my professional 
              roots are in data analytics, this project represents my passion for continuous 
              learning and technical exploration.
            </p>
          </section>

          {/* Journey Section */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              The Journey Behind This Project
            </h2>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Everyone has been vibe coding, so I thought I'd join in. 
              Using AI tools like Cursor, Vercel,  and the OpenAI API, I've created this site
              inspired by trends I've observed on social media(Tiktok influencers posting places to eat and what to get), my friends doing the same, and having my own interest in food.
            </p>
          </section>

          {/* Get Involved Section */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              Get Involved
            </h2>
            <p className="text-lg text-zinc-600 mb-6">
              I'm always eager to improve and evolve this project. If you have:
            </p>
            <ul className="list-disc list-inside text-zinc-600 space-y-2 mb-6">
              <li>Suggestions for site enhancements</li>
              <li>Interesting perspectives on the product</li>
              <li>Potential collaboration opportunities</li>
            </ul>
            <p className="text-lg text-zinc-600 mb-8">
              Feel free to reach out to me at{' '}
              <a 
                href="mailto:dishee.ai.founder@gmail.com"
                className="text-violet-600 hover:text-violet-700 transition-colors"
              >
                dishee.ai.founder@gmail.com
              </a>
            </p>

            <div className="mt-8 p-6 bg-violet-50 rounded-xl">
              <p className="text-lg text-violet-900 font-medium">
                To any hiring managers who are looking for PMs:{' '}
                <span className="text-violet-700">
                  If you find this project intriguing, I'm open to conversations about 
                  potential opportunities.
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
