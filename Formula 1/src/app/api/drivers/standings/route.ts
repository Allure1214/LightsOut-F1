import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const season = searchParams.get('season') || '2024'
    const round = searchParams.get('round') || 'current'

    // Fetch driver standings from Ergast API
    const ergastUrl = `http://ergast.com/api/f1/${season}/${round}/driverStandings.json`
    
    const response = await fetch(ergastUrl)
    
    if (!response.ok) {
      throw new Error('Failed to fetch driver standings')
    }

    const data = await response.json()
    
    // Transform the data to match our needs
    const standings = data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || []
    
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

    return NextResponse.json({
      season: parseInt(season),
      round: round,
      standings: transformedStandings
    })

  } catch (error) {
    console.error('Error fetching driver standings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch driver standings' },
      { status: 500 }
    )
  }
}
