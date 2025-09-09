import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Flag, MapPin, Clock, Trophy, Zap, Target, Users, Timer } from 'lucide-react'
import { SprintResultsTable } from '@/components/SprintResultsTable'
import { SprintResultsSkeleton } from '@/components/SprintResultsSkeleton'
import { Suspense } from 'react'
import Link from 'next/link'

interface Driver {
  driverId: string
  givenName: string
  familyName: string
  nationality: string
  code?: string
}

interface Constructor {
  constructorId: string
  name: string
  nationality: string
}

interface SprintResult {
  position: number
  positionText: string
  points: number
  driver: Driver
  constructor: Constructor
  grid: number
  laps: number
  status: string
  time?: {
    millis?: string
    time?: string
  }
  fastestLap?: {
    rank: string
    lap: string
    time: {
      time: string
    }
    averageSpeed?: {
      units: string
      speed: string
    }
  }
}

interface SprintRaceResult {
  season: string
  round: string
  raceName: string
  date: string
  time: string
  circuit: {
    circuitId: string
    circuitName: string
    country: string
    locality: string
    lat: number | null
    lng: number | null
  }
  sprintResults: SprintResult[]
}

interface SprintResultsPageProps {
  params: { raceId: string }
  searchParams: { season?: string }
}

async function getSprintResults(raceId: string, season?: string): Promise<SprintRaceResult> {
  const url = new URL(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/races/${raceId}/sprint`)
  if (season) {
    url.searchParams.set('season', season)
  }
  
  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 } // Revalidate every hour
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.details || `Failed to fetch sprint results (${res.status})`)
  }
  
  return res.json()
}

function formatRaceDate(dateString: string, timeString?: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  let formattedDate = date.toLocaleDateString('en-US', options)
  if (timeString) {
    const utcTime = new Date(`${dateString}T${timeString}`)
    const localTime = utcTime.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
    formattedDate += ` at ${localTime}`
  }
  return formattedDate
}

export default async function SprintResultsPage({ params, searchParams }: SprintResultsPageProps) {
  const { raceId } = params
  const season = searchParams.season || '2025'
  
  let sprintResult: SprintRaceResult
  
  try {
    sprintResult = await getSprintResults(raceId, season)
  } catch (error) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Sprint Results Not Available</h1>
          <p className="text-lg text-muted-foreground mb-8">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <div className="space-y-4">
            <Button asChild>
              <Link href={`/races?season=${season}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Race Calendar
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const winner = sprintResult.sprintResults.find(r => r.position === 1)
  const fastestLap = sprintResult.sprintResults.find(r => r.fastestLap?.rank === '1')
  const totalLaps = sprintResult.sprintResults.some(r => r.laps > 0) 
    ? Math.max(...sprintResult.sprintResults.map(r => r.laps))
    : 0
  const finishedDrivers = sprintResult.sprintResults.filter(r => r.status === 'Finished').length

  return (
    <Suspense fallback={<SprintResultsSkeleton />}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/races?season=${season}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Calendar
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                {sprintResult.raceName} Sprint
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Round {sprintResult.round} • {sprintResult.season} Season
              </p>
            </div>
          </div>

          {/* Sprint Info Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-600" />
                  Sprint Winner
                </CardTitle>
              </CardHeader>
              <CardContent>
                {winner ? (
                  <div className="space-y-2">
                    <div className="font-bold text-lg">
                      {winner.driver.givenName} {winner.driver.familyName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {winner.constructor.name}
                    </div>
                    <div className="text-sm font-semibold text-orange-600">
                      {winner.points} points
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No winner data</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Fastest Lap
                </CardTitle>
              </CardHeader>
              <CardContent>
                {fastestLap ? (
                  <div className="space-y-2">
                    <div className="font-bold text-lg">
                      {fastestLap.driver.givenName} {fastestLap.driver.familyName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {fastestLap.constructor.name}
                    </div>
                    <div className="text-sm font-semibold text-blue-600">
                      {fastestLap.fastestLap?.time.time}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No fastest lap data</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Timer className="w-5 h-5 text-green-600" />
                  Sprint Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Laps:</span>
                    <span className="font-semibold">{totalLaps > 0 ? totalLaps : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Finished:</span>
                    <span className="font-semibold">{finishedDrivers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Started:</span>
                    <span className="font-semibold">{sprintResult.sprintResults.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Sprint Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-semibold">
                    {formatRaceDate(sprintResult.date, sprintResult.time)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Circuit Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Circuit Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Circuit:</span>
                    <div className="font-semibold text-lg">{sprintResult.circuit.circuitName}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Location:</span>
                    <div className="font-semibold">{sprintResult.circuit.locality}, {sprintResult.circuit.country}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Coordinates:</span>
                    <div className="font-semibold">
                      {sprintResult.circuit.lat !== null && sprintResult.circuit.lng !== null 
                        ? `${sprintResult.circuit.lat.toFixed(4)}°, ${sprintResult.circuit.lng.toFixed(4)}°`
                        : 'Not Available'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sprint Results Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              Sprint Results
            </CardTitle>
            <CardDescription>
              Sprint race results with positions, times, and points (8-7-6-5-4-3-2-1 scoring)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SprintResultsTable results={sprintResult.sprintResults} />
          </CardContent>
        </Card>
      </div>
    </Suspense>
  )
}
