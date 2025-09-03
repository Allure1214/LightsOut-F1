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

  // Generate list of available rounds (1-24, with "current" as default)
  const allRounds = useMemo(() => {
    const rounds = ['current']
    // Most F1 seasons have 16-24 races, so we'll generate up to 24
    for (let i = 1; i <= 24; i++) {
      rounds.push(i.toString())
    }
    return rounds
  }, [])

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
    params.set('round', round)
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
            <div className="text-sm font-medium text-gray-700 mb-3">Select Round</div>
            
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
