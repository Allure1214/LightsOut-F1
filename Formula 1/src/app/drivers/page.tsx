import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Flag, Calendar } from 'lucide-react'

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

async function getDriverStandings(): Promise<DriverStandingsResponse> {
  const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/drivers/standings`, {
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

function getNationalityFlag(nationality: string): string {
  const flags: { [key: string]: string } = {
    'British': '🇬🇧',
    'Dutch': '🇳🇱',
    'Spanish': '🇪🇸',
    'Monégasque': '🇲🇨',
    'Mexican': '🇲🇽',
    'Australian': '🇦🇺',
    'Canadian': '🇨🇦',
    'French': '🇫🇷',
    'German': '🇩🇪',
    'Japanese': '🇯🇵',
    'Finnish': '🇫🇮',
    'Danish': '🇩🇰',
    'Thai': '🇹🇭',
    'Chinese': '🇨🇳',
    'American': '🇺🇸',
    'Italian': '🇮🇹',
    'Brazilian': '🇧🇷',
    'Argentine': '🇦🇷',
    'South African': '🇿🇦',
    'Austrian': '🇦🇹',
    'Swiss': '🇨🇭',
    'Belgian': '🇧🇪',
    'New Zealander': '🇳🇿',
    'Venezuelan': '🇻🇪',
    'Russian': '🇷🇺'
  }
  return flags[nationality] || '🏁'
}

export default async function DriversPage() {
  let season, round, standings, note
  
  try {
    const data = await getDriverStandings()
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
              Unable to fetch driver standings from Ergast API
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
                  <li>• Verify Ergast API is accessible</li>
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
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Season {season}
          </Badge>
          <Badge variant="outline">
            Round {round}
          </Badge>
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
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {getNationalityFlag(standing.driver.nationality)}
                        </span>
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
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Points System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>1st Place:</span>
                <span className="font-semibold">25 points</span>
              </div>
              <div className="flex justify-between">
                <span>2nd Place:</span>
                <span className="font-semibold">18 points</span>
              </div>
              <div className="flex justify-between">
                <span>3rd Place:</span>
                <span className="font-semibold">15 points</span>
              </div>
              <div className="flex justify-between">
                <span>4th-10th:</span>
                <span className="font-semibold">12-1 points</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
    </div>
  )
}
