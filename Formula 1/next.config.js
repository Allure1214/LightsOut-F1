/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'www.formula1.com',
      'cdn-1.motorsport.com',
      'www.racefans.net'
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/ergast/:path*',
        destination: 'http://ergast.com/api/f1/:path*',
      },
    ]
  },
}

module.exports = nextConfig
