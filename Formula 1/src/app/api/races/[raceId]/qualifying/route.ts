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

export async function GET(
  request: NextRequest,
  { params }: { params: { raceId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const season = searchParams.get('season') || '2025'
    const raceId = params.raceId

    // Fetch qualifying results from Jolpica F1 API with higher limit
    const jolpicaUrl = `https://api.jolpi.ca/ergast/f1/${season}/qualifying.json?limit=1000`
    console.log('Fetching qualifying results from Jolpica F1 API:', jolpicaUrl)
    
    const response = await fetch(jolpicaUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Cache-Control': 'no-cache'
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
      throw new Error(`No qualifying data found for race ${raceId}`)
    }

    const qualifyingResults = raceData.QualifyingResults || []
    
    if (qualifyingResults.length === 0) {
      throw new Error('No qualifying results found in API response')
    }

    // Transform the data to match our needs
    const transformedResults: QualifyingResult[] = qualifyingResults.map((result: any) => {
      // Determine best time and session eliminated
      let bestTime = ''
      let sessionEliminated: 'Q1' | 'Q2' | 'Q3' = 'Q1'
      
      if (result.Q3) {
        bestTime = result.Q3
        sessionEliminated = 'Q3'
      } else if (result.Q2) {
        bestTime = result.Q2
        sessionEliminated = 'Q2'
      } else if (result.Q1) {
        bestTime = result.Q1
        sessionEliminated = 'Q1'
      }

      return {
        position: parseInt(result.position),
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
        q1: result.Q1 || undefined,
        q2: result.Q2 || undefined,
        q3: result.Q3 || undefined,
        bestTime: bestTime,
        sessionEliminated: sessionEliminated
      }
    })

    const qualifyingRaceResult: QualifyingRaceResult = {
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
      qualifyingResults: transformedResults
    }

    console.log(`Successfully processed ${transformedResults.length} qualifying results`)

    return NextResponse.json(qualifyingRaceResult)

  } catch (error) {
    console.error('Error fetching qualifying results from Jolpica F1 API:', error)
    
    return NextResponse.json(
      { 
        error: 'Qualifying results not available from API',
        details: error instanceof Error ? error.message : 'Unknown error',
        available: false
      },
      { status: 404 }
    )
  }
}
