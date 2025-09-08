import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { raceId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const season = searchParams.get('season') || '2025'
    const raceId = params.raceId

    // Fetch sprint qualifying results from F1 API
    const f1ApiUrl = `https://f1connectapi.vercel.app/api/${season}/${raceId}/sprint/qualy`
    
    console.log('Fetching sprint qualifying results from F1 API:', f1ApiUrl)
    
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
      throw new Error(`No sprint qualifying data found for race ${raceId}`)
    }

    const sprintQualifyingResults = raceData.sprintQualyResults || []
    
    if (sprintQualifyingResults.length === 0) {
      throw new Error('No sprint qualifying results found in API response')
    }

    // Transform the data to match our needs
    const transformedResults: SprintQualifyingResult[] = sprintQualifyingResults.map((result: any) => {
      // Determine best time and session eliminated
      let bestTime = ''
      let sessionEliminated: 'SQ1' | 'SQ2' | 'SQ3' = 'SQ1'
      
      if (result.sq3) {
        bestTime = result.sq3
        sessionEliminated = 'SQ3'
      } else if (result.sq2) {
        bestTime = result.sq2
        sessionEliminated = 'SQ2'
      } else if (result.sq1) {
        bestTime = result.sq1
        sessionEliminated = 'SQ1'
      }

      return {
        position: parseInt(result.gridPosition),
        driver: {
          driverId: result.driver.driverId,
          givenName: result.driver.name,
          familyName: result.driver.surname,
          nationality: result.driver.nationality,
          code: result.driver.shortName,
          number: result.driver.number
        },
        constructor: {
          constructorId: result.team.teamId,
          name: result.team.teamName,
          nationality: result.team.teamNationality
        },
        sq1: result.sq1 ? result.sq1.trim() : undefined,
        sq2: result.sq2 ? result.sq2.trim() : undefined,
        sq3: result.sq3 ? result.sq3.trim() : undefined,
        bestTime: bestTime.trim(),
        sessionEliminated: sessionEliminated
      }
    })

    const sprintQualifyingRaceResult: SprintQualifyingRaceResult = {
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
        lat: 0, // F1 API doesn't provide coordinates
        lng: 0,
        circuitLength: raceData.circuit.circuitLength,
        corners: raceData.circuit.corners,
        lapRecord: raceData.circuit.lapRecord
      },
      sprintQualifyingResults: transformedResults
    }

    console.log(`Successfully processed ${transformedResults.length} sprint qualifying results`)

    return NextResponse.json(sprintQualifyingRaceResult)

  } catch (error) {
    console.error('Error fetching sprint qualifying results from F1 API:', error)
    
    return NextResponse.json(
      { 
        error: 'Sprint qualifying results not available from API',
        details: error instanceof Error ? error.message : 'Unknown error',
        available: false
      },
      { status: 404 }
    )
  }
}
