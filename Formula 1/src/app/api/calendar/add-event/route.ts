import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

// Generate OAuth2 authorization URL
export async function GET(request: NextRequest) {
  try {
    // Get values from environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json({ 
        error: 'Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI environment variables.' 
      }, { status: 500 })
    }


    // Create OAuth2 client with actual values
    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri)

    const { searchParams } = new URL(request.url)
    const raceData = searchParams.get('raceData')
    
    if (!raceData) {
      return NextResponse.json({ error: 'Race data is required' }, { status: 400 })
    }

    // Parse race data
    let race
    try {
      race = JSON.parse(decodeURIComponent(raceData))
    } catch (parseError) {
      console.error('Race data parse error:', parseError)
      return NextResponse.json({ error: 'Invalid race data format' }, { status: 400 })
    }
    
    // Generate OAuth2 URL with race data in state
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
      state: raceData, // Pass race data through state parameter
      prompt: 'consent'
    })

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Error generating auth URL:', error)
    return NextResponse.json({ 
      error: 'Failed to generate authorization URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Handle OAuth2 callback and add event to calendar
export async function POST(request: NextRequest) {
  try {
    // Get values from environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json({ 
        error: 'Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI environment variables.' 
      }, { status: 500 })
    }

    // Create OAuth2 client with actual values
    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri)

    const { code, raceData } = await request.json()
    
    if (!code || !raceData) {
      return NextResponse.json({ error: 'Authorization code and race data are required' }, { status: 400 })
    }

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Create calendar service
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    // Parse race data
    const race = JSON.parse(raceData)
    
    // Determine session duration based on session type
    const getSessionDuration = (sessionType?: string) => {
      switch (sessionType) {
        case 'practice':
          return 60 // 1 hour
        case 'sprint':
          return 60 // 1 hour
        case 'qualifying':
          return 60 // 1 hour
        case 'race':
          return 120 // 2 hours
        default:
          return 120 // Default to 2 hours for main race
      }
    }

    // Check if this is a specific session or the main race
    // Look for session type in the race name (e.g., "Azerbaijan Grand Prix - Free Practice 1")
    const sessionMatch = race.raceName.match(/ - (.+)$/)
    let sessionType = 'race' // Default to race
    
    if (sessionMatch) {
      const sessionName = sessionMatch[1].toLowerCase()
      
      if (sessionName.includes('free practice')) {
        sessionType = 'practice'
      } else if (sessionName.includes('sprint shootout') || sessionName.includes('sprint qualifying')) {
        sessionType = 'qualifying' // Sprint shootout/qualifying is similar to regular qualifying
      } else if (sessionName.includes('sprint')) {
        sessionType = 'sprint'
      } else if (sessionName.includes('qualifying')) {
        sessionType = 'qualifying'
      } else if (sessionName.includes('race')) {
        sessionType = 'race'
      }
    }

    const durationMinutes = getSessionDuration(sessionType)
    
    // Create event object
    const event = {
      summary: `${race.raceName} - Formula 1`,
      description: `Formula 1 ${sessionType} at ${race.circuit.circuitName}, ${race.circuit.country}`,
      start: {
        dateTime: race.time ? `${race.date}T${race.time}` : `${race.date}T15:00:00Z`,
        timeZone: 'UTC',
      },
      end: {
        dateTime: race.time 
          ? new Date(new Date(`${race.date}T${race.time}`).getTime() + durationMinutes * 60 * 1000).toISOString()
          : new Date(new Date(`${race.date}T15:00:00Z`).getTime() + durationMinutes * 60 * 1000).toISOString(),
        timeZone: 'UTC',
      },
      location: race.circuit.locality 
        ? `${race.circuit.circuitName}, ${race.circuit.locality}, ${race.circuit.country}`
        : `${race.circuit.circuitName}, ${race.circuit.country}`,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 60 }, // 1 hour before
          { method: 'popup', minutes: 15 }, // 15 minutes before
        ],
      },
    }

    // Add event to primary calendar
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    })

    return NextResponse.json({ 
      success: true, 
      eventId: response.data.id,
      eventUrl: response.data.htmlLink 
    })
  } catch (error) {
    console.error('Error adding event to calendar:', error)
    return NextResponse.json({ 
      error: 'Failed to add event to calendar',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
