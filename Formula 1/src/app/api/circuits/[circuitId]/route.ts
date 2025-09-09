import { NextRequest, NextResponse } from 'next/server'
import { F1ApiCircuitResponse, JolpiApiCircuitResponse, Circuit } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { circuitId: string } }
) {
  try {
    const { circuitId } = params

    // Fetch circuit details from F1 API
    const f1ApiResponse = await fetch(
      `https://f1connectapi.vercel.app/api/circuits?limit=100&offset=0`,
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
    const circuit = f1Data.circuits.find(c => c.circuitId === circuitId)

    if (!circuit) {
      return NextResponse.json(
        { error: 'Circuit not found' },
        { status: 404 }
      )
    }

    // Fetch coordinates from Jolpi API
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
    const jolpiCircuit = jolpiData.MRData.CircuitTable.Circuits.find(c => c.circuitId === circuitId)

    // Merge data
    const circuitData: Circuit = {
      id: circuit.circuitId,
      circuitId: circuit.circuitId,
      name: circuit.circuitName,
      country: circuit.country,
      city: circuit.city,
      locality: jolpiCircuit?.Location.locality,
      lat: jolpiCircuit ? parseFloat(jolpiCircuit.Location.lat) : undefined,
      lng: jolpiCircuit ? parseFloat(jolpiCircuit.Location.long) : undefined,
      url: circuit.url,
      circuitLength: circuit.circuitLength,
      lapRecord: circuit.lapRecord,
      firstParticipationYear: circuit.firstParticipationYear,
      numberOfCorners: circuit.numberOfCorners,
      fastestLapDriverId: circuit.fastestLapDriverId,
      fastestLapTeamId: circuit.fastestLapTeamId,
      fastestLapYear: circuit.fastestLapYear,
    }

    return NextResponse.json(circuitData)
  } catch (error) {
    console.error('Error fetching circuit:', error)
    return NextResponse.json(
      { error: 'Failed to fetch circuit' },
      { status: 500 }
    )
  }
}
