import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Flag, Clock, MapPin, ExternalLink, ChevronRight, Trophy, Users, Zap, Target, Search } from 'lucide-react'
import { SeasonSelector } from '@/components/SeasonSelector'
import { RaceCalendarSkeleton } from '@/components/RaceCalendarSkeleton'
import { RaceCalendarClient } from '@/components/RaceCalendarClient'
import { Suspense } from 'react'

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

interface RaceScheduleResponse {
  season: number
  races: Race[]
}

async function getRaceSchedule(season?: string): Promise<RaceScheduleResponse> {
  const url = new URL(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/races/schedule`)
  if (season) {
    url.searchParams.set('season', season)
  }
  
  const res = await fetch(url.toString(), {
    next: { revalidate: 300 } // Revalidate every 5 minutes
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.details || `Failed to fetch race schedule (${res.status})`)
  }
  
  return res.json()
}

function getRaceStatus(raceDate: string): 'upcoming' | 'completed' | 'live' {
  const now = new Date()
  const raceDateObj = new Date(raceDate)
  const timeDiff = raceDateObj.getTime() - now.getTime()
  const daysDiff = timeDiff / (1000 * 3600 * 24)
  
  if (daysDiff < -1) return 'completed'
  if (daysDiff <= 0 && daysDiff >= -1) return 'live'
  return 'upcoming'
}

interface RacesPageProps {
  searchParams: { season?: string }
}

export default async function RacesPage({ searchParams }: RacesPageProps) {
  const selectedSeason = searchParams.season || '2025'
  
  let season, races
  
  try {
    const data = await getRaceSchedule(selectedSeason)
    season = data.season
    races = data.races
  } catch (error) {
    // Return error page if API fails
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            <Calendar className="inline-block w-10 h-10 f1-red mr-3" />
            Race Calendar
          </h1>
          <p className="text-xl text-muted-foreground">
            Unable to load race schedule
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">API Error</CardTitle>
            <CardDescription>
              Unable to fetch race schedule from Jolpica F1 API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Error: {error instanceof Error ? error.message : 'Unknown error'}
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Troubleshooting:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Jolpica F1 API is the successor to Ergast API</li>
                  <li>• API endpoint: https://api.jolpi.ca/ergast/f1/</li>
                  <li>• Try refreshing the page</li>
                  <li>• Check browser console for more details</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalRaces = races.length

  return (
    <Suspense fallback={<RaceCalendarSkeleton />}>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Race Calendar
              </h1>
            </div>
            <div className="space-y-2">
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                {season} Formula 1 World Championship
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{totalRaces} Races Scheduled</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SeasonSelector currentSeason={season} basePath="/races" />
          </div>
        </div>

        {/* Race Calendar with Search */}
        <RaceCalendarClient races={races} season={season} />
      </div>
    </Suspense>
  )
}