import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { raceId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const season = searchParams.get('season') || '2025'
    const raceId = params.raceId

    // Fetch sprint results from F1 API (f1api.dev)
    const f1ApiUrl = `https://f1connectapi.vercel.app/api/${season}/${raceId}/sprint/race`
    
    console.log('Fetching sprint results from F1 API:', f1ApiUrl)
    
    const response = await fetch(f1ApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    console.log('F1 API Response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`F1 API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('API Response data received:', data.races ? 'Success' : 'No data')
    
    // Extract race data
    const raceData = data.races
    
    if (!raceData) {
      throw new Error(`No sprint race data found for race ${raceId}`)
    }

    const sprintResults = raceData.sprintRaceResults || []
    
    if (sprintResults.length === 0) {
      throw new Error('No sprint results found in API response')
    }

    // Transform the data to match our needs
    const transformedResults: SprintResult[] = sprintResults.map((result: any) => ({
      position: parseInt(result.position),
      positionText: result.position.toString(),
      points: parseFloat(result.points),
      driver: {
        driverId: result.driver.driverId,
        givenName: result.driver.name,
        familyName: result.driver.surname,
        nationality: result.driver.nationality,
        code: result.driver.shortName
      },
      constructor: {
        constructorId: result.team.teamId,
        name: result.team.teamName,
        nationality: result.team.teamNationality
      },
      grid: parseInt(result.gridPosition),
      laps: 0, // F1 API doesn't provide laps data for sprint races
      status: result.retired ? 'Retired' : 'Finished',
      time: result.time ? {
        millis: '',
        time: result.time
      } : undefined,
      fastestLap: result.fastLap ? {
        rank: '1',
        lap: '1',
        time: {
          time: result.fastLap
        },
        averageSpeed: undefined
      } : undefined
    }))

    const sprintRaceResult: SprintRaceResult = {
      season: data.season,
      round: raceData.round,
      raceName: raceData.raceName,
      date: raceData.date,
      time: raceData.time,
      circuit: {
        circuitId: raceData.circuit.circuitId,
        circuitName: raceData.circuit.circuitName,
        country: raceData.circuit.country,
        locality: raceData.circuit.city,
        lat: null, // F1 API doesn't provide coordinates
        lng: null
      },
      sprintResults: transformedResults
    }

    console.log(`Successfully processed ${transformedResults.length} sprint results`)

    return NextResponse.json(sprintRaceResult)

  } catch (error) {
    console.error('Error fetching sprint results from F1 API:', error)
    
    return NextResponse.json(
      { 
        error: 'Sprint results not available from API',
        details: error instanceof Error ? error.message : 'Unknown error',
        available: false
      },
      { status: 404 }
    )
  }
}
