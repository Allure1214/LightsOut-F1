import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Flag, Calendar, Clock, TrendingUp, Award, Star, Zap, Target, BarChart3, Activity, MapPin, Users, ExternalLink, ArrowLeft } from 'lucide-react'
import { TeamDetailsSkeleton } from '@/components/TeamDetailsSkeleton'

interface TeamDetails {
  teamId: string
  name: string
  nationality?: string
  url?: string
}

interface TeamStats {
  totalWins: number
  totalPodiums: number
  totalPoints: number
  totalRaces: number
  totalPoles: number
  totalFastestLaps: number
  championshipTitles: number
  currentSeason: {
    wins: number
    podiums: number
    points: number
    races: number
    position: number
  }
}

interface Driver {
  driverId: string
  firstName: string
  lastName: string
  nationality: string
  code?: string
  wins: number
  podiums: number
  points: number
}

interface RecentPerformance {
  race: string
  position: number
  points: number
  fastestLap: boolean
  pole: boolean
  date: string
  driver: string
}

interface TeamDetailsPageProps {
  params: {
    teamId: string
  }
  searchParams: {
    season?: string
  }
}

async function getTeamData(teamId: string, season: string = '2025') {
  try {
    // Use relative URL for internal API calls
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/teams/${teamId}?season=${season}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      cache: 'no-store' // Ensure fresh data
    })

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching team data:', error)
    return null
  }
}

function getPositionColor(position: number): string {
  if (position === 1) return 'text-yellow-600 bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300'
  if (position === 2) return 'text-gray-600 bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'
  if (position === 3) return 'text-amber-600 bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300'
  if (position <= 10) return 'text-blue-600 bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300'
  return 'text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
}

export default async function TeamDetailsPage({ params, searchParams }: TeamDetailsPageProps) {
  const { teamId } = params
  const season = searchParams.season || '2025'

  const teamData = await getTeamData(teamId, season)

  if (!teamData || !teamData.teamDetails) {
    notFound()
  }

  const { teamDetails, teamStats, drivers, recentPerformance } = teamData

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href={`/teams?season=${season}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team Standings
            </Link>
          </Button>
        </div>

        <Suspense fallback={<TeamDetailsSkeleton />}>
          {/* Team Header */}
          <Card className="mb-8 overflow-hidden shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-red-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-4xl font-bold mb-2">
                    {teamDetails.name}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-lg">
                    {teamDetails.nationality && (
                      <div className="flex items-center gap-2">
                        <Flag className="w-4 h-4" />
                        <span>{teamDetails.nationality}</span>
                      </div>
                    )}
                    <Badge variant="outline" className="text-lg px-3 py-1 border-white text-white">
                      Constructor
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Current Season Performance */}
          {teamStats && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  {season} Season Performance
                </CardTitle>
                <CardDescription>
                  Current season statistics and championship position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-1">
                      {teamStats.currentSeason.position > 0 ? teamStats.currentSeason.position : 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Championship Position</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {teamStats.currentSeason.wins}
                    </div>
                    <div className="text-sm text-muted-foreground">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {teamStats.currentSeason.podiums}
                    </div>
                    <div className="text-sm text-muted-foreground">Podiums</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {teamStats.currentSeason.points}
                    </div>
                    <div className="text-sm text-muted-foreground">Points</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team Drivers */}
          {drivers && drivers.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-600" />
                  {season} Team Drivers
                </CardTitle>
                <CardDescription>
                  Current season driver lineup and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {drivers.map((driver: Driver, index: number) => (
                    <div key={driver.driverId} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-lg">
                            {driver.firstName} {driver.lastName}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Flag className="w-3 h-3" />
                            <span>{driver.nationality}</span>
                            {driver.code && (
                              <Badge variant="outline" className="text-xs">
                                {driver.code}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/drivers/${driver.driverId}?season=${season}`}>
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-xl font-bold text-green-600">{driver.wins}</div>
                          <div className="text-xs text-muted-foreground">Wins</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-blue-600">{driver.podiums}</div>
                          <div className="text-xs text-muted-foreground">Podiums</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-purple-600">{driver.points}</div>
                          <div className="text-xs text-muted-foreground">Points</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Performance */}
          {recentPerformance.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                  {season} Recent Performance
                </CardTitle>
                <CardDescription>
                  Last 5 race results and achievements from {season} season
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPerformance.map((race: RecentPerformance, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge 
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${getPositionColor(race.position)}`}
                        >
                          {race.position}
                        </Badge>
                        <div>
                          <div className="font-semibold">{race.race}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(race.date).toLocaleDateString()} • {race.driver}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">
                            {race.points} pts
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {race.pole && (
                            <Badge variant="outline" className="text-xs">
                              Pole
                            </Badge>
                          )}
                          {race.fastestLap && (
                            <Badge variant="outline" className="text-xs">
                              FL
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Career Highlights */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Career Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Wins</span>
                  <span className="font-bold text-2xl text-yellow-600">
                    {teamStats?.totalWins || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Podiums</span>
                  <span className="font-bold text-2xl text-gray-600">
                    {teamStats?.totalPodiums || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Points</span>
                  <span className="font-bold text-2xl text-blue-600">
                    {teamStats?.totalPoints || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Races</span>
                  <span className="font-bold text-2xl text-green-600">
                    {teamStats?.totalRaces || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-600" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pole Positions</span>
                  <span className="font-bold text-2xl text-purple-600">
                    {teamStats?.totalPoles || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Fastest Laps</span>
                  <span className="font-bold text-2xl text-orange-600">
                    {teamStats?.totalFastestLaps || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Championship Titles</span>
                  <span className="font-bold text-2xl text-yellow-600">
                    {teamStats?.championshipTitles || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Win Rate</span>
                  <span className="font-bold text-2xl text-red-600">
                    {teamStats?.totalRaces ? 
                      ((teamStats.totalWins / teamStats.totalRaces) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* External Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-red-600" />
                External Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" asChild>
                  <a href={`https://en.wikipedia.org/wiki/${teamDetails.name.replace(/\s+/g, '_')}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Wikipedia
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </div>
  )
}
