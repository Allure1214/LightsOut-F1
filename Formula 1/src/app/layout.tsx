import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Zap, Github, Twitter, Mail, ExternalLink, Trophy, Users, Calendar, Newspaper } from 'lucide-react'
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/images/Favicon.png" />
        <link rel="apple-touch-icon" href="/images/Favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {/* Enhanced Header */}
          <header className="sticky top-0 z-40 w-full border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex items-center justify-between h-16 lg:h-20">
                {/* Logo and Brand */}
                <Link href="/" className="group flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
                  <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                    <Image
                      src="/images/Logo.png"
                      alt="LightsOut Logo"
                      width={56}
                      height={56}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-xl lg:text-2xl font-bold f1-red leading-tight group-hover:text-red-600 transition-colors duration-200">
                      LightsOut
                    </h1>
                    <p className="text-xs lg:text-sm text-muted-foreground group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                      F1 Statistics & News
                    </p>
                  </div>
                </Link>

                {/* Navigation */}
                <Navigation />
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Enhanced Footer */}
          <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                {/* Brand Section */}
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="/images/Logo.png"
                        alt="LightsOut Logo"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold f1-red">LightsOut</h3>
                      <p className="text-sm text-gray-400">Formula 1 Hub</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                    Your ultimate destination for real-time Formula 1 statistics, breaking news, and comprehensive analysis. 
                    Experience the pinnacle of motorsport data.
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Zap className="h-4 w-4 text-red-500" />
                    <span>Powered by live F1 data</span>
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/drivers" className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center group">
                        <Trophy className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        Driver Standings
                      </Link>
                    </li>
                    <li>
                      <Link href="/teams" className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center group">
                        <Users className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        Team Standings
                      </Link>
                    </li>
                    <li>
                      <Link href="/races" className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center group">
                        <Calendar className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        Race Calendar
                      </Link>
                    </li>
                    <li>
                      <Link href="/news" className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center group">
                        <Newspaper className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        Latest News
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Resources</h4>
                  <ul className="space-y-3">
                    <li>
                      <a 
                        href="https://api.jolpi.ca/ergast/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center group"
                      >
                        <ExternalLink className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        Jolpica F1 API
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://openf1.org/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center group"
                      >
                        <ExternalLink className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        OpenF1 Data
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://f1api.dev/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center group"
                      >
                        <ExternalLink className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        F1 API Dev
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer Bottom */}
              <div className="border-t border-gray-700 mt-8 pt-8">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-center sm:text-left text-gray-400 text-sm">
                    <p>&copy; 2025 LightsOut. All rights reserved.</p>
                    <p className="mt-1">Formula 1 data and statistics platform</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <a 
                      href="https://github.com/Allure1214/LightsOut-F1" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                      aria-label="GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a 
                      href="mailto:contact@lightsout.com" 
                      className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                      aria-label="Email"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
