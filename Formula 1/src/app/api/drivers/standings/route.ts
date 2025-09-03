import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const season = searchParams.get('season') || '2025'
    const round = searchParams.get('round') || 'current'

    // Fetch driver standings from Jolpica F1 API
    // Jolpica F1 is the successor to the deprecated Ergast API
    // API endpoint: https://api.jolpi.ca/ergast/f1/
    // Note: Jolpica F1 uses different endpoint structure than Ergast
    const jolpicaUrl = round === 'current' 
      ? `https://api.jolpi.ca/ergast/f1/${season}/driverStandings.json`
      : `https://api.jolpi.ca/ergast/f1/${season}/${round}/driverStandings.json`
    
    console.log('Fetching from Jolpica F1 API:', jolpicaUrl)
    
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
    
    // Transform the data to match our needs
    const standings = data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || []
    
    if (standings.length === 0) {
      throw new Error('No driver standings data found in API response')
    }
    
    const transformedStandings = standings.map((standing: any) => ({
      position: parseInt(standing.position),
      positionText: standing.positionText,
      points: parseFloat(standing.points),
      wins: parseInt(standing.wins),
      driver: {
        driverId: standing.Driver.driverId,
        code: standing.Driver.code,
        firstName: standing.Driver.givenName,
        lastName: standing.Driver.familyName,
        nationality: standing.Driver.nationality,
        dateOfBirth: standing.Driver.dateOfBirth,
        url: standing.Driver.url
      },
      team: {
        teamId: standing.Constructors[0].constructorId,
        name: standing.Constructors[0].name,
        nationality: standing.Constructors[0].nationality,
        url: standing.Constructors[0].url
      }
    }))

    console.log(`Successfully processed ${transformedStandings.length} driver standings`)

    return NextResponse.json({
      season: parseInt(season),
      round: round,
      standings: transformedStandings
    })

  } catch (error) {
    console.error('Error fetching driver standings from Jolpica F1 API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch driver standings from Jolpica F1 API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
