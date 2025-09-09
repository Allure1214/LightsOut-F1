'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Clock, Ruler, Trophy, Calendar, ExternalLink, Search } from 'lucide-react'
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

// Create custom icons
const createDefaultIcon = () => {
  return new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
}

const createSelectedIcon = () => {
  return new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [35, 57],
    iconAnchor: [17, 57],
    popupAnchor: [1, -34],
    shadowSize: [57, 57],
    className: 'selected-marker'
  })
}

interface CircuitsResponse {
  circuits: Circuit[]
  total: number
  limit: number
  offset: number
}

// Component to handle map ref
function MapController({ mapRef, selectedCircuit }: { mapRef: React.RefObject<any>, selectedCircuit: Circuit | null }) {
  useEffect(() => {
    if (mapRef.current && selectedCircuit && selectedCircuit.lat && selectedCircuit.lng) {
      mapRef.current.setView([selectedCircuit.lat, selectedCircuit.lng], 13, {
        animate: true,
        duration: 1
      })
    }
  }, [selectedCircuit, mapRef])

  return null
}

export default function CircuitsPage() {
  const [circuits, setCircuits] = useState<Circuit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    fetchCircuits()
  }, [])

  const fetchCircuits = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/circuits?limit=100')
      if (!response.ok) {
        throw new Error('Failed to fetch circuits')
      }
      const data: CircuitsResponse = await response.json()
      setCircuits(data.circuits)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filteredCircuits = circuits.filter(circuit =>
    circuit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    circuit.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    circuit.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const circuitsWithCoordinates = filteredCircuits.filter(circuit => 
    circuit.lat && circuit.lng
  )

  const handleCircuitClick = (circuit: Circuit) => {
    setSelectedCircuit(circuit)
    if (circuit.lat && circuit.lng && mapRef.current) {
      mapRef.current.setView([circuit.lat, circuit.lng], 13, {
        animate: true,
        duration: 1
      })
    }
  }

  if (loading) {
    return <CircuitsSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Circuits</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchCircuits}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold f1-red mb-4">F1 Circuits</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Explore all Formula 1 circuits around the world with interactive maps and detailed information.
        </p>
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Tip:</strong> Click on any circuit card to center the map on that location, or click on map markers to select circuits.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search circuits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Map */}
        <div className="h-96 lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
          <MapContainer
            ref={mapRef}
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <MapController mapRef={mapRef} selectedCircuit={selectedCircuit} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {circuitsWithCoordinates.map((circuit) => {
              const isSelected = selectedCircuit?.id === circuit.id
              return (
                <Marker
                  key={circuit.id}
                  position={[circuit.lat!, circuit.lng!]}
                  eventHandlers={{
                    click: () => setSelectedCircuit(circuit),
                  }}
                  icon={isSelected ? createSelectedIcon() : createDefaultIcon()}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-red-600">{circuit.name}</h3>
                      <p className="text-sm text-gray-600">{circuit.country}</p>
                      <p className="text-sm text-gray-600">{circuit.city}</p>
                      <Link
                        href={`/circuits/${circuit.circuitId}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>

        {/* Circuits List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">
            Circuits ({filteredCircuits.length})
          </h2>
          <div className="max-h-[600px] overflow-y-auto space-y-3">
            {filteredCircuits.map((circuit) => (
              <Card
                key={circuit.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedCircuit?.id === circuit.id ? 'ring-2 ring-red-500' : ''
                }`}
                onClick={() => handleCircuitClick(circuit)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-red-600 mb-1">
                        {circuit.name}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {circuit.city}, {circuit.country}
                      </div>
                    </div>
                    {circuit.lat && circuit.lng && (
                      <Badge variant="secondary" className="ml-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        On Map
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {circuit.circuitLength && (
                      <div className="flex items-center">
                        <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{circuit.circuitLength} km</span>
                      </div>
                    )}
                    {circuit.numberOfCorners && (
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{circuit.numberOfCorners} corners</span>
                      </div>
                    )}
                    {circuit.firstParticipationYear && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Since {circuit.firstParticipationYear}</span>
                      </div>
                    )}
                    {circuit.lapRecord && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{circuit.lapRecord}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-3">
                      <Link
                        href={`/circuits/${circuit.circuitId}`}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        View Details
                      </Link>
                      {circuit.lat && circuit.lng && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCircuitClick(circuit)
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          Center on Map
                        </button>
                      )}
                    </div>
                    {circuit.url && (
                      <a
                        href={circuit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-red-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CircuitsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-96 mb-6" />
        <Skeleton className="h-10 w-80" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-96 lg:h-[600px] rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
