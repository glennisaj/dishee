const fetch = require('node-fetch')

async function testApiKeySecurity() {
  console.log('\n🔑 Testing API Key Security...\n')

  // 1. Test client-side exposure
  console.log('1️⃣ Testing for exposed API keys in HTML/JS...')
  try {
    const response = await fetch('http://localhost:3000')
    const html = await response.text()
    
    const sensitiveTerms = [
      'GOOGLE_PLACES_API_KEY',
      'NEXT_PUBLIC_GOOGLE_PLACES_API_KEY',
      'places.googleapis.com/v1/places',
      'X-Goog-Api-Key'
    ]

    const exposures = sensitiveTerms.filter(term => html.includes(term))
    if (exposures.length > 0) {
      console.log('⚠️ WARNING: Potentially exposed sensitive terms found:')
      exposures.forEach(term => console.log(`- ${term}`))
    } else {
      console.log('✅ No API keys exposed in HTML/JS')
    }
  } catch (error) {
    console.error('Error testing HTML:', error)
  }

  // 2. Test API endpoint security
  console.log('\n2️⃣ Testing API endpoints for key exposure...')
  const endpoints = [
    '/api/debug/places-search?query=test',
    '/api/places/search?query=test',
    // Add other API endpoints here
  ]

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`)
      const data = await response.text()
      
      if (data.includes('places.googleapis.com')) {
        console.log(`⚠️ WARNING: Google Places API URL exposed in ${endpoint}`)
      }
      if (data.includes('key=')) {
        console.log(`⚠️ WARNING: API key might be exposed in ${endpoint}`)
      }
    } catch (error) {
      console.log(`Error testing ${endpoint}:`, error)
    }
  }

  // 3. Check environment variables
  console.log('\n3️⃣ Checking environment variables...')
  const publicEnvVars = Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'))
  if (publicEnvVars.includes('NEXT_PUBLIC_GOOGLE_PLACES_API_KEY')) {
    console.log('⚠️ WARNING: Google Places API key is exposed as NEXT_PUBLIC')
  } else {
    console.log('✅ No sensitive API keys exposed in public environment variables')
  }

  console.log('\n🏁 API Security Test Complete!\n')
}

// Run the test
testApiKeySecurity().catch(console.error)
