import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const { teamId } = params
    const { searchParams } = new URL(request.url)
    const season = searchParams.get('season') || '2025'

    console.log(`Fetching team data for ${teamId} in season ${season}`)

    // Try Jolpica F1 API first for constructor details
    const jolpicaUrl = `https://api.jolpi.ca/ergast/f1/${season}/constructors/${teamId}.json`
    
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
      const constructor = data.MRData?.ConstructorTable?.Constructors?.[0]
      
      if (constructor) {
         // Get team information from standings, race results, and driver standings
         const [standingsResponse, resultsResponse, driverStandingsResponse] = await Promise.all([
           fetch(`https://api.jolpi.ca/ergast/f1/${season}/constructorStandings.json`, {
             method: 'GET',
             headers: {
               'Accept': 'application/json',
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
             }
           }),
           fetch(`https://api.jolpi.ca/ergast/f1/${season}/constructors/${teamId}/results.json`, {
             method: 'GET',
             headers: {
               'Accept': 'application/json',
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
             }
           }),
           fetch(`https://api.jolpi.ca/ergast/f1/${season}/driverStandings.json`, {
             method: 'GET',
             headers: {
               'Accept': 'application/json',
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
             }
           })
         ])

        let championshipPosition = 0
        let totalPoints = 0
        let totalWins = 0
        let totalRaces = 0
        let recentPerformance: any[] = []
        let drivers: any[] = []

        // Process standings data
        if (standingsResponse.ok) {
          const standingsData = await standingsResponse.json()
          const standings = standingsData.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || []
          const teamStanding = standings.find((standing: any) => 
            standing.Constructor.constructorId === teamId
          )
          if (teamStanding) {
            championshipPosition = parseInt(teamStanding.position) || 0
            totalPoints = parseFloat(teamStanding.points) || 0
            totalWins = parseInt(teamStanding.wins) || 0
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
            const results = race.Results || []
            return results.some((result: any) => {
              const position = parseInt(result.position) || 0
              return position >= 1 && position <= 3
            })
          }).length

          currentSeasonPoles = races.filter((race: any) => {
            const results = race.Results || []
            return results.some((result: any) => result.grid === '1')
          }).length

          currentSeasonFastestLaps = races.filter((race: any) => {
            const results = race.Results || []
            return results.some((result: any) => result.FastestLap?.rank === '1')
          }).length

          // Get recent performance (last 5 races)
          recentPerformance = races.slice(-5).map((race: any) => {
            const results = race.Results || []
            const bestResult = results.reduce((best: any, current: any) => {
              const currentPos = parseInt(current.position) || 999
              const bestPos = parseInt(best.position) || 999
              return currentPos < bestPos ? current : best
            }, results[0] || {})

            return {
              race: race.raceName,
              position: parseInt(bestResult.position) || 0,
              points: parseFloat(bestResult.points) || 0,
              fastestLap: bestResult.FastestLap?.rank === '1',
              pole: bestResult.grid === '1',
              date: race.date,
              driver: bestResult.Driver ? `${bestResult.Driver.givenName} ${bestResult.Driver.familyName}` : 'Unknown'
            }
          })

           // Get drivers for this team from driver standings (more accurate)
           if (driverStandingsResponse.ok) {
             const driverStandingsData = await driverStandingsResponse.json()
             const driverStandings = driverStandingsData.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || []
             
             // Filter drivers for this team
             const teamDrivers = driverStandings.filter((standing: any) => 
               standing.Constructors && standing.Constructors.length > 0 && 
               standing.Constructors[0].constructorId === teamId
             )
             
             drivers = teamDrivers.map((standing: any) => ({
               driverId: standing.Driver.driverId,
               firstName: standing.Driver.givenName,
               lastName: standing.Driver.familyName,
               nationality: standing.Driver.nationality,
               code: standing.Driver.code,
               wins: parseInt(standing.wins) || 0,
               podiums: 0, // We'll calculate this from race results
               points: parseFloat(standing.points) || 0
             }))
             
             // Calculate podiums from race results for each driver
             drivers.forEach((driver: any) => {
               let podiums = 0
               races.forEach((race: any) => {
                 const results = race.Results || []
                 const driverResult = results.find((result: any) => 
                   result.Driver && result.Driver.driverId === driver.driverId
                 )
                 if (driverResult) {
                   const position = parseInt(driverResult.position) || 0
                   if (position >= 1 && position <= 3) {
                     podiums++
                   }
                 }
               })
               driver.podiums = podiums
             })
           } else {
             // Fallback to race results calculation if driver standings fail
             const driverMap = new Map()
             races.forEach((race: any) => {
               const results = race.Results || []
               results.forEach((result: any) => {
                 if (result.Driver) {
                   const driverId = result.Driver.driverId
                   if (!driverMap.has(driverId)) {
                     driverMap.set(driverId, {
                       driverId: result.Driver.driverId,
                       firstName: result.Driver.givenName,
                       lastName: result.Driver.familyName,
                       nationality: result.Driver.nationality,
                       code: result.Driver.code,
                       wins: 0,
                       podiums: 0,
                       points: 0
                     })
                   }
                   const driver = driverMap.get(driverId)
                   const position = parseInt(result.position) || 0
                   const points = parseFloat(result.points) || 0
                   
                   // Accumulate points across all races
                   driver.points += points
                   if (position === 1) driver.wins++
                   if (position >= 1 && position <= 3) driver.podiums++
                 }
               })
             })
             drivers = Array.from(driverMap.values())
           }
        }

        // Fetch career statistics (all seasons)
        let careerWins = 0
        let careerPodiums = 0
        let careerPoints = 0
        let careerRaces = 0
        let careerPoles = 0
        let careerFastestLaps = 0
        let championshipTitles = 0

        try {
          // Get complete career data from team's debut year onwards
          const currentYear = new Date().getFullYear()
          const careerStartYear = Math.max(1950, parseInt(season) - 75)
          
          const careerPromises = []
          for (let year = careerStartYear; year <= currentYear; year++) {
            if (year !== parseInt(season)) { // Skip current season as we already have it
              careerPromises.push(
                fetch(`https://api.jolpi.ca/ergast/f1/${year}/constructors/${teamId}/results.json`, {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                  }
                }).then(res => res.ok ? res.json() : null).catch(() => null)
              )
            }
          }

          // Wait for career data with individual timeouts
          const careerResults = await Promise.allSettled(
            careerPromises.map(promise => 
              Promise.race([
                promise,
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Timeout')), 10000)
                )
              ]).catch(() => null)
            )
          )
          
          let successfulYears = 0
          careerResults.forEach((result) => {
            if (result.status === 'fulfilled' && result.value) {
              const races = result.value.MRData?.RaceTable?.Races || []
              careerRaces += races.length
              successfulYears++
              
              races.forEach((race: any) => {
                const results = race.Results || []
                results.forEach((result: any) => {
                  const position = parseInt(result.position) || 0
                  const points = parseFloat(result.points) || 0
                  
                  careerPoints += points
                  
                  if (position === 1) careerWins++
                  if (position >= 1 && position <= 3) careerPodiums++
                  if (result.grid === '1') careerPoles++
                  if (result.FastestLap?.rank === '1') careerFastestLaps++
                })
              })
            }
          })
          
          console.log(`Successfully fetched team career data from ${successfulYears} years out of ${careerPromises.length} attempted`)
          
          // Calculate championship titles by checking final standings for each year
          const championshipPromises = []
          for (let year = careerStartYear; year <= currentYear; year++) {
            championshipPromises.push(
              fetch(`https://api.jolpi.ca/ergast/f1/${year}/constructorStandings.json`, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
              }).then(res => res.ok ? res.json() : null).catch(() => null)
            )
          }
          
          const championshipResults = await Promise.allSettled(
            championshipPromises.map(promise => 
              Promise.race([
                promise,
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Timeout')), 10000)
                )
              ]).catch(() => null)
            )
          )
          
          championshipResults.forEach((result) => {
            if (result.status === 'fulfilled' && result.value) {
              const standings = result.value.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || []
              const teamStanding = standings.find((standing: any) => 
                standing.Constructor.constructorId === teamId && parseInt(standing.position) === 1
              )
              if (teamStanding) {
                championshipTitles++
              }
            }
          })
          
        } catch (error) {
          console.error('Error fetching team career data:', error)
          console.log(`Team career data accumulated so far: ${careerWins} wins, ${careerPodiums} podiums, ${careerPoints} points`)
        }

        // Add current season to career totals
        careerWins += totalWins
        careerPodiums += currentSeasonPodiums
        careerPoints += totalPoints
        careerRaces += totalRaces
        careerPoles += currentSeasonPoles
        careerFastestLaps += currentSeasonFastestLaps

        return NextResponse.json({
          teamDetails: {
            teamId: constructor.constructorId,
            name: constructor.name,
            nationality: constructor.nationality,
            url: constructor.url
          },
          teamStats: {
            totalWins: careerWins,
            totalPodiums: careerPodiums,
            totalPoints: careerPoints,
            totalRaces: careerRaces,
            totalPoles: careerPoles,
            totalFastestLaps: careerFastestLaps,
            championshipTitles: championshipTitles,
            currentSeason: {
              wins: totalWins,
              podiums: currentSeasonPodiums,
              points: totalPoints,
              races: totalRaces,
              position: championshipPosition
            }
          },
          drivers: drivers,
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
      { error: 'Team not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Error fetching team details:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch team details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
