/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'www.formula1.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-1.motorsport.com',
      },
      {
        protocol: 'https',
        hostname: 'www.racefans.net',
      },
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
