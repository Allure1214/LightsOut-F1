'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronDown, Calendar, Search } from 'lucide-react'

interface SeasonSelectorProps {
  currentSeason: number
}

export function SeasonSelector({ currentSeason }: SeasonSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Generate list of available seasons (from 1950 to current year + 1)
  // F1 World Championship officially started in 1950
  const currentYear = new Date().getFullYear()
  const allSeasons = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i)

  // Filter seasons based on search term
  const filteredSeasons = useMemo(() => {
    if (!searchTerm) return allSeasons
    return allSeasons.filter(season => 
      season.toString().includes(searchTerm)
    )
  }, [allSeasons, searchTerm])

  // Group seasons by decades for better organization
  const groupedSeasons = useMemo(() => {
    const groups: { [key: string]: number[] } = {}
    filteredSeasons.forEach(season => {
      const decade = Math.floor(season / 10) * 10
      const decadeKey = `${decade}s`
      if (!groups[decadeKey]) {
        groups[decadeKey] = []
      }
      groups[decadeKey].push(season)
    })
    return groups
  }, [filteredSeasons])

  const handleSeasonChange = (season: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('season', season.toString())
    router.push(`/drivers?${params.toString()}`)
    setIsOpen(false)
    setSearchTerm('') // Clear search when selection is made
  }

  const handleClose = () => {
    setIsOpen(false)
    setSearchTerm('') // Clear search when dropdown closes
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        Season {currentSeason}
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-3">
            <div className="text-sm font-medium text-gray-700 mb-3">Select Season (1950-{currentYear})</div>
            
            {/* Search input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="max-h-80 overflow-y-auto">
              {Object.keys(groupedSeasons).length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  No seasons found
                </div>
              ) : (
                Object.entries(groupedSeasons)
                  .sort(([a], [b]) => b.localeCompare(a)) // Sort decades in descending order
                  .map(([decade, seasons]) => (
                    <div key={decade} className="mb-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 px-2">
                        {decade}
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {seasons
                          .sort((a, b) => b - a) // Sort years in descending order within decade
                          .map((season) => (
                            <button
                              key={season}
                              onClick={() => handleSeasonChange(season)}
                              className={`px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors ${
                                season === currentSeason 
                                  ? 'bg-blue-100 text-blue-700 font-medium' 
                                  : 'text-gray-700'
                              }`}
                            >
                              {season}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={handleClose}
        />
      )}
    </div>
  )
}
