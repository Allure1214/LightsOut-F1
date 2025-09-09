import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Flag, MapPin, Clock, Trophy, Zap, Target, Users } from 'lucide-react'
import { RaceResultsTable } from '@/components/RaceResultsTable'
import { RaceResultsSkeleton } from '@/components/RaceResultsSkeleton'
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

interface Result {
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

interface RaceResult {
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
    lat: number
    lng: number
  }
  results: Result[]
}

interface RaceResultsPageProps {
  params: { raceId: string }
  searchParams: { season?: string }
}

async function getRaceResults(raceId: string, season?: string): Promise<RaceResult> {
  const url = new URL(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/races/${raceId}/results`)
  if (season) {
    url.searchParams.set('season', season)
  }
  
  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 } // Revalidate every hour
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.details || `Failed to fetch race results (${res.status})`)
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

export default async function RaceResultsPage({ params, searchParams }: RaceResultsPageProps) {
  const { raceId } = params
  const season = searchParams.season || '2024'
  
  let raceResult: RaceResult
  
  try {
    raceResult = await getRaceResults(raceId, season)
  } catch (error) {
    return (
      <div className="min-h-screen race-page">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-red-600 mb-4">Race Results Not Available</h1>
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
        </div>
      </div>
    )
  }

  const winner = raceResult.results.find(r => r.position === 1)
  const fastestLap = raceResult.results.find(r => r.fastestLap?.rank === '1')
  const totalLaps = Math.max(...raceResult.results.map(r => r.laps))
  const finishedDrivers = raceResult.results.filter(r => r.status === 'Finished').length

  return (
    <Suspense fallback={<RaceResultsSkeleton />}>
      <div className="min-h-screen race-page">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                {raceResult.raceName}
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Round {raceResult.round} • {raceResult.season} Season
              </p>
            </div>
          </div>

          {/* Race Info Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Winner
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
                    <div className="text-sm font-semibold text-yellow-600">
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
                  <Target className="w-5 h-5 text-green-600" />
                  Race Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Laps:</span>
                    <span className="font-semibold">{totalLaps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Finished:</span>
                    <span className="font-semibold">{finishedDrivers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Started:</span>
                    <span className="font-semibold">{raceResult.results.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Race Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-semibold">
                    {formatRaceDate(raceResult.date, raceResult.time)}
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
                <MapPin className="w-5 h-5 text-red-600" />
                Circuit Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Circuit:</span>
                    <div className="font-semibold text-lg">{raceResult.circuit.circuitName}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Location:</span>
                    <div className="font-semibold">{raceResult.circuit.locality}, {raceResult.circuit.country}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Coordinates:</span>
                    <div className="font-semibold">
                      {raceResult.circuit.lat.toFixed(4)}°, {raceResult.circuit.lng.toFixed(4)}°
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Race Results Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-red-600" />
              Race Results
            </CardTitle>
            <CardDescription>
              Complete race results with positions, times, and points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RaceResultsTable results={raceResult.results} />
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
