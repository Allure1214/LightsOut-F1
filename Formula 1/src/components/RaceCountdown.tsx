'use client'

import { useState, useEffect, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Zap, Trophy, Play, Pause, ChevronRight } from 'lucide-react'
import Link from 'next/link'

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

interface RaceCountdownProps {
  className?: string
}

function getDetailedCountdown(dateString: string, timeString?: string): string {
  const now = new Date()
  let raceDateTime: Date
  
  if (timeString) {
    // Combine date and time for precise countdown
    raceDateTime = new Date(`${dateString}T${timeString}`)
  } else {
    // If no time, assume race starts at 15:00 UTC (typical F1 race time)
    raceDateTime = new Date(`${dateString}T15:00:00Z`)
  }
  
  const timeDiff = raceDateTime.getTime() - now.getTime()
  
  if (timeDiff < 0) return 'Past'
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

function getSessionStatus(session: Session): 'upcoming' | 'live' | 'completed' {
  const now = new Date()
  const sessionDateTime = new Date(`${session.date}T${session.time}`)
  
  // Different session durations based on type
  let durationMinutes = 60 // Default 1 hour
  switch (session.type) {
    case 'practice':
      durationMinutes = 60 // 1 hour for practice sessions
      break
    case 'qualifying':
      durationMinutes = 90 // 1.5 hours for qualifying
      break
    case 'sprint':
      durationMinutes = 45 // 45 minutes for sprint races
      break
    case 'race':
      durationMinutes = 120 // 2 hours for main race
      break
  }
  
  const sessionEndTime = new Date(sessionDateTime.getTime() + (durationMinutes * 60 * 1000))
  
  if (now < sessionDateTime) return 'upcoming'
  if (now >= sessionDateTime && now <= sessionEndTime) return 'live'
  return 'completed'
}

function getCurrentLiveSession(race: Race): Session | null {
  if (!race.sessions) return null
  
  const now = new Date()
  
  // Check all sessions in the race weekend (not just today)
  // Race weekends can span multiple days
  for (const session of race.sessions) {
    const status = getSessionStatus(session)
    if (status === 'live') {
      return session
    }
  }
  
  return null
}

function getNextUpcomingSession(race: Race): Session | null {
  if (!race.sessions) return null
  
  const now = new Date()
  
  // Find the next upcoming session
  const upcomingSessions = race.sessions.filter(session => {
    const sessionDateTime = new Date(`${session.date}T${session.time}`)
    return sessionDateTime > now
  })
  
  // Sort by date and time, return the first one
  upcomingSessions.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })
  
  return upcomingSessions[0] || null
}

function getSessionIcon(session: Session) {
  switch (session.type) {
    case 'practice':
      return <Play className="w-4 h-4" />
    case 'qualifying':
      return <Trophy className="w-4 h-4" />
    case 'sprint':
      return <Zap className="w-4 h-4" />
    case 'race':
      return <Trophy className="w-4 h-4" />
    default:
      return <Calendar className="w-4 h-4" />
  }
}

function getSessionStatusColor(status: 'upcoming' | 'live' | 'completed'): string {
  switch (status) {
    case 'upcoming':
      return 'text-blue-600 bg-blue-100 border-blue-300'
    case 'live':
      return 'text-red-600 bg-red-100 border-red-300'
    case 'completed':
      return 'text-green-600 bg-green-100 border-green-300'
    default:
      return 'text-gray-600 bg-gray-100 border-gray-300'
  }
}

