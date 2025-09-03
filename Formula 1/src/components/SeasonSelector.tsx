'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronDown, Calendar } from 'lucide-react'

interface SeasonSelectorProps {
  currentSeason: number
}

export function SeasonSelector({ currentSeason }: SeasonSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  // Generate list of available seasons (from 2020 to current year + 1)
  const currentYear = new Date().getFullYear()
  const seasons = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i)

  const handleSeasonChange = (season: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('season', season.toString())
    router.push(`/drivers?${params.toString()}`)
    setIsOpen(false)
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
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2">
            <div className="text-sm font-medium text-gray-700 mb-2">Select Season</div>
            <div className="max-h-60 overflow-y-auto">
              {seasons.map((season) => (
                <button
                  key={season}
                  onClick={() => handleSeasonChange(season)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors ${
                    season === currentSeason ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
