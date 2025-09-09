import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Flag, Calendar, ChevronDown, Medal, TrendingUp, Users, Award, ExternalLink, Star, Zap } from 'lucide-react'
import { SeasonSelector } from '@/components/SeasonSelector'
import { RoundSelector } from '@/components/RoundSelector'
import { PointsSystemInfo } from '@/components/PointsSystemInfo'
import { DriverStandingsSkeleton } from '@/components/DriverStandingsSkeleton'
import { DriverStandingsTable } from '@/components/DriverStandingsTable'
import { Suspense } from 'react'

interface DriverStanding {
  position: number
  positionText: string
  points: number
  wins: number
  driver: {
    driverId: string
    code?: string
    firstName: string
    lastName: string
    nationality: string
    dateOfBirth?: string
    url?: string
  }
  team: {
    teamId: string
    name: string
    nationality?: string
    url?: string
  }
}

interface DriverStandingsResponse {
  season: number
  round: string
  standings: DriverStanding[]
  note?: string
}

async function getDriverStandings(season?: string, round?: string): Promise<DriverStandingsResponse> {
  const url = new URL(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/drivers/standings`)
  if (season) {
    url.searchParams.set('season', season)
  }
  if (round) {
    url.searchParams.set('round', round)
  }
  
  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 } // Revalidate every hour
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.details || `Failed to fetch driver standings (${res.status})`)
  }
  
  return res.json()
}




// Get the actual number of races for each season (same as RoundSelector)
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

interface DriversPageProps {
  searchParams: { season?: string; round?: string }
}

export default async function DriversPage({ searchParams }: DriversPageProps) {
  const selectedSeason = searchParams.season || '2025'
  let selectedRound = searchParams.round || 'current'
  
  // Validate round against season - if round is higher than races in season, reset to 'current'
  const seasonNum = parseInt(selectedSeason)
  const maxRaces = getRacesPerSeason(seasonNum)
  if (selectedRound !== 'current' && parseInt(selectedRound) > maxRaces) {
    selectedRound = 'current'
  }
  
  let season: number, round: string, standings: DriverStanding[], note: string | undefined
  
  try {
    const data = await getDriverStandings(selectedSeason, selectedRound)
    season = data.season
    round = data.round
    standings = data.standings
    note = data.note
  } catch (error) {
    // Return error page if API fails
    return (
      <div className="min-h-screen driver-page">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            <Trophy className="inline-block w-10 h-10 f1-red mr-3" />
            Driver Standings
          </h1>
          <p className="text-xl text-muted-foreground">
            Unable to load current standings
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">API Error</CardTitle>
            <CardDescription>
              Unable to fetch driver standings from Jolpica F1 API
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen driver-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<DriverStandingsSkeleton />}>
          <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Driver Standings
              </h1>
            </div>
            <div className="space-y-2">
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                {season} Formula 1 World Championship
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Round {round === 'current' ? 'Latest' : round}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SeasonSelector currentSeason={season} />
            <RoundSelector currentSeason={season} currentRound={round} />
            {note && (
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                {note}
              </Badge>
            )}
          </div>
        </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="text-2xl font-bold text-red-600">{standings.length}</div>
          <div className="text-sm text-muted-foreground">Drivers</div>
        </Card>
        <Card className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {new Set(standings.map(s => s.team.teamId)).size}
          </div>
          <div className="text-sm text-muted-foreground">Teams</div>
        </Card>
        <Card className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {standings.reduce((sum, s) => sum + s.wins, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Wins</div>
        </Card>
        <Card className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">
            {standings.reduce((sum, s) => sum + s.points, 0).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Total Points</div>
        </Card>
      </div>

      {/* Enhanced Standings Table */}
      <DriverStandingsTable standings={standings} round={round} />

      {/* Enhanced Championship Info */}
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
                <span className="text-sm text-muted-foreground">Total Drivers:</span>
                <span className="font-bold text-lg text-blue-600">{standings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Teams:</span>
                <span className="font-bold text-lg text-blue-600">
                  {new Set(standings.map(s => s.team.teamId)).size}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Championship Leader
            </CardTitle>
          </CardHeader>
          <CardContent>
            {standings.length > 0 && (
              <div className="text-center space-y-2">
                <div className="text-xl font-bold text-yellow-800">
                  {standings[0].driver.firstName} {standings[0].driver.lastName}
                </div>
                <div className="text-sm text-yellow-700">
                  {standings[0].team.name}
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {standings[0].points.toLocaleString()} pts
                </div>
                <div className="text-xs text-yellow-600 font-medium">
                  {standings[0].wins} wins
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Podium Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Podium Finishers:</span>
                <span className="font-bold text-lg text-green-600">
                  {standings.filter(s => s.position <= 3).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Points Scorers:</span>
                <span className="font-bold text-lg text-green-600">
                  {standings.filter(s => s.points > 0).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Race Winners:</span>
                <span className="font-bold text-lg text-green-600">
                  {standings.filter(s => s.wins > 0).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Wins:</span>
                <span className="font-bold text-lg text-green-600">
                  {standings.reduce((sum, s) => sum + s.wins, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Points:</span>
                <span className="font-bold text-lg text-green-600">
                  {Math.round(standings.reduce((sum, s) => sum + s.points, 0) / standings.length)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Points System Information */}
        <PointsSystemInfo season={season} />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
