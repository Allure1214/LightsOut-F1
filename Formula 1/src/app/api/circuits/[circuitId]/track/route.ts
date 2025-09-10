import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Mapping between F1 API circuit IDs and GeoJSON IDs
const circuitIdMapping: { [key: string]: string } = {
  'albert_park': 'au-1953',
  'bahrein': 'bh-2002',
  'shanghai': 'cn-2004',
  'baku': 'az-2016',
  'catalunya': 'es-1991',
  'monaco': 'mc-1929',
  'villeneuve': 'ca-1978',
  'ricard': 'fr-1969',
  'red_bull_ring': 'at-1969',
  'silverstone': 'gb-1948',
  'hungaroring': 'hu-1986',
  'spa': 'be-1925',
  'zandvoort': 'nl-1948',
  'monza': 'it-1922',
  'marina_bay': 'sg-2008',
  'suzuka': 'jp-1962',
  'americas': 'us-2012',
  'rodriguez': 'mx-1962',
  'interlagos': 'br-1940',
  'yas_marina': 'ae-2009',
  'mugello': 'it-1974',
  'sepang': 'my-1999',
  'portimao': 'pt-2008',
  'istanbul': 'tr-2005',
  'sochi': 'ru-2014',
  'jeddah': 'sa-2021',
  'miami': 'us-2022',
  'las_vegas': 'us-2023',
  'vegas': 'us-2023',
  'losail': 'qa-2004',
  'imola': 'it-1953',
  'nurburgring': 'de-1927',
  'hockenheim': 'de-1932',
  'indianapolis': 'us-1909',
  'kyalami': 'za-1961',
  'adelaide': 'au-1985',
  'phoenix': 'us-1964',
  'detroit': 'us-1982',
  'jacarepagua': 'br-1977',
  'dallas': 'us-1984',
  'estoril': 'pt-1972',
  'magny_cours': 'fr-1960',
  'valencia': 'es-2008',
  'yeongam': 'kr-2010',
  'buddh': 'in-2011',
  'new_jersey': 'us-2013',
  'portugal': 'pt-2008',
  'turkish': 'tr-2005',
  'eifel': 'de-1927',
  'emilia_romagna': 'it-1953',
  'tuscan': 'it-1974',
  'sakhir': 'bh-2002',
  'styre': 'at-1969',
  'portuguese': 'pt-2008',
  'tuscan_gp': 'it-1974',
  'eifel_gp': 'de-1927',
  'emilia_romagna_gp': 'it-1953',
  'turkish_gp': 'tr-2005',
  'sakhir_gp': 'bh-2002',
  '70th_anniversary_gp': 'gb-1950',
  'styre_gp': 'at-1969',
  'portuguese_gp': 'pt-2008',
  'tuscan_grand_prix': 'it-1974',
  'eifel_grand_prix': 'de-1927',
  'emilia_romagna_grand_prix': 'it-1953',
  'turkish_grand_prix': 'tr-2005',
  'sakhir_grand_prix': 'bh-2002',
  '70th_anniversary_grand_prix': 'gb-1950',
  'styre_grand_prix': 'at-1969',
  'portuguese_grand_prix': 'pt-2008'
}

export async function GET(
  request: NextRequest,
  { params }: { params: { circuitId: string } }
) {
  try {
    const { circuitId } = params

    // Read the GeoJSON file
    const geojsonPath = path.join(process.cwd(), 'f1-circuits.geojson')
    const geojsonData = fs.readFileSync(geojsonPath, 'utf8')
    const circuits = JSON.parse(geojsonData)

    // First try to find by mapped ID
    let circuit = null
    const mappedId = circuitIdMapping[circuitId]
    
    if (mappedId) {
      circuit = circuits.features.find((feature: any) => feature.properties.id === mappedId)
    }

    // If not found by mapping, try direct matching
    if (!circuit) {
      circuit = circuits.features.find((feature: any) => {
        const featureId = feature.properties.id
        const featureName = feature.properties.Name.toLowerCase()
        const circuitIdLower = circuitId.toLowerCase()
        
        return featureId === circuitId || 
               featureId === circuitId.replace(/_/g, '-') ||
               featureId === circuitId.replace(/-/g, '_') ||
               featureName.replace(/\s+/g, '-') === circuitIdLower ||
               featureName.replace(/\s+/g, '_') === circuitIdLower ||
               featureName.replace(/\s+/g, '') === circuitIdLower.replace(/_/g, '').replace(/-/g, '')
      })
    }

    if (!circuit) {
      console.log(`Circuit track not found for ID: ${circuitId}`)
      return NextResponse.json(
        { error: 'Circuit track not found' },
        { status: 404 }
      )
    }

    // Return the circuit track as GeoJSON
    return NextResponse.json({
      type: 'FeatureCollection',
      features: [circuit]
    })
  } catch (error) {
    console.error('Error fetching circuit track:', error)
    return NextResponse.json(
      { error: 'Failed to fetch circuit track' },
      { status: 500 }
    )
  }
}
