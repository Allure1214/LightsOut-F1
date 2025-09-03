import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Flag, Calendar, ChevronDown } from 'lucide-react'
import { SeasonSelector } from '@/components/SeasonSelector'
import { RoundSelector } from '@/components/RoundSelector'
import { PointsSystemInfo } from '@/components/PointsSystemInfo'

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

function getPositionColor(position: number): string {
  if (position === 1) return 'text-yellow-600 bg-yellow-100'
  if (position === 2) return 'text-gray-600 bg-gray-100'
  if (position === 3) return 'text-amber-600 bg-amber-100'
  if (position <= 10) return 'text-blue-600 bg-blue-100'
  return 'text-gray-500 bg-gray-50'
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
  const selectedSeason = searchParams.season || '2024'
  let selectedRound = searchParams.round || 'current'
  
  // Validate round against season - if round is higher than races in season, reset to 'current'
  const seasonNum = parseInt(selectedSeason)
  const maxRaces = getRacesPerSeason(seasonNum)
  if (selectedRound !== 'current' && parseInt(selectedRound) > maxRaces) {
    selectedRound = 'current'
  }
  
  let season, round, standings, note
  
  try {
    const data = await getDriverStandings(selectedSeason, selectedRound)
    season = data.season
    round = data.round
    standings = data.standings
    note = data.note
  } catch (error) {
    // Return error page if API fails
    return (
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
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">
          <Trophy className="inline-block w-10 h-10 f1-red mr-3" />
          Driver Standings
        </h1>
        <p className="text-xl text-muted-foreground">
          {season} Formula 1 World Championship
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <SeasonSelector currentSeason={season} />
          <RoundSelector currentSeason={season} currentRound={round} />
          {note && (
            <Badge variant="secondary" className="text-xs">
              {note}
            </Badge>
          )}
        </div>
      </div>

      {/* Standings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Championship Standings</CardTitle>
          <CardDescription>
            Points and positions after the latest race
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Pos</th>
                  <th className="text-left p-3 font-semibold">Driver</th>
                  <th className="text-left p-3 font-semibold">Team</th>
                  <th className="text-center p-3 font-semibold">Points</th>
                  <th className="text-center p-3 font-semibold">Wins</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((standing) => (
                  <tr key={standing.driver.driverId} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <Badge 
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${getPositionColor(standing.position)}`}
                      >
                        {standing.position}
                      </Badge>
                    </td>
                                         <td className="p-3">
                       <div>
                         <div className="font-semibold">
                           {standing.driver.firstName} {standing.driver.lastName}
                         </div>
                         <div className="text-sm text-muted-foreground flex items-center gap-1">
                           <Flag className="w-3 h-3" />
                           {standing.driver.nationality}
                           {standing.driver.code && (
                             <Badge variant="outline" className="ml-2 text-xs">
                               {standing.driver.code}
                             </Badge>
                           )}
                         </div>
                       </div>
                     </td>
                    <td className="p-3">
                      <div className="font-medium">{standing.team.name}</div>
                      {standing.team.nationality && (
                        <div className="text-sm text-muted-foreground">
                          {standing.team.nationality}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="text-2xl font-bold f1-red">
                        {standing.points}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="text-lg font-semibold">
                        {standing.wins}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Championship Info */}
      <div className="grid md:grid-cols-2 gap-6">

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Season Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Season:</span>
                <span className="font-semibold">{season}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Drivers:</span>
                <span className="font-semibold">{standings.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Teams:</span>
                <span className="font-semibold">
                  {new Set(standings.map(s => s.team.teamId)).size}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Championship Leader</CardTitle>
          </CardHeader>
          <CardContent>
            {standings.length > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold f1-red mb-2">
                  {standings[0].driver.firstName} {standings[0].driver.lastName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {standings[0].team.name}
                </div>
                <div className="text-lg font-semibold mt-2">
                  {standings[0].points} points
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Points System Information */}
      <PointsSystemInfo season={season} />
    </div>
  )
}
