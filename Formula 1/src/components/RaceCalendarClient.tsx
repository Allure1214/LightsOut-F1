'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { RaceCard } from './RaceCard'
import { RaceSearch } from './RaceSearch'

interface Session {
  name: string
  type: 'practice' | 'qualifying' | 'sprint' | 'race'
  date: string
  time: string
  day: string
  order: number
}

interface Race {
  round: number
  raceName: string
  date: string
  time?: string
  circuit: {
    circuitId: string
    circuitName: string
    country: string
    locality?: string
    lat?: number
    lng?: number
    url?: string
  }
  url?: string
  sessions?: Session[]
}

interface RaceCalendarClientProps {
  races: Race[]
  season: number
}

export function RaceCalendarClient({ races, season }: RaceCalendarClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter races based on search query
  const filteredRaces = useMemo(() => {
    if (!searchQuery.trim()) return races

    const query = searchQuery.toLowerCase()
    return races.filter(race => {
      const raceName = race.raceName.toLowerCase()
      const circuitName = race.circuit.circuitName.toLowerCase()
      const country = race.circuit.country.toLowerCase()
      const locality = race.circuit.locality?.toLowerCase() || ''
      
      return (
        raceName.includes(query) ||
        circuitName.includes(query) ||
        country.includes(query) ||
        locality.includes(query)
      )
    })
  }, [races, searchQuery])

  const upcomingRaces = filteredRaces.filter(race => {
    const now = new Date()
    const raceDate = new Date(race.date)
    return raceDate >= now
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const completedRaces = filteredRaces.filter(race => {
    const now = new Date()
    const raceDate = new Date(race.date)
    return raceDate < now
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const totalRaces = filteredRaces.length
  const completedCount = completedRaces.length
  const upcomingCount = upcomingRaces.length

  return (
    <div className="space-y-8">
      {/* Search Section - Always Visible */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <RaceSearch onSearch={setSearchQuery} />
        </div>
      </div>
      {searchQuery && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Found {totalRaces} race{totalRaces !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
        </div>
      )}

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{totalRaces}</div>
          <div className="text-sm text-muted-foreground">Total Races</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{upcomingCount}</div>
          <div className="text-sm text-muted-foreground">Upcoming</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {new Set(filteredRaces.map(r => r.circuit.country)).size}
          </div>
          <div className="text-sm text-muted-foreground">Countries</div>
        </div>
      </div>

      {/* Upcoming Races */}
      {upcomingRaces.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Upcoming Races</h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {upcomingRaces.length} races
            </Badge>
          </div>
          <div className="grid gap-6">
            {upcomingRaces.map((race) => (
              <RaceCard key={race.round} race={race} status="upcoming" />
            ))}
          </div>
        </div>
      )}

      {/* Completed Races */}
      {completedRaces.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Completed Races</h2>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {completedRaces.length} races
            </Badge>
          </div>
          <div className="grid gap-6">
            {completedRaces.map((race) => (
              <RaceCard key={race.round} race={race} status="completed" />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchQuery && filteredRaces.length === 0 && (
        <div className="text-center py-12">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No races found</h3>
            <p className="text-muted-foreground">
              No races match your search for "{searchQuery}". Try searching for:
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['Monaco', 'Silverstone', 'Spa', 'Monza', 'Brazil', 'Australia'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