export function RaceCountdown({ className = '' }: RaceCountdownProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isClient, setIsClient] = useState(false)
  const [raceData, setRaceData] = useState<Race | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debug: Always show something for testing
  console.log('RaceCountdown render:', { loading, error, raceData: !!raceData, isClient })

  // Update time every second
  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch race data
  useEffect(() => {
    async function fetchRaceData() {
      try {
        setLoading(true)
        setError(null)
        const currentYear = new Date().getFullYear()
        const response = await fetch(`/api/races/schedule?season=${currentYear}`)
        
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to fetch race data: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (!data.races || data.races.length === 0) {
          throw new Error('No race data available')
        }
        
        // Find the next upcoming race or current race weekend
        const now = new Date()
        const upcomingRaces = data.races.filter((race: Race) => {
          const raceDate = new Date(race.date)
          // Include races from 4 days before to 1 day after (race weekend period)
          // This covers Thursday to Monday for a typical race weekend
          const fourDaysBefore = new Date(raceDate.getTime() - (4 * 24 * 60 * 60 * 1000))
          const oneDayAfter = new Date(raceDate.getTime() + (24 * 60 * 60 * 1000))
          return now >= fourDaysBefore && now <= oneDayAfter
        })
        
        if (upcomingRaces.length > 0) {
          // Sort by date and get the closest one
          upcomingRaces.sort((a: Race, b: Race) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateA.getTime() - dateB.getTime()
          })
          
          setRaceData(upcomingRaces[0])
        } else {
          // If no current race weekend, find the next upcoming race
          const futureRaces = data.races.filter((race: Race) => {
            const raceDate = new Date(race.date)
            return raceDate > now
          })
          
          if (futureRaces.length > 0) {
            futureRaces.sort((a: Race, b: Race) => {
              const dateA = new Date(a.date)
              const dateB = new Date(b.date)
              return dateA.getTime() - dateB.getTime()
            })
            
            setRaceData(futureRaces[0])
          }
        }
        
        setError(null)
      } catch (err) {
        console.error('Error fetching race data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch race data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRaceData()
  }, [])

  const liveSession = useMemo(() => {
    if (!raceData) return null
    return getCurrentLiveSession(raceData)
  }, [raceData, currentTime])

  const nextSession = useMemo(() => {
    if (!raceData) return null
    return getNextUpcomingSession(raceData)
  }, [raceData, currentTime])

  const countdown = useMemo(() => {
    if (!isClient || !raceData) return 'Loading...'
    
    if (liveSession) {
      return 'LIVE NOW'
    }
    
    if (nextSession) {
      const countdownText = getDetailedCountdown(nextSession.date, nextSession.time)
      return countdownText === 'Past' ? 'Starting Soon' : countdownText
    }
    
    const countdownText = getDetailedCountdown(raceData.date, raceData.time)
    return countdownText === 'Past' ? 'Race Completed' : countdownText
  }, [isClient, raceData, liveSession, nextSession, currentTime])

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200 py-3 min-h-[60px] ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-pulse flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-32 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    console.log('RaceCountdown error:', error)
    // For debugging, show error state instead of hiding
    return (
      <div className={`bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200 py-3 min-h-[60px] ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-sm text-red-600">
              <Calendar className="w-4 h-4" />
              <span>Error loading race data</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!raceData) {
    // If no race data but no error, show a simple message
    return (
      <div className={`bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200 py-3 min-h-[60px] ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Loading race data...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isLive = !!liveSession
  const sessionToShow = liveSession || nextSession

  return (
    <div className={`bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200 py-3 min-h-[60px] ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isLive ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <Badge className="text-red-600 bg-red-100 border-red-300 font-semibold">
                    LIVE
                  </Badge>
                </div>
              ) : (
                <Clock className="w-4 h-4 text-muted-foreground" />
              )}
              
              <span className="text-sm font-medium text-muted-foreground">
                {isLive ? 'Now Live:' : 'Next:'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {sessionToShow && (
                <>
                  {getSessionIcon(sessionToShow)}
                  <span className="font-semibold text-sm">
                    {sessionToShow.name}
                  </span>
                </>
              )}
              <span className="text-sm text-muted-foreground">
                {raceData.raceName}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-lg font-bold font-mono ${
                isLive ? 'text-red-600' : 'text-blue-600'
              }`}>
                {countdown}
              </div>
              <div className="text-xs text-muted-foreground">
                {raceData.circuit.circuitName}
              </div>
            </div>
            
            <Button size="sm" variant="outline" asChild>
              <Link href="/races" className="flex items-center space-x-1">
                <span>View Schedule</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
