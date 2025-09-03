import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const season = searchParams.get('season') || '2024'
    const round = searchParams.get('round') || 'current'

    // Fetch driver standings from Ergast API
    // Try multiple endpoints for better connectivity
    const ergastUrls = [
      `https://ergast.com/api/f1/${season}/${round}/driverStandings.json`,
      `http://ergast.com/api/f1/${season}/${round}/driverStandings.json`,
      `https://ergastapi.com/api/f1/${season}/${round}/driverStandings.json`
    ]
    
    let response
    let lastError
    
    // Try each URL until one works
    for (const url of ergastUrls) {
      try {
        console.log('Trying Ergast API:', url)
        
        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        })
        
        console.log('API Response status:', response.status)
        
        if (response.ok) {
          ergastUrl = url
          break
        } else {
          lastError = new Error(`API returned ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.log('Failed to connect to:', url, error)
        lastError = error
        continue
      }
    }
    
    if (!response || !response.ok) {
      throw lastError || new Error('All Ergast API endpoints failed')
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
    console.error('Error fetching driver standings from Ergast API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch driver standings from Ergast API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
