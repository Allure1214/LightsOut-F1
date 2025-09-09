import { NextRequest, NextResponse } from 'next/server'
import { F1ApiCircuitResponse, JolpiApiCircuitResponse, Circuit } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '30'
    const offset = searchParams.get('offset') || '0'

    // Fetch circuits from F1 API
    const f1ApiResponse = await fetch(
      `https://f1connectapi.vercel.app/api/circuits?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!f1ApiResponse.ok) {
      throw new Error(`F1 API error: ${f1ApiResponse.status}`)
    }

    const f1Data: F1ApiCircuitResponse = await f1ApiResponse.json()

    // Fetch coordinates from Jolpi API for all circuits
    const jolpiApiResponse = await fetch(
      `https://api.jolpi.ca/ergast/f1/circuits/?limit=100&offset=0`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!jolpiApiResponse.ok) {
      throw new Error(`Jolpi API error: ${jolpiApiResponse.status}`)
    }

    const jolpiData: JolpiApiCircuitResponse = await jolpiApiResponse.json()

    // Create a map of circuit coordinates from Jolpi API
    const circuitCoordinates = new Map<string, { lat: number; lng: number; locality: string }>()
    jolpiData.MRData.CircuitTable.Circuits.forEach(circuit => {
      circuitCoordinates.set(circuit.circuitId, {
        lat: parseFloat(circuit.Location.lat),
        lng: parseFloat(circuit.Location.long),
        locality: circuit.Location.locality
      })
    })

    // Merge F1 API data with coordinates from Jolpi API
    const circuits: Circuit[] = f1Data.circuits.map(circuit => {
      const coordinates = circuitCoordinates.get(circuit.circuitId)
      return {
        id: circuit.circuitId,
        circuitId: circuit.circuitId,
        name: circuit.circuitName,
        country: circuit.country,
        city: circuit.city,
        locality: coordinates?.locality,
        lat: coordinates?.lat,
        lng: coordinates?.lng,
        url: circuit.url,
        circuitLength: circuit.circuitLength,
        lapRecord: circuit.lapRecord,
        firstParticipationYear: circuit.firstParticipationYear,
        numberOfCorners: circuit.numberOfCorners,
        fastestLapDriverId: circuit.fastestLapDriverId,
        fastestLapTeamId: circuit.fastestLapTeamId,
        fastestLapYear: circuit.fastestLapYear,
      }
    })

    return NextResponse.json({
      circuits,
      total: f1Data.total,
      limit: f1Data.limit,
      offset: f1Data.offset,
    })
  } catch (error) {
    console.error('Error fetching circuits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch circuits' },
      { status: 500 }
    )
  }
}
