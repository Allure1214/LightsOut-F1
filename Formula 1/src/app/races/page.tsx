import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Flag, Clock, MapPin, ExternalLink, ChevronRight, Trophy, Users, Zap, Target } from 'lucide-react'
import { SeasonSelector } from '@/components/SeasonSelector'
import { RaceCalendarSkeleton } from '@/components/RaceCalendarSkeleton'
import { RaceCard } from '@/components/RaceCard'
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

// Get the actual number of races for each season
function getRacesPerSeason(season: number): number {
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

function getRaceStatus(raceDate: string): 'upcoming' | 'completed' | 'live' {
  const now = new Date()
  const raceDateObj = new Date(raceDate)
  const timeDiff = raceDateObj.getTime() - now.getTime()
  const daysDiff = timeDiff / (1000 * 3600 * 24)
  
  if (daysDiff < -1) return 'completed'
  if (daysDiff <= 0 && daysDiff >= -1) return 'live'
  return 'upcoming'
}

function getUpcomingRaces(races: Race[]): Race[] {
  const now = new Date()
  return races.filter(race => {
    const raceDate = new Date(race.date)
    return raceDate >= now
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function getCompletedRaces(races: Race[]): Race[] {
  const now = new Date()
  return races.filter(race => {
    const raceDate = new Date(race.date)
    return raceDate < now
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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

  const upcomingRaces = getUpcomingRaces(races)
  const completedRaces = getCompletedRaces(races)
  const totalRaces = races.length
  const completedCount = completedRaces.length
  const upcomingCount = upcomingRaces.length

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

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="text-2xl font-bold text-red-600">{totalRaces}</div>
            <div className="text-sm text-muted-foreground">Total Races</div>
          </Card>
          <Card className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
          <Card className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{upcomingCount}</div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </Card>
          <Card className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">
              {new Set(races.map(r => r.circuit.country)).size}
            </div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </Card>
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

        {/* Season Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Season Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Season:</span>
                  <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                    {season}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Races:</span>
                  <span className="font-bold text-lg text-blue-600">{totalRaces}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Countries:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {new Set(races.map(r => r.circuit.country)).size}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-600" />
                Race Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed:</span>
                  <span className="font-bold text-lg text-green-600">{completedCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Remaining:</span>
                  <span className="font-bold text-lg text-green-600">{upcomingCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Progress:</span>
                  <span className="font-bold text-lg text-green-600">
                    {totalRaces > 0 ? Math.round((completedCount / totalRaces) * 100) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-yellow-600" />
                Circuit Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Unique Circuits:</span>
                  <span className="font-bold text-lg text-yellow-600">
                    {new Set(races.map(r => r.circuit.circuitId)).size}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Countries:</span>
                  <span className="font-bold text-lg text-yellow-600">
                    {new Set(races.map(r => r.circuit.country)).size}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Races per Country:</span>
                  <span className="font-bold text-lg text-yellow-600">
                    {totalRaces > 0 ? (totalRaces / new Set(races.map(r => r.circuit.country)).size).toFixed(1) : 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  )
}
