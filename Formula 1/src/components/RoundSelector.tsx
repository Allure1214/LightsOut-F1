'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronDown, Flag } from 'lucide-react'

interface RoundSelectorProps {
  currentSeason: number
  currentRound: string
}

export function RoundSelector({ currentSeason, currentRound }: RoundSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Get the actual number of races for each season
  const getRacesPerSeason = (season: number): number => {
    if (season >= 2024) return 24
    if (season >= 2023) return 22
    if (season >= 2022) return 22
    if (season >= 2021) return 22
    if (season >= 2020) return 17 // COVID-19 shortened season
    if (season >= 2019) return 21
    if (season >= 2018) return 21
    if (season >= 2017) return 20
    if (season >= 2016) return 21
    if (season >= 2015) return 19
    if (season >= 2014) return 19
    if (season >= 2013) return 19
    if (season >= 2012) return 20
    if (season >= 2011) return 19
    if (season >= 2010) return 19
    if (season >= 2009) return 17
    if (season >= 2008) return 18
    if (season >= 2007) return 17
    if (season >= 2006) return 18
    if (season >= 2005) return 19
    if (season >= 2004) return 18
    if (season >= 2003) return 16
    if (season >= 2002) return 17
    if (season >= 2001) return 17
    if (season >= 2000) return 17
    if (season >= 1999) return 16
    if (season >= 1998) return 16
    if (season >= 1997) return 17
    if (season >= 1996) return 16
    if (season >= 1995) return 17
    if (season >= 1994) return 16
    if (season >= 1993) return 16
    if (season >= 1992) return 16
    if (season >= 1991) return 16
    if (season >= 1990) return 16
    if (season >= 1989) return 16
    if (season >= 1988) return 16
    if (season >= 1987) return 16
    if (season >= 1986) return 16
    if (season >= 1985) return 16
    if (season >= 1984) return 16
    if (season >= 1983) return 15
    if (season >= 1982) return 16
    if (season >= 1981) return 15
    if (season >= 1980) return 14
    if (season >= 1979) return 15
    if (season >= 1978) return 16
    if (season >= 1977) return 17
    if (season >= 1976) return 16
    if (season >= 1975) return 14
    if (season >= 1974) return 15
    if (season >= 1973) return 15
    if (season >= 1972) return 12
    if (season >= 1971) return 11
    if (season >= 1970) return 13
    if (season >= 1969) return 11
    if (season >= 1968) return 12
    if (season >= 1967) return 11
    if (season >= 1966) return 9
    if (season >= 1965) return 10
    if (season >= 1964) return 10
    if (season >= 1963) return 10
    if (season >= 1962) return 9
    if (season >= 1961) return 8
    if (season >= 1960) return 10
    if (season >= 1959) return 9
    if (season >= 1958) return 11
    if (season >= 1957) return 8
    if (season >= 1956) return 8
    if (season >= 1955) return 7
    if (season >= 1954) return 9
    if (season >= 1953) return 9
    if (season >= 1952) return 8
    if (season >= 1951) return 8
    if (season >= 1950) return 7
    return 7 // Default fallback
  }

  // Generate list of available rounds based on actual season data
  const allRounds = useMemo(() => {
    const rounds = ['current']
    const racesInSeason = getRacesPerSeason(currentSeason)
    
    // Generate rounds 1 to the actual number of races in that season
    for (let i = 1; i <= racesInSeason; i++) {
      rounds.push(i.toString())
    }
    return rounds
  }, [currentSeason])

  // Filter rounds based on search term
  const filteredRounds = useMemo(() => {
    if (!searchTerm) return allRounds
    return allRounds.filter(round => 
      round.includes(searchTerm) || 
      (round === 'current' && 'current'.includes(searchTerm.toLowerCase()))
    )
  }, [allRounds, searchTerm])

  const handleRoundChange = (round: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Validate round against current season
    const maxRaces = getRacesPerSeason(currentSeason)
    if (round !== 'current' && parseInt(round) > maxRaces) {
      // If round is invalid for this season, reset to 'current'
      params.set('round', 'current')
    } else {
      params.set('round', round)
    }
    
    router.push(`/drivers?${params.toString()}`)
    setIsOpen(false)
    setSearchTerm('') // Clear search when selection is made
  }

  const handleClose = () => {
    setIsOpen(false)
    setSearchTerm('') // Clear search when dropdown closes
  }

  const getRoundDisplayName = (round: string) => {
    if (round === 'current') return 'Current (Latest)'
    return `Round ${round}`
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Flag className="w-4 h-4" />
        {getRoundDisplayName(currentRound)}
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-3">
            <div className="text-sm font-medium text-gray-700 mb-3">
              Select Round ({getRacesPerSeason(currentSeason)} races in {currentSeason})
            </div>
            
            {/* Search input */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search round..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredRounds.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  No rounds found
                </div>
              ) : (
                filteredRounds.map((round) => (
                  <button
                    key={round}
                    onClick={() => handleRoundChange(round)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors ${
                      round === currentRound 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-700'
                    }`}
                  >
                    {getRoundDisplayName(round)}
                  </button>
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
