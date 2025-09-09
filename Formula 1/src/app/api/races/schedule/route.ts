import { NextRequest, NextResponse } from 'next/server'

interface Session {
  name: string
  type: 'practice' | 'qualifying' | 'sprint' | 'race'
  date: string
  time: string
  day: string
  order: number
}


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const season = searchParams.get('season') || '2025'

    // Try to fetch race schedule from Jolpica F1 API
    const jolpicaUrl = `https://api.jolpi.ca/ergast/f1/${season}/races.json`
    
    console.log('Fetching race schedule from Jolpica F1 API:', jolpicaUrl)
    
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
    const races = data.MRData.RaceTable.Races || []
    
    if (races.length === 0) {
      throw new Error('No race schedule data found in API response')
    }
    
    const transformedRaces = races.map((race: any) => {
      // Only use real session times from API - no fallback to generated data
      let sessions: Session[] = []
      
      // Check for Sprint weekend first (has Sprint and either SprintQualifying or SprintShootout)
      if (race.Sprint && (race.SprintQualifying || race.SprintShootout) && race.FirstPractice && race.Qualifying) {
        // Modern Sprint weekend format (2023+)
        sessions = [
          {
            name: 'Free Practice 1',
            type: 'practice',
            date: race.FirstPractice.date,
            time: race.FirstPractice.time,
            day: 'Friday',
            order: 1
          },
          {
            name: 'Sprint Shootout',
            type: 'qualifying',
            date: (race.SprintQualifying || race.SprintShootout).date,
            time: (race.SprintQualifying || race.SprintShootout).time,
            day: 'Friday',
            order: 2
          },
          {
            name: 'Sprint Race',
            type: 'sprint',
            date: race.Sprint.date,
            time: race.Sprint.time,
            day: 'Saturday',
            order: 3
          },
          {
            name: 'Qualifying',
            type: 'qualifying',
            date: race.Qualifying.date,
            time: race.Qualifying.time,
            day: 'Saturday',
            order: 4
          },
          {
            name: 'Race',
            type: 'race',
            date: race.date,
            time: race.time,
            day: 'Sunday',
            order: 5
          }
        ]
      }
      // Check for 2022 Sprint weekend format (has Sprint, FirstPractice, SecondPractice, Qualifying)
      else if (race.Sprint && race.FirstPractice && race.SecondPractice && race.Qualifying) {
        // 2022 Sprint weekend format
        sessions = [
          {
            name: 'Free Practice 1',
            type: 'practice',
            date: race.FirstPractice.date,
            time: race.FirstPractice.time,
            day: 'Friday',
            order: 1
          },
          {
            name: 'Qualifying',
            type: 'qualifying',
            date: race.Qualifying.date,
            time: race.Qualifying.time,
            day: 'Friday',
            order: 2
          },
          {
            name: 'Free Practice 2',
            type: 'practice',
            date: race.SecondPractice.date,
            time: race.SecondPractice.time,
            day: 'Saturday',
            order: 3
          },
          {
            name: 'Sprint Race',
            type: 'sprint',
            date: race.Sprint.date,
            time: race.Sprint.time,
            day: 'Saturday',
            order: 4
          },
          {
            name: 'Race',
            type: 'race',
            date: race.date,
            time: race.time,
            day: 'Sunday',
            order: 5
          }
        ]
      }
      // Check for regular weekend (has all four practice sessions)
      else if (race.FirstPractice && race.SecondPractice && race.ThirdPractice && race.Qualifying) {
        // Regular weekend format
        sessions = [
          {
            name: 'Free Practice 1',
            type: 'practice',
            date: race.FirstPractice.date,
            time: race.FirstPractice.time,
            day: 'Friday',
            order: 1
          },
          {
            name: 'Free Practice 2',
            type: 'practice',
            date: race.SecondPractice.date,
            time: race.SecondPractice.time,
            day: 'Friday',
            order: 2
          },
          {
            name: 'Free Practice 3',
            type: 'practice',
            date: race.ThirdPractice.date,
            time: race.ThirdPractice.time,
            day: 'Saturday',
            order: 3
          },
          {
            name: 'Qualifying',
            type: 'qualifying',
            date: race.Qualifying.date,
            time: race.Qualifying.time,
            day: 'Saturday',
            order: 4
          },
          {
            name: 'Race',
            type: 'race',
            date: race.date,
            time: race.time,
            day: 'Sunday',
            order: 5
          }
        ]
      }
      // If no session data available, sessions array remains empty
      
      return {
        round: parseInt(race.round),
        raceName: race.raceName,
        date: race.date,
        time: race.time,
        circuit: {
          circuitId: race.Circuit.circuitId,
          circuitName: race.Circuit.circuitName,
          country: race.Circuit.Location.country,
          locality: race.Circuit.Location.locality,
          lat: parseFloat(race.Circuit.Location.lat),
          lng: parseFloat(race.Circuit.Location.long),
          url: race.Circuit.url
        },
        url: race.url,
        sessions: sessions
      }
    })

    console.log(`Successfully processed ${transformedRaces.length} races`)

    return NextResponse.json({
      season: parseInt(season),
      races: transformedRaces
    })

  } catch (error) {
    console.error('Error fetching race schedule from Jolpica F1 API:', error)
    
    // Return null to indicate API doesn't provide this data
    return NextResponse.json(
      { 
        error: 'Race schedule not available from API',
        details: error instanceof Error ? error.message : 'Unknown error',
        available: false
      },
      { status: 404 }
    )
  }
}

