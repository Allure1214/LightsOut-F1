'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Clock, Ruler, Trophy, Calendar, ExternalLink, ArrowLeft, Flag, Route } from 'lucide-react'
import { Circuit } from '@/types'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
import L from 'leaflet'
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function CircuitPage() {
  const params = useParams()
  const [circuit, setCircuit] = useState<Circuit | null>(null)
  const [trackData, setTrackData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.circuitId) {
      fetchCircuit(params.circuitId as string)
      fetchTrackData(params.circuitId as string)
    }
  }, [params.circuitId])

  const fetchCircuit = async (circuitId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/circuits/${circuitId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Circuit not found')
        }
        throw new Error('Failed to fetch circuit')
      }
      const data: Circuit = await response.json()
      setCircuit(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchTrackData = async (circuitId: string) => {
    try {
      const response = await fetch(`/api/circuits/${circuitId}/track`)
      if (response.ok) {
        const data = await response.json()
        setTrackData(data)
      }
    } catch (err) {
      console.warn('Failed to fetch track data:', err)
    }
  }

  if (loading) {
    return <CircuitSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Circuit</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="space-x-4">
            <Button onClick={() => fetchCircuit(params.circuitId as string)}>
              Try Again
            </Button>
            <Link href="/circuits">
              <Button variant="outline">Back to Circuits</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!circuit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Circuit Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested circuit could not be found.</p>
          <Link href="/circuits">
            <Button>Back to Circuits</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/circuits" className="inline-flex items-center text-muted-foreground hover:text-red-600 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Circuits
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold f1-red mb-2">{circuit.name}</h1>
            <div className="flex items-center text-lg text-muted-foreground mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              {circuit.city}, {circuit.country}
            </div>
          </div>
          {circuit.url && (
            <a
              href={circuit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-red-600"
            >
              <ExternalLink className="h-6 w-6" />
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Map */}
        <div className="h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
          {circuit.lat && circuit.lng ? (
            <MapContainer
              center={[circuit.lat, circuit.lng]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {trackData && (
                <GeoJSON
                  data={trackData}
                  style={{
                    color: '#dc2626',
                    weight: 4,
                    opacity: 0.8,
                    fillOpacity: 0.1,
                    fillColor: '#dc2626'
                  }}
                  onEachFeature={(feature, layer) => {
                    if (feature.properties) {
                      const props = feature.properties
                      layer.bindPopup(`
                        <div class="p-2">
                          <h3 class="font-bold text-red-600">${props.Name}</h3>
                          <p class="text-sm text-gray-600">${props.Location}</p>
                          <p class="text-sm text-gray-600">Length: ${props.length} m</p>
                          <p class="text-sm text-gray-600">First GP: ${props.firstgp}</p>
                        </div>
                      `)
                    }
                  }}
                />
              )}
            </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100 text-muted-foreground">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Location data not available</p>
              </div>
            </div>
          )}
        </div>

        {/* Circuit Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flag className="h-5 w-5 mr-2" />
                Circuit Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {circuit.circuitLength && (
                  <div className="flex items-center">
                    <Ruler className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Length</p>
                      <p className="font-semibold">{circuit.circuitLength} km</p>
                    </div>
                  </div>
                )}
                
                {circuit.numberOfCorners && (
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Corners</p>
                      <p className="font-semibold">{circuit.numberOfCorners}</p>
                    </div>
                  </div>
                )}
                
                {circuit.firstParticipationYear && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">First Race</p>
                      <p className="font-semibold">{circuit.firstParticipationYear}</p>
                    </div>
                  </div>
                )}
                
                {circuit.lapRecord && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Lap Record</p>
                      <p className="font-semibold">{circuit.lapRecord}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lap Record Details */}
          {(circuit.fastestLapDriverId || circuit.fastestLapTeamId || circuit.fastestLapYear) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Lap Record Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {circuit.fastestLapDriverId && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Driver:</span>{' '}
                      <span className="font-medium">{circuit.fastestLapDriverId.replace(/_/g, ' ')}</span>
                    </p>
                  )}
                  {circuit.fastestLapTeamId && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Team:</span>{' '}
                      <span className="font-medium">{circuit.fastestLapTeamId.replace(/_/g, ' ')}</span>
                    </p>
                  )}
                  {circuit.fastestLapYear && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Year:</span>{' '}
                      <span className="font-medium">{circuit.fastestLapYear}</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Track Layout */}
          {trackData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Route className="h-5 w-5 mr-2" />
                  Track Layout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trackData.features[0]?.properties && (
                    <>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Track Length:</span>{' '}
                        <span className="font-medium">
                          {(trackData.features[0].properties.length / 1000).toFixed(3)} km
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Altitude:</span>{' '}
                        <span className="font-medium">
                          {trackData.features[0].properties.altitude} m
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Opened:</span>{' '}
                        <span className="font-medium">
                          {trackData.features[0].properties.opened}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">First F1 GP:</span>{' '}
                        <span className="font-medium">
                          {trackData.features[0].properties.firstgp}
                        </span>
                      </p>
                    </>
                  )}
                  <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <p className="text-xs text-red-700 dark:text-red-300">
                      💡 Click on the track in the map to see detailed information
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">City:</span>{' '}
                  <span className="font-medium">{circuit.city || 'N/A'}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Country:</span>{' '}
                  <span className="font-medium">{circuit.country}</span>
                </p>
                {circuit.locality && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Locality:</span>{' '}
                    <span className="font-medium">{circuit.locality}</span>
                  </p>
                )}
                {circuit.lat && circuit.lng && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Coordinates:</span>{' '}
                    <span className="font-medium font-mono text-xs">
                      {circuit.lat.toFixed(4)}, {circuit.lng.toFixed(4)}
                    </span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CircuitSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-10 w-96 mb-2" />
        <Skeleton className="h-6 w-64" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-96 lg:h-[500px] rounded-lg" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
