import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Flag, MapPin, Clock, Trophy, Zap, Target, Users, Timer, Award } from 'lucide-react'
import { SprintQualifyingResultsTable } from '@/components/SprintQualifyingResultsTable'
import { SprintQualifyingResultsSkeleton } from '@/components/SprintQualifyingResultsSkeleton'
import { Suspense } from 'react'
import Link from 'next/link'

interface Driver {
  driverId: string
  givenName: string
  familyName: string
  nationality: string
  code?: string
  number?: number
}

interface Constructor {
  constructorId: string
  name: string
  nationality: string
}

interface SprintQualifyingResult {
  position: number
  driver: Driver
  constructor: Constructor
  sq1?: string
  sq2?: string
  sq3?: string
  bestTime: string
  sessionEliminated: 'SQ1' | 'SQ2' | 'SQ3'
}

interface SprintQualifyingRaceResult {
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
    circuitLength?: string
    corners?: number
    lapRecord?: string
  }
  sprintQualifyingResults: SprintQualifyingResult[]
}

interface SprintQualifyingResultsPageProps {
  params: { raceId: string }
  searchParams: { season?: string }
}

async function getSprintQualifyingResults(raceId: string, season?: string): Promise<SprintQualifyingRaceResult> {
  const url = new URL(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/races/${raceId}/sprint-qualifying`)
  if (season) {
    url.searchParams.set('season', season)
  }
  
  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 } // Revalidate every hour
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.details || `Failed to fetch sprint qualifying results (${res.status})`)
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

export default async function SprintQualifyingResultsPage({ params, searchParams }: SprintQualifyingResultsPageProps) {
  const { raceId } = params
  const season = searchParams.season || '2025'
  
  let sprintQualifyingResult: SprintQualifyingRaceResult
  
  try {
    sprintQualifyingResult = await getSprintQualifyingResults(raceId, season)
  } catch (error) {
    return (
      <div className="min-h-screen race-page">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-red-600 mb-4">Sprint Qualifying Results Not Available</h1>
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

  const poleSitter = sprintQualifyingResult.sprintQualifyingResults.find(r => r.position === 1)
  const sq3Drivers = sprintQualifyingResult.sprintQualifyingResults.filter(r => r.sessionEliminated === 'SQ3')
  const sq2Drivers = sprintQualifyingResult.sprintQualifyingResults.filter(r => r.sessionEliminated === 'SQ2')
  const sq1Drivers = sprintQualifyingResult.sprintQualifyingResults.filter(r => r.sessionEliminated === 'SQ1')

  return (
    <Suspense fallback={<SprintQualifyingResultsSkeleton />}>
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
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent">
                {sprintQualifyingResult.raceName} Sprint Qualifying
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Round {sprintQualifyingResult.round} • {sprintQualifyingResult.season} Season
              </p>
            </div>
          </div>

          {/* Sprint Qualifying Info Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-cyan-600" />
                  Sprint Pole
                </CardTitle>
              </CardHeader>
              <CardContent>
                {poleSitter ? (
                  <div className="space-y-2">
                    <div className="font-bold text-lg">
                      {poleSitter.driver.givenName} {poleSitter.driver.familyName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {poleSitter.constructor.name}
                    </div>
                    <div className="text-sm font-semibold text-cyan-600">
                      {poleSitter.bestTime}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No pole data</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  SQ3 Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-bold text-2xl text-blue-600">{sq3Drivers.length}</div>
                  <div className="text-sm text-muted-foreground">Drivers in SQ3</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Timer className="w-5 h-5 text-green-600" />
                  Sprint Qualifying Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">SQ3:</span>
                    <span className="font-semibold">{sq3Drivers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">SQ2:</span>
                    <span className="font-semibold">{sq2Drivers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">SQ1:</span>
                    <span className="font-semibold">{sq1Drivers.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  Qualifying Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-semibold">
                    {formatRaceDate(sprintQualifyingResult.date, sprintQualifyingResult.time)}
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
                <MapPin className="w-5 h-5 text-cyan-600" />
                Circuit Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Circuit:</span>
                    <div className="font-semibold text-lg">{sprintQualifyingResult.circuit.circuitName}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Location:</span>
                    <div className="font-semibold">{sprintQualifyingResult.circuit.locality}, {sprintQualifyingResult.circuit.country}</div>
                  </div>
                  {sprintQualifyingResult.circuit.circuitLength && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Length:</span>
                      <div className="font-semibold">{sprintQualifyingResult.circuit.circuitLength}</div>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {sprintQualifyingResult.circuit.corners && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Corners:</span>
                      <div className="font-semibold">{sprintQualifyingResult.circuit.corners}</div>
                    </div>
                  )}
                  {sprintQualifyingResult.circuit.lapRecord && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Lap Record:</span>
                      <div className="font-semibold">{sprintQualifyingResult.circuit.lapRecord}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sprint Qualifying Results Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-600" />
              Sprint Qualifying Results
            </CardTitle>
            <CardDescription>
              Sprint qualifying results with SQ1, SQ2, SQ3 times and elimination stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SprintQualifyingResultsTable results={sprintQualifyingResult.sprintQualifyingResults} />
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
