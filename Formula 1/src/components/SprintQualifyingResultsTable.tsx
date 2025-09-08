'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Zap, Flag, Clock, Target, Timer, Award } from 'lucide-react'

interface Driver {
  driverId: string
  givenName: string
  familyName: string
  nationality: string
  code?: string
  number?: number
}

interface Constructor {
  constructorId: string
  name: string
  nationality: string
}

interface SprintQualifyingResult {
  position: number
  driver: Driver
  constructor: Constructor
  sq1?: string
  sq2?: string
  sq3?: string
  bestTime: string
  sessionEliminated: 'SQ1' | 'SQ2' | 'SQ3'
}

interface SprintQualifyingResultsTableProps {
  results: SprintQualifyingResult[]
}

function getPositionColor(position: number): string {
  if (position === 1) return 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-white'
  if (position === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
  if (position === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white'
  if (position <= 10) return 'bg-cyan-100 text-cyan-800'
  return 'bg-gray-100 text-gray-800'
}

function getSessionColor(session: 'SQ1' | 'SQ2' | 'SQ3'): string {
  switch (session) {
    case 'SQ1': return 'text-red-600'
    case 'SQ2': return 'text-yellow-600'
    case 'SQ3': return 'text-green-600'
    default: return 'text-gray-600'
  }
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
    'McLaren Formula 1 Team': 'McLaren',
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

export function SprintQualifyingResultsTable({ results }: SprintQualifyingResultsTableProps) {
  return (
    <div className="space-y-4">
      {/* Sprint Qualifying Format Info */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Timer className="w-4 h-4 text-cyan-600" />
          <span className="font-semibold text-cyan-800">Sprint Qualifying Format</span>
        </div>
        <div className="text-sm text-cyan-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div><span className="font-medium">SQ1:</span> 20 drivers → 15 advance</div>
            <div><span className="font-medium">SQ2:</span> 15 drivers → 10 advance</div>
            <div><span className="font-medium">SQ3:</span> 10 drivers → Sprint grid order</div>
          </div>
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
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">SQ1</th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">SQ2</th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">SQ3</th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Best</th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Eliminated</th>
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
                    {result.position === 1 && (
                      <Award className="w-4 h-4 text-cyan-600" title="Sprint Pole Position" />
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
                  {result.sq1 ? (
                    <span className="text-sm font-mono">{result.sq1}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {result.sq2 ? (
                    <span className="text-sm font-mono">{result.sq2}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {result.sq3 ? (
                    <span className="text-sm font-mono font-semibold text-green-600">{result.sq3}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm font-mono font-semibold text-cyan-600">{result.bestTime}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getSessionColor(result.sessionEliminated)}`}
                  >
                    {result.sessionEliminated}
                  </Badge>
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
                  <div className="font-bold text-lg text-cyan-600">{result.bestTime}</div>
                  <div className="text-sm text-muted-foreground">best time</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Constructor:</span>
                  <div className="font-medium">{getConstructorName(result.constructor)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Eliminated:</span>
                  <div className="font-medium">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getSessionColor(result.sessionEliminated)}`}
                    >
                      {result.sessionEliminated}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Session Times */}
              <div className="grid grid-cols-3 gap-4 text-sm pt-3 border-t">
                <div className="text-center">
                  <div className="text-muted-foreground text-xs">SQ1</div>
                  <div className="font-mono text-sm">
                    {result.sq1 || '-'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground text-xs">SQ2</div>
                  <div className="font-mono text-sm">
                    {result.sq2 || '-'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground text-xs">SQ3</div>
                  <div className="font-mono text-sm">
                    {result.sq3 || '-'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
