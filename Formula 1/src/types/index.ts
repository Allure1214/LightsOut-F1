// F1 Data Types
export interface Driver {
  id: string
  driverId: string
  code?: string
  firstName: string
  lastName: string
  nationality: string
  dateOfBirth?: Date
  url?: string
  image?: string
}

export interface Team {
  id: string
  teamId: string
  name: string
  nationality?: string
  url?: string
  logo?: string
}

export interface Circuit {
  id: string
  circuitId: string
  name: string
  country: string
  locality?: string
  lat?: number
  lng?: number
  url?: string
  image?: string
}

export interface Race {
  id: string
  raceId: string
  seasonId: number
  round: number
  name: string
  date: Date
  time?: string
  url?: string
  circuitId: string
  circuit?: Circuit
}

export interface Result {
  id: string
  raceId: string
  driverId: string
  teamId: string
  position?: number
  positionText?: string
  points: number
  grid?: number
  laps?: number
  status?: string
  time?: string
  fastestLap: boolean
  fastestLapTime?: string
  fastestLapSpeed?: number
  driver?: Driver
  team?: Team
  race?: Race
}

export interface DriverStanding {
  position: number
  driver: Driver
  points: number
  wins: number
  team: Team
}

export interface TeamStanding {
  position: number
  team: Team
  points: number
  wins: number
}

// News and Articles
export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  author?: string
  source?: string
  sourceUrl?: string
  image?: string
  publishedAt: Date
  tags: string[]
  comments?: Comment[]
}

export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  image?: string
  category: string
}

export interface Comment {
  id: string
  content: string
  articleId: string
  userId: string
  parentId?: string
  user?: User
  replies?: Comment[]
  createdAt: Date
}

export interface User {
  id: string
  name?: string
  email: string
  image?: string
  createdAt: Date
}

// API Response Types
export interface ErgastResponse<T> {
  MRData: {
    xmlns: string
    series: string
    url: string
    limit: string
    offset: string
    total: string
    RaceTable?: {
      season?: string
      round?: string
      Races: T[]
    }
    DriverTable?: {
      Drivers: T[]
    }
    ConstructorTable?: {
      Constructors: T[]
    }
    StandingsTable?: {
      season: string
      StandingsLists: Array<{
        season: string
        round: string
        DriverStandings?: Array<{
          position: string
          positionText: string
          points: string
          wins: string
          Driver: any
          Constructors: any[]
        }>
        ConstructorStandings?: Array<{
          position: string
          positionText: string
          points: string
          wins: string
          Constructor: any
        }>
      }>
    }
  }
}
