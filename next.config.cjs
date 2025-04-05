module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'your-domain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST' }
        ]
      }
    ]
  }
} 