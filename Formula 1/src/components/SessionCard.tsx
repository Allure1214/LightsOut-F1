'use client'

import { Badge } from '@/components/ui/badge'
import { Clock, Calendar, Zap, Target, Trophy, Flag } from 'lucide-react'

interface Session {
  name: string
  type: 'practice' | 'qualifying' | 'sprint' | 'race'
  date: string
  time: string
  day: string
  order: number
}

interface SessionCardProps {
  session: Session
  isCompleted?: boolean
  isLive?: boolean
  isUpcoming?: boolean
}

function getSessionTypeColor(type: string): string {
  switch (type) {
    case 'practice':
      return 'text-blue-600 bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300'
    case 'qualifying':
      return 'text-purple-600 bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300'
    case 'sprint':
      return 'text-orange-600 bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300'
    case 'race':
      return 'text-red-600 bg-gradient-to-br from-red-100 to-red-200 border-red-300'
    default:
      return 'text-gray-600 bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'
  }
}

function getSessionTypeIcon(type: string) {
  switch (type) {
    case 'practice':
      return <Target className="w-3 h-3" />
    case 'qualifying':
      return <Flag className="w-3 h-3" />
    case 'sprint':
      return <Zap className="w-3 h-3" />
    case 'race':
      return <Trophy className="w-3 h-3" />
    default:
      return <Clock className="w-3 h-3" />
  }
}

function formatSessionTime(dateString: string, timeString: string): string {
  const utcTime = new Date(`${dateString}T${timeString}`)
  const localTime = utcTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })
  return localTime
}

function getSessionStatus(isCompleted?: boolean, isLive?: boolean, isUpcoming?: boolean): string {
  if (isCompleted) return 'Completed'
  if (isLive) return 'Live'
  if (isUpcoming) return 'Upcoming'
  return 'Scheduled'
}

export function SessionCard({ session, isCompleted = false, isLive = false, isUpcoming = false }: SessionCardProps) {
  const localTime = formatSessionTime(session.date, session.time)
  const status = getSessionStatus(isCompleted, isLive, isUpcoming)

  return (
    <div className={`p-3 rounded-lg border transition-all duration-200 ${
      isLive ? 'ring-2 ring-red-200 bg-gradient-to-r from-red-50 to-red-100' : 
      isCompleted ? 'bg-muted/30' : 
      'bg-background hover:bg-muted/50'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge 
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 shadow-sm ${getSessionTypeColor(session.type)}`}
          >
            {getSessionTypeIcon(session.type)}
          </Badge>
          <div>
            <div className="font-semibold text-sm">{session.name}</div>
            <div className="text-xs text-muted-foreground">{session.day}</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-semibold">{localTime}</div>
          <div className="text-xs text-muted-foreground">
            {status}
            {isLive && (
              <span className="ml-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block"></div>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
