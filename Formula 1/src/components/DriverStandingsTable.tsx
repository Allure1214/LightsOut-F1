'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Flag, ExternalLink } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

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

interface DriverStandingsTableProps {
  standings: DriverStanding[]
  round: string
}

function getPositionColor(position: number): string {
  if (position === 1) return 'text-yellow-600 bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300'
  if (position === 2) return 'text-gray-600 bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'
  if (position === 3) return 'text-amber-600 bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300'
  if (position <= 10) return 'text-blue-600 bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300'
  return 'text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
}

function getPositionIcon(position: number) {
  if (position === 1) return <Trophy className="w-4 h-4" />
  if (position === 2) return <div className="w-4 h-4 rounded-full bg-gray-400" />
  if (position === 3) return <div className="w-4 h-4 rounded-full bg-amber-500" />
  return null
}

export function DriverStandingsTable({ standings, round }: DriverStandingsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSeason = searchParams.get('season') || '2024'

  const handleDriverClick = (driver: DriverStanding) => {
    const params = new URLSearchParams()
    if (currentSeason) params.set('season', currentSeason)
    router.push(`/drivers/${driver.driver.driverId}?${params.toString()}`)
  }

  const handleActionClick = (e: React.MouseEvent, driver: DriverStanding) => {
    e.stopPropagation()
    const params = new URLSearchParams()
    if (currentSeason) params.set('season', currentSeason)
    router.push(`/drivers/${driver.driver.driverId}?${params.toString()}`)
  }

  return (
    <Card className="overflow-hidden shadow-lg driver-standings-table">
      <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-red-600" />
          Championship Standings
        </CardTitle>
        <CardDescription className="text-red-700">
          Points and positions after Round {round === 'current' ? 'Latest' : round}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold text-muted-foreground">Pos</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Driver</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Team</th>
                <th className="text-center p-4 font-semibold text-muted-foreground">Points</th>
                <th className="text-center p-4 font-semibold text-muted-foreground">Wins</th>
                <th className="text-center p-4 font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((standing, index) => (
                <tr 
                  key={standing.driver.driverId} 
                  className={`border-b transition-all duration-200 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 cursor-pointer group ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                  }`}
                  onClick={() => handleDriverClick(standing)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Badge 
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 shadow-sm ${getPositionColor(standing.position)}`}
                      >
                        {getPositionIcon(standing.position)}
                        <span className="ml-1">{standing.position}</span>
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="font-semibold text-lg">
                        {standing.driver.firstName} {standing.driver.lastName}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Flag className="w-3 h-3" />
                        <span>{standing.driver.nationality}</span>
                        {standing.driver.code && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            {standing.driver.code}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="font-medium text-base">{standing.team.name}</div>
                      {standing.team.nationality && (
                        <div className="text-sm text-muted-foreground">
                          {standing.team.nationality}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="space-y-1">
                      <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                        {standing.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-green-600">
                        {standing.wins}
                      </div>
                      <div className="text-xs text-muted-foreground">wins</div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleActionClick(e, standing)}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3 p-4">
          {standings.map((standing, index) => (
            <Card 
              key={standing.driver.driverId} 
              className={`p-4 transition-all duration-200 hover:shadow-md cursor-pointer group ${
                standing.position <= 3 ? 'ring-2 ring-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100' : ''
              }`}
              onClick={() => handleDriverClick(standing)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 shadow-sm ${getPositionColor(standing.position)}`}
                  >
                    {getPositionIcon(standing.position)}
                    <span className="ml-1">{standing.position}</span>
                  </Badge>
                  <div>
                    <div className="font-semibold text-base">
                      {standing.driver.firstName} {standing.driver.lastName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Flag className="w-3 h-3" />
                      <span>{standing.driver.nationality}</span>
                      {standing.driver.code && (
                        <Badge variant="outline" className="text-xs px-1 py-0.5">
                          {standing.driver.code}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                    {standing.points.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="text-muted-foreground">{standing.team.name}</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <Trophy className="w-3 h-3" />
                    {standing.wins} wins
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={(e) => handleActionClick(e, standing)}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
