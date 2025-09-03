import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const season = searchParams.get('season') || '2024'
    const round = searchParams.get('round') || 'current'

    // Try to fetch from Ergast API with timeout
    try {
      const ergastUrl = `https://ergast.com/api/f1/${season}/${round}/driverStandings.json`
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(ergastUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Formula1-Website/1.0'
        }
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
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
      }
    } catch (apiError) {
      console.warn('Ergast API unavailable, using sample data:', apiError)
    }

    // Fallback to sample data if API is unavailable
    const sampleStandings = [
      {
        position: 1,
        positionText: "1",
        points: 575,
        wins: 19,
        driver: {
          driverId: "max_verstappen",
          code: "VER",
          firstName: "Max",
          lastName: "Verstappen",
          nationality: "Dutch",
          dateOfBirth: "1997-09-30",
          url: "http://en.wikipedia.org/wiki/Max_Verstappen"
        },
        team: {
          teamId: "red_bull_racing",
          name: "Red Bull Racing",
          nationality: "Austrian",
          url: "http://en.wikipedia.org/wiki/Red_Bull_Racing"
        }
      },
      {
        position: 2,
        positionText: "2",
        points: 285,
        wins: 1,
        driver: {
          driverId: "charles_leclerc",
          code: "LEC",
          firstName: "Charles",
          lastName: "Leclerc",
          nationality: "Monégasque",
          dateOfBirth: "1997-10-16",
          url: "http://en.wikipedia.org/wiki/Charles_Leclerc"
        },
        team: {
          teamId: "ferrari",
          name: "Ferrari",
          nationality: "Italian",
          url: "http://en.wikipedia.org/wiki/Scuderia_Ferrari"
        }
      },
      {
        position: 3,
        positionText: "3",
        points: 234,
        wins: 0,
        driver: {
          driverId: "sergio_perez",
          code: "PER",
          firstName: "Sergio",
          lastName: "Pérez",
          nationality: "Mexican",
          dateOfBirth: "1990-01-26",
          url: "http://en.wikipedia.org/wiki/Sergio_P%C3%A9rez"
        },
        team: {
          teamId: "red_bull_racing",
          name: "Red Bull Racing",
          nationality: "Austrian",
          url: "http://en.wikipedia.org/wiki/Red_Bull_Racing"
        }
      },
      {
        position: 4,
        positionText: "4",
        points: 200,
        wins: 0,
        driver: {
          driverId: "carlos_sainz",
          code: "SAI",
          firstName: "Carlos",
          lastName: "Sainz",
          nationality: "Spanish",
          dateOfBirth: "1994-09-01",
          url: "http://en.wikipedia.org/wiki/Carlos_Sainz_Jr."
        },
        team: {
          teamId: "ferrari",
          name: "Ferrari",
          nationality: "Italian",
          url: "http://en.wikipedia.org/wiki/Scuderia_Ferrari"
        }
      },
      {
        position: 5,
        positionText: "5",
        points: 175,
        wins: 0,
        driver: {
          driverId: "lando_norris",
          code: "NOR",
          firstName: "Lando",
          lastName: "Norris",
          nationality: "British",
          dateOfBirth: "1999-11-13",
          url: "http://en.wikipedia.org/wiki/Lando_Norris"
        },
        team: {
          teamId: "mclaren",
          name: "McLaren",
          nationality: "British",
          url: "http://en.wikipedia.org/wiki/McLaren"
        }
      }
    ]

    return NextResponse.json({
      season: parseInt(season),
      round: round,
      standings: sampleStandings,
      note: "Using sample data - API temporarily unavailable"
    })

  } catch (error) {
    console.error('Error in driver standings API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch driver standings' },
      { status: 500 }
    )
  }
}
