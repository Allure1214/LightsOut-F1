import { NextRequest, NextResponse } from 'next/server'

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
    
    const transformedRaces = races.map((race: any) => ({
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
      url: race.url
    }))

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

