import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Flag, MapPin, Clock, Trophy, Zap, Target, Users, Timer, Award } from 'lucide-react'
import { QualifyingResultsTable } from '@/components/QualifyingResultsTable'
import { QualifyingResultsSkeleton } from '@/components/QualifyingResultsSkeleton'
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

interface QualifyingResult {
  position: number
  driver: Driver
  constructor: Constructor
  q1?: string
  q2?: string
  q3?: string
  bestTime: string
  sessionEliminated: 'Q1' | 'Q2' | 'Q3'
}

interface QualifyingRaceResult {
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
  qualifyingResults: QualifyingResult[]
}

interface QualifyingResultsPageProps {
  params: { raceId: string }
  searchParams: { season?: string }
}

async function getQualifyingResults(raceId: string, season?: string): Promise<QualifyingRaceResult> {
  const url = new URL(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/races/${raceId}/qualifying`)
  if (season) {
    url.searchParams.set('season', season)
  }
  
  const res = await fetch(url.toString(), {
    next: { revalidate: 300 } // Revalidate every 5 minutes
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.details || `Failed to fetch qualifying results (${res.status})`)
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

export default async function QualifyingResultsPage({ params, searchParams }: QualifyingResultsPageProps) {
  const { raceId } = params
  const season = searchParams.season || '2025'
  
  let qualifyingResult: QualifyingRaceResult
  
  try {
    qualifyingResult = await getQualifyingResults(raceId, season)
  } catch (error) {
    return (
      <div className="min-h-screen race-page">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-red-600 mb-4">Qualifying Results Not Available</h1>
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

  const poleSitter = qualifyingResult.qualifyingResults.find(r => r.position === 1)
  const q3Drivers = qualifyingResult.qualifyingResults.filter(r => r.sessionEliminated === 'Q3')
  const q2Drivers = qualifyingResult.qualifyingResults.filter(r => r.sessionEliminated === 'Q2')
  const q1Drivers = qualifyingResult.qualifyingResults.filter(r => r.sessionEliminated === 'Q1')

  return (
    <Suspense fallback={<QualifyingResultsSkeleton />}>
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
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                {qualifyingResult.raceName} Qualifying
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Round {qualifyingResult.round} • {qualifyingResult.season} Season
              </p>
            </div>
          </div>

          {/* Qualifying Info Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Pole Position
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
                    <div className="text-sm font-semibold text-purple-600">
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
                  Q3 Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-bold text-2xl text-blue-600">{q3Drivers.length}</div>
                  <div className="text-sm text-muted-foreground">Drivers in Q3</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Timer className="w-5 h-5 text-green-600" />
                  Qualifying Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Q3:</span>
                    <span className="font-semibold">{q3Drivers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Q2:</span>
                    <span className="font-semibold">{q2Drivers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Q1:</span>
                    <span className="font-semibold">{q1Drivers.length}</span>
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
                    {formatRaceDate(qualifyingResult.date, qualifyingResult.time)}
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
                <MapPin className="w-5 h-5 text-purple-600" />
                Circuit Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Circuit:</span>
                    <div className="font-semibold text-lg">{qualifyingResult.circuit.circuitName}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Location:</span>
                    <div className="font-semibold">{qualifyingResult.circuit.locality}, {qualifyingResult.circuit.country}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Coordinates:</span>
                    <div className="font-semibold">
                      {qualifyingResult.circuit.lat.toFixed(4)}°, {qualifyingResult.circuit.lng.toFixed(4)}°
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Qualifying Results Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Qualifying Results
            </CardTitle>
            <CardDescription>
              Complete qualifying results with Q1, Q2, Q3 times and elimination stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QualifyingResultsTable results={qualifyingResult.qualifyingResults} />
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
