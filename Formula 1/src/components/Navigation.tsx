'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, ExternalLink, Trophy, Users, Calendar, Newspaper, Home, Zap } from 'lucide-react'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Drivers', href: '/drivers', icon: Trophy },
    { name: 'Teams', href: '/teams', icon: Users },
    { name: 'Races', href: '/races', icon: Calendar },
    { name: 'News', href: '/news', icon: Newspaper },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-8">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center space-x-2 text-foreground hover:text-red-600 transition-colors duration-200 font-medium"
            >
              <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus-ring"
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleMobileMenu}
            aria-hidden="true"
          />
          
          {/* Mobile Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/images/Logo.png"
                      alt="LightsOut Logo"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold f1-red">LightsOut</h2>
                    <p className="text-xs text-muted-foreground">F1 Hub</p>
                  </div>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  aria-label="Close mobile menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Menu Items */}
              <nav className="flex-1 px-6 py-6">
                <ul className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={toggleMobileMenu}
                          className="group flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 transition-all duration-200 font-medium"
                        >
                          <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* Mobile Menu Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center text-sm text-muted-foreground">
                  <p>Powered by real-time F1 data</p>
                  <div className="flex items-center justify-center mt-2 space-x-1">
                    <Zap className="h-4 w-4 text-red-500" />
                    <span className="text-xs">Live Updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
