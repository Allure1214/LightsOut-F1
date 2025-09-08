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
    lat: number
    lng: number
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

    // Fetch sprint results from Jolpica F1 API
    const jolpicaUrl = `https://api.jolpi.ca/ergast/f1/${season}/sprint.json`
    
    console.log('Fetching sprint results from Jolpica F1 API:', jolpicaUrl)
    
    const response = await fetch(jolpicaUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    console.log('Jolpica API Response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`Jolpica F1 API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('API Response data received:', data.MRData ? 'Success' : 'No data')
    
    // Extract race data - filter by race ID
    const races = data.MRData?.RaceTable?.Races || []
    const raceData = races.find((race: any) => race.round === raceId)
    
    if (!raceData) {
      throw new Error(`No sprint race data found for race ${raceId}`)
    }

    const sprintResults = raceData.SprintResults || []
    
    if (sprintResults.length === 0) {
      throw new Error('No sprint results found in API response')
    }

    // Transform the data to match our needs
    const transformedResults: SprintResult[] = sprintResults.map((result: any) => ({
      position: parseInt(result.position),
      positionText: result.positionText,
      points: parseFloat(result.points),
      driver: {
        driverId: result.Driver.driverId,
        givenName: result.Driver.givenName,
        familyName: result.Driver.familyName,
        nationality: result.Driver.nationality,
        code: result.Driver.code
      },
      constructor: {
        constructorId: result.Constructor.constructorId,
        name: result.Constructor.name,
        nationality: result.Constructor.nationality
      },
      grid: parseInt(result.grid),
      laps: parseInt(result.laps),
      status: result.status,
      time: result.Time ? {
        millis: result.Time.millis,
        time: result.Time.time
      } : undefined,
      fastestLap: result.FastestLap ? {
        rank: result.FastestLap.rank,
        lap: result.FastestLap.lap,
        time: {
          time: result.FastestLap.Time?.time || ''
        },
        averageSpeed: result.FastestLap.AverageSpeed ? {
          units: result.FastestLap.AverageSpeed.units || '',
          speed: result.FastestLap.AverageSpeed.speed || ''
        } : undefined
      } : undefined
    }))

    const sprintRaceResult: SprintRaceResult = {
      season: raceData.season,
      round: raceData.round,
      raceName: raceData.raceName,
      date: raceData.date,
      time: raceData.time,
      circuit: {
        circuitId: raceData.Circuit.circuitId,
        circuitName: raceData.Circuit.circuitName,
        country: raceData.Circuit.Location.country,
        locality: raceData.Circuit.Location.locality,
        lat: parseFloat(raceData.Circuit.Location.lat),
        lng: parseFloat(raceData.Circuit.Location.long)
      },
      sprintResults: transformedResults
    }

    console.log(`Successfully processed ${transformedResults.length} sprint results`)

    return NextResponse.json(sprintRaceResult)

  } catch (error) {
    console.error('Error fetching sprint results from Jolpica F1 API:', error)
    
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
