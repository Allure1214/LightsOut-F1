import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { driverId: string } }
) {
  try {
    const { driverId } = params
    const { searchParams } = new URL(request.url)
    const season = searchParams.get('season') || '2025'

    console.log(`Fetching driver data for ${driverId} in season ${season}`)

    // Try Jolpica F1 API first for driver details
    const jolpicaUrl = `https://api.jolpi.ca/ergast/f1/${season}/drivers/${driverId}.json`
    
    const response = await fetch(jolpicaUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    console.log(`Jolpica API response status: ${response.status}`)

    if (response.ok) {
      const data = await response.json()
      const driver = data.MRData?.DriverTable?.Drivers?.[0]
      
      if (driver) {
        // Get team information from standings and race results
        const [standingsResponse, resultsResponse] = await Promise.all([
          fetch(`https://api.jolpi.ca/ergast/f1/${season}/driverStandings.json`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          }),
          fetch(`https://api.jolpi.ca/ergast/f1/${season}/drivers/${driverId}/results.json`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          })
        ])

        let teamName = undefined
        let teamNationality = undefined
        let championshipPosition = 0
        let totalPoints = 0
        let totalWins = 0
        let totalPodiums = 0
        let totalRaces = 0
        let recentPerformance: any[] = []

        // Process standings data
        if (standingsResponse.ok) {
          const standingsData = await standingsResponse.json()
          const standings = standingsData.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || []
          const driverStanding = standings.find((standing: any) => 
            standing.Driver.driverId === driverId
          )
          if (driverStanding) {
            championshipPosition = parseInt(driverStanding.position) || 0
            totalPoints = parseFloat(driverStanding.points) || 0
            totalWins = parseInt(driverStanding.wins) || 0
            
            if (driverStanding.Constructors && driverStanding.Constructors.length > 0) {
              const team = driverStanding.Constructors[0]
              if (team && typeof team === 'object' && team.name) {
                teamName = team.name
                teamNationality = team.nationality
              }
            }
          }
        }

        // Process race results data for current season
        let currentSeasonPodiums = 0
        let currentSeasonPoles = 0
        let currentSeasonFastestLaps = 0
        
        if (resultsResponse.ok) {
          const resultsData = await resultsResponse.json()
          const races = resultsData.MRData?.RaceTable?.Races || []
          
          totalRaces = races.length
          
          // Calculate current season stats
          currentSeasonPodiums = races.filter((race: any) => {
            const position = race.Results?.[0]?.position
            return position && ['1', '2', '3'].includes(position)
          }).length

          currentSeasonPoles = races.filter((race: any) => {
            return race.Results?.[0]?.grid === '1'
          }).length

          currentSeasonFastestLaps = races.filter((race: any) => {
            return race.Results?.[0]?.FastestLap?.rank === '1'
          }).length

          // Get recent performance (last 5 races)
          recentPerformance = races.slice(-5).map((race: any) => ({
            race: race.raceName,
            position: parseInt(race.Results?.[0]?.position) || 0,
            points: parseFloat(race.Results?.[0]?.points) || 0,
            fastestLap: race.Results?.[0]?.FastestLap?.rank === '1',
            pole: race.Results?.[0]?.grid === '1',
            date: race.date
          }))
        }

        // Fetch career statistics (all seasons)
        let careerWins = 0
        let careerPodiums = 0
        let careerPoints = 0
        let careerRaces = 0
        let careerPoles = 0
        let careerFastestLaps = 0
        let careerBest = 1

        try {
          // Get complete career data from driver's debut year onwards
          const currentYear = new Date().getFullYear()
          const careerStartYear = Math.max(1950, parseInt(season) - 15)
          
          const careerPromises = []
          for (let year = careerStartYear; year <= currentYear; year++) {
            if (year !== parseInt(season)) { // Skip current season as we already have it
              careerPromises.push(
                                 fetch(`https://api.jolpi.ca/ergast/f1/${year}/drivers/${driverId}/results.json`, {
                   method: 'GET',
                   headers: {
                     'Accept': 'application/json',
                     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                   }
                 }).then(res => res.ok ? res.json() : null).catch(() => null)
              )
            }
          }

          // Wait for career data with individual timeouts to prevent one failure from affecting others
          const careerResults = await Promise.allSettled(
            careerPromises.map(promise => 
              Promise.race([
                promise,
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Timeout')), 1000000) // 10 second timeout per year
                )
              ]).catch(error => {
                console.log(`API call failed for a year: ${error.message}`)
                return null // Return null instead of throwing to prevent Promise.allSettled from failing
              })
            )
          )
          
          let successfulYears = 0
          careerResults.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
              const races = result.value.MRData?.RaceTable?.Races || []
              careerRaces += races.length
              successfulYears++
              
              races.forEach((race: any) => {
                const position = parseInt(race.Results?.[0]?.position) || 0
                const points = parseFloat(race.Results?.[0]?.points) || 0
                
                careerPoints += points
                
                if (position === 1) careerWins++
                if (position >= 1 && position <= 3) careerPodiums++
                if (race.Results?.[0]?.grid === '1') careerPoles++
                if (race.Results?.[0]?.FastestLap?.rank === '1') careerFastestLaps++
                
                if (position > 0 && position < careerBest) careerBest = position
              })
            }
          })
          
          console.log(`Successfully fetched data from ${successfulYears} years out of ${careerPromises.length} attempted`)
        } catch (error) {
          console.error('Error fetching career data:', error)
          // Don't fallback - let the career data remain as accumulated from successful API calls
          // The career variables will keep their values from successful fetches
          console.log(`Career data accumulated so far: ${careerWins} wins, ${careerPodiums} podiums, ${careerPoints} points`)
        }

        // Add current season to career totals
        careerWins += totalWins
        careerPodiums += currentSeasonPodiums
        careerPoints += totalPoints
        careerRaces += totalRaces
        careerPoles += currentSeasonPoles
        careerFastestLaps += currentSeasonFastestLaps

        return NextResponse.json({
          driverDetails: {
            driverId: driver.driverId,
            code: driver.code,
            firstName: driver.givenName,
            lastName: driver.familyName,
            nationality: driver.nationality,
            dateOfBirth: driver.dateOfBirth,
            url: driver.url,
            driverNumber: driver.permanentNumber ? parseInt(driver.permanentNumber) : undefined,
            teamName: teamName,
            teamNationality: teamNationality
          },
          driverStats: {
            totalWins: careerWins,
            totalPodiums: careerPodiums,
            totalPoints: careerPoints,
            totalRaces: careerRaces,
            totalPoles: careerPoles,
            totalFastestLaps: careerFastestLaps,
            careerBest: careerBest,
            currentSeason: {
              wins: totalWins,
              podiums: currentSeasonPodiums,
              points: totalPoints,
              races: totalRaces,
              position: championshipPosition
            }
          },
          recentPerformance: recentPerformance,
          season: parseInt(season),
          sources: {
            jolpica: true,
            f1Api: false,
            openF1: false
          }
        })
      }
    }

    return NextResponse.json(
      { error: 'Driver not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Error fetching driver details:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch driver details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
