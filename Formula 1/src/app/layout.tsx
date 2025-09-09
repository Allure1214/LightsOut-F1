import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'LightsOut - Statistics, News & Articles',
  description: 'Comprehensive Formula 1 website featuring real-time statistics, news, and articles',
  keywords: ['Formula 1', 'F1', 'racing', 'statistics', 'news', 'drivers', 'teams'],
  authors: [{ name: 'Formula 1 Website' }],
  openGraph: {
    title: 'LightsOut - Statistics, News & Articles',
    description: 'Comprehensive Formula 1 website featuring real-time statistics, news, and articles',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/Favicon.png" />
        <link rel="apple-touch-icon" href="/images/Favicon.png" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/images/Logo.png"
                      alt="LightsOut Logo"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-bold f1-red leading-tight">LightsOut</h1>
                    <p className="text-sm text-muted-foreground">Statistics, News & Articles</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                  <a href="/" className="text-foreground hover:text-primary transition-colors">
                    Home
                  </a>
                  <a href="/drivers" className="text-foreground hover:text-primary transition-colors">
                    Drivers
                  </a>
                  <a href="/teams" className="text-foreground hover:text-primary transition-colors">
                    Teams
                  </a>
                  <a href="/races" className="text-foreground hover:text-primary transition-colors">
                    Races
                  </a>
                  <a href="/news" className="text-foreground hover:text-primary transition-colors">
                    News
                  </a>
                </div>
              </nav>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t mt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-muted-foreground">
                <p>&copy; 2025 LightsOut Website. All rights reserved.</p>
                <p className="mt-2 text-sm">
                  Data provided by{' '}
                  <a href="https://api.jolpi.ca/ergast/" className="text-primary hover:underline">
                    Jolpica F1 API
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
