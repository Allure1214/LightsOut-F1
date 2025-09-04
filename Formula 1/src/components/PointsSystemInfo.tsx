'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Info } from 'lucide-react'

interface PointsSystemInfoProps {
  season: number
}

export function PointsSystemInfo({ season }: PointsSystemInfoProps) {
  // Point systems based on Wikipedia: https://en.wikipedia.org/wiki/List_of_Formula_One_World_Championship_points_scoring_systems
  const getPointsSystem = (year: number) => {
    if (year >= 2025) {
      return {
        era: "Current Era (2025+)",
        description: "Top 10 finishers score points",
        points: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
        positions: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"],
        notes: "Fastest lap point removed from 2025"
      }
    } else if (year >= 2019) {
      return {
        era: "Modern Era (2019-2024)",
        description: "Top 10 finishers score points + fastest lap",
        points: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
        positions: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"],
        notes: "1 point for fastest lap (if finishing in top 10)"
      }
    } else if (year >= 2010) {
      return {
        era: "Modern Era (2010-2018)",
        description: "Top 10 finishers score points",
        points: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
        positions: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"],
        notes: "No fastest lap bonus"
      }
    } else if (year >= 2003) {
      return {
        era: "Early 2000s (2003-2009)",
        description: "Top 8 finishers score points",
        points: [10, 8, 6, 5, 4, 3, 2, 1],
        positions: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"],
        notes: "Simplified 8-point system"
      }
    } else if (year >= 1991) {
      return {
        era: "1990s Era (1991-2002)",
        description: "Top 6 finishers score points",
        points: [10, 6, 4, 3, 2, 1],
        positions: ["1st", "2nd", "3rd", "4th", "5th", "6th"],
        notes: "Classic 10-6-4-3-2-1 system"
      }
    } else if (year >= 1981) {
      return {
        era: "1980s Era (1981-1990)",
        description: "Top 6 finishers score points",
        points: [9, 6, 4, 3, 2, 1],
        positions: ["1st", "2nd", "3rd", "4th", "5th", "6th"],
        notes: "9-6-4-3-2-1 system"
      }
    } else if (year >= 1961) {
      return {
        era: "1960s-1970s Era (1961-1980)",
        description: "Top 6 finishers score points",
        points: [9, 6, 4, 3, 2, 1],
        positions: ["1st", "2nd", "3rd", "4th", "5th", "6th"],
        notes: "9-6-4-3-2-1 system (best results counted)"
      }
    } else if (year >= 1950) {
      return {
        era: "Classic Era (1950-1960)",
        description: "Top 5 finishers score points",
        points: [8, 6, 4, 3, 2],
        positions: ["1st", "2nd", "3rd", "4th", "5th"],
        notes: "8-6-4-3-2 system (best results counted)"
      }
    } else {
      return {
        era: "Unknown Era",
        description: "No data available",
        points: [],
        positions: [],
        notes: "Season not found"
      }
    }
  }

  const pointsSystem = getPointsSystem(season)

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Info className="w-4 h-4" />
          Points System - {pointsSystem.era}
        </CardTitle>
        <CardDescription className="text-xs">
          {pointsSystem.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-3">
          {pointsSystem.points.map((point, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {pointsSystem.positions[index]}: {point}pt{point !== 1 ? 's' : ''}
            </Badge>
          ))}
        </div>
        {pointsSystem.notes && (
          <p className="text-xs text-muted-foreground">
            {pointsSystem.notes}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
