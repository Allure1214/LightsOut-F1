'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Flag, Clock, MapPin, ExternalLink, ChevronRight, Trophy, Users, Zap, Target, ChevronDown } from 'lucide-react'
import { SessionCard } from './SessionCard'
import { useState } from 'react'

interface Session {
  name: string
  type: 'practice' | 'qualifying' | 'sprint' | 'race'
  date: string
  time: string
  day: string
  order: number
}

interface Race {
  round: number
  raceName: string
  date: string
  time?: string
  circuit: {
    circuitId: string
    circuitName: string
    country: string
    locality?: string
    lat?: number
    lng?: number
    url?: string
  }
  url?: string
  sessions?: Session[]
}

interface RaceCardProps {
  race: Race
  status: 'upcoming' | 'completed' | 'live'
}

function getRaceStatusColor(status: string): string {
  switch (status) {
    case 'upcoming':
      return 'text-blue-600 bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300'
    case 'live':
      return 'text-red-600 bg-gradient-to-br from-red-100 to-red-200 border-red-300'
    case 'completed':
      return 'text-green-600 bg-gradient-to-br from-green-100 to-green-200 border-green-300'
    default:
      return 'text-gray-600 bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'
  }
}

function getRaceStatusIcon(status: string) {
  switch (status) {
    case 'upcoming':
      return <Calendar className="w-4 h-4" />
    case 'live':
      return <Zap className="w-4 h-4" />
    case 'completed':
      return <Trophy className="w-4 h-4" />
    default:
      return <Calendar className="w-4 h-4" />
  }
}

function getRaceStatusText(status: string): string {
  switch (status) {
    case 'upcoming':
      return 'Upcoming'
    case 'live':
      return 'Live'
    case 'completed':
      return 'Completed'
    default:
      return 'Unknown'
  }
}

function formatRaceDate(dateString: string, timeString?: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  
  let formattedDate = date.toLocaleDateString('en-US', options)
  
  if (timeString) {
    // Parse time (format: HH:MM:SSZ) and convert to local timezone
    const utcTime = new Date(`${dateString}T${timeString}`)
    const localTime = utcTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
    formattedDate += ` at ${localTime}`
  }
  
  return formattedDate
}

function getDaysUntilRace(dateString: string): string {
  const now = new Date()
  const raceDate = new Date(dateString)
  
  // Get start of day in local timezone for both dates
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const raceStart = new Date(raceDate.getFullYear(), raceDate.getMonth(), raceDate.getDate())
  
  const timeDiff = raceStart.getTime() - nowStart.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  
  if (daysDiff < 0) return 'Past'
  if (daysDiff === 0) return 'Today'
  if (daysDiff === 1) return 'Tomorrow'
  return `${daysDiff} days`
}

export function RaceCard({ race, status }: RaceCardProps) {
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false)
  const daysUntil = getDaysUntilRace(race.date)
  const isPast = status === 'completed'
  const isLive = status === 'live'
  const isUpcoming = status === 'upcoming'

  return (
    <Card className={`overflow-hidden shadow-lg transition-all duration-200 hover:shadow-xl ${
      isLive ? 'ring-2 ring-red-200 bg-gradient-to-r from-red-50 to-red-100' : ''
    }`}>
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 shadow-sm ${getRaceStatusColor(status)}`}
            >
              {getRaceStatusIcon(status)}
              <span className="ml-1">{race.round}</span>
            </Badge>
            <div>
              <CardTitle className="text-xl">{race.raceName}</CardTitle>
              <CardDescription className="text-base">
                Round {race.round} • {race.circuit.circuitName}
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              {getRaceStatusText(status)}
            </Badge>
            {isUpcoming && (
              <div className="text-sm text-muted-foreground">
                {daysUntil}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Race Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-semibold">
                  {formatRaceDate(race.date, race.time)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isPast ? 'Race completed' : isLive ? 'Race in progress' : 'Race scheduled'}
                  {race.time && (
                    <span className="ml-2 text-xs">
                      ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-semibold">
                  {race.circuit.locality && `${race.circuit.locality}, `}
                  {race.circuit.country}
                </div>
                <div className="text-sm text-muted-foreground">
                  {race.circuit.circuitName}
                </div>
              </div>
            </div>
          </div>

          {/* Race Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Race Details</span>
              <Button variant="outline" size="sm" asChild>
                <a href={race.url || '#'} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Details
                </a>
              </Button>
            </div>
            
            {isPast && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Results</span>
                <Button variant="outline" size="sm">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Results
                </Button>
              </div>
            )}
            
            {isUpcoming && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Countdown</span>
                <div className="text-sm font-semibold text-blue-600">
                  {daysUntil}
                </div>
              </div>
            )}
            
            {isLive && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-red-600">Live</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Weekend Schedule */}
        {race.sessions && race.sessions.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="mb-4">
              <button
                onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
                className="flex items-center justify-between w-full text-left hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
              >
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Weekend Schedule
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({race.sessions.length} sessions)
                  </span>
                </h4>
                <ChevronDown 
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                    isScheduleExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {isScheduleExpanded && (
                <div className="mt-3 space-y-2">
                  {race.sessions.map((session) => {
                    const sessionDate = new Date(session.date)
                    const now = new Date()
                    const isCompleted = sessionDate < now
                    const isLive = sessionDate.toDateString() === now.toDateString() && 
                      new Date(`${session.date}T${session.time}`) <= now
                    const isUpcoming = sessionDate > now || (sessionDate.toDateString() === now.toDateString() && 
                      new Date(`${session.date}T${session.time}`) > now)
                    
                    return (
                      <SessionCard
                        key={`${session.name}-${session.date}`}
                        session={session}
                        isCompleted={isCompleted}
                        isLive={isLive}
                        isUpcoming={isUpcoming}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Circuit Info */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Country:</span>
                <span className="font-medium">{race.circuit.country}</span>
              </div>
              {race.circuit.lat && race.circuit.lng && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">
                    {race.circuit.lat.toFixed(2)}°, {race.circuit.lng.toFixed(2)}°
                  </span>
                </div>
              )}
            </div>
            <div className="text-muted-foreground">
              Round {race.round} of {24} {/* This could be dynamic based on season */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
