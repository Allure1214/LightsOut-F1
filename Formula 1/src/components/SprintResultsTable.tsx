'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Zap, Flag, Clock, Target, Timer } from 'lucide-react'

interface Driver {
  driverId: string
  givenName: string
  familyName: string
  nationality: string
  code?: string
}

interface Constructor {
  constructorId: string
  name: string
  nationality: string
}

interface SprintResult {
  position: number
  positionText: string
  points: number
  driver: Driver
  constructor: Constructor
  grid: number
  laps: number
  status: string
  time?: {
    millis?: string
    time?: string
  }
  fastestLap?: {
    rank: string
    lap: string
    time: {
      time: string
    }
    averageSpeed?: {
      units: string
      speed: string
    }
  }
}

interface SprintResultsTableProps {
  results: SprintResult[]
}

function getPositionColor(position: number): string {
  if (position === 1) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
  if (position === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
  if (position === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white'
  if (position <= 8) return 'bg-orange-100 text-orange-800'
  return 'bg-gray-100 text-gray-800'
}

function getStatusColor(status: string): string {
  if (status === 'Finished') return 'text-green-600'
  if (status.includes('Lap')) return 'text-yellow-600'
  if (status.includes('Accident')) return 'text-red-600'
  if (status.includes('Engine')) return 'text-red-600'
  if (status.includes('Gearbox')) return 'text-red-600'
  if (status.includes('Hydraulics')) return 'text-red-600'
  if (status.includes('Electrical')) return 'text-red-600'
  if (status.includes('Collision')) return 'text-red-600'
  if (status.includes('Spun off')) return 'text-orange-600'
  if (status.includes('Retired')) return 'text-red-600'
  return 'text-gray-600'
}

function getDriverName(driver: Driver): string {
  return `${driver.givenName} ${driver.familyName}`
}

function getConstructorName(constructor: Constructor): string {
  // Map constructor names to shorter versions
  const nameMap: { [key: string]: string } = {
    'Red Bull Racing': 'Red Bull',
    'Scuderia Ferrari': 'Ferrari',
    'Mercedes': 'Mercedes',
    'McLaren': 'McLaren',
    'Aston Martin': 'Aston Martin',
    'Alpine F1 Team': 'Alpine',
    'Williams': 'Williams',
    'AlphaTauri': 'AlphaTauri',
    'Alfa Romeo': 'Alfa Romeo',
    'Haas F1 Team': 'Haas',
    'RB F1 Team': 'RB'
  }
  return nameMap[constructor.name] || constructor.name
}

export function SprintResultsTable({ results }: SprintResultsTableProps) {
  return (
    <div className="space-y-4">
      {/* Sprint Points Info */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Timer className="w-4 h-4 text-orange-600" />
          <span className="font-semibold text-orange-800">Sprint Points System</span>
        </div>
        <div className="text-sm text-orange-700">
          Points awarded to top 8 finishers: 8-7-6-5-4-3-2-1
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Pos</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Driver</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Constructor</th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Grid</th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Laps</th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Time</th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Points</th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getPositionColor(result.position)}`}>
                      {result.position}
                    </span>
                    {result.fastestLap?.rank === '1' && (
                      <Zap className="w-4 h-4 text-blue-600" title="Fastest Lap" />
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    <div className="font-semibold">{getDriverName(result.driver)}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.driver.code && (
                        <Badge variant="outline" className="text-xs">
                          {result.driver.code}
                        </Badge>
                      )}
                      <span className="ml-2">{result.driver.nationality}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium">{getConstructorName(result.constructor)}</div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm font-medium">{result.grid}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm font-medium">{result.laps}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  {result.time?.time ? (
                    <span className="text-sm font-mono">{result.time.time}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="font-semibold text-orange-600">{result.points}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {results.map((result, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getPositionColor(result.position)}`}>
                    {result.position}
                  </span>
                  <div>
                    <div className="font-semibold text-lg">{getDriverName(result.driver)}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.driver.code && (
                        <Badge variant="outline" className="text-xs mr-2">
                          {result.driver.code}
                        </Badge>
                      )}
                      {result.driver.nationality}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-orange-600">{result.points}</div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Constructor:</span>
                  <div className="font-medium">{getConstructorName(result.constructor)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Grid:</span>
                  <div className="font-medium">{result.grid}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Laps:</span>
                  <div className="font-medium">{result.laps}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <div className="font-medium font-mono">
                    {result.time?.time || '-'}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                  {result.fastestLap?.rank === '1' && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Zap className="w-4 h-4" />
                      <span className="text-xs font-medium">Fastest Lap</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
