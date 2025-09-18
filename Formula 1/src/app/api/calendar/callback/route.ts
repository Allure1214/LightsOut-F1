import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

export async function GET(request: NextRequest) {
  try {
    // Get values from environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/races?calendar_error=${encodeURIComponent('Google OAuth credentials not configured')}`)
    }


    // Create OAuth2 client with actual values
    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri)

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')


    if (error) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/races?calendar_error=${encodeURIComponent(error)}`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/races?calendar_error=missing_parameters`)
    }

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Create calendar service
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    // Parse race data from state
    const race = JSON.parse(decodeURIComponent(state))
    
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
      console.log('Detected session name:', sessionName)
      
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
    
    console.log('Detected session type:', sessionType)
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

    // Return HTML that closes the popup and notifies the parent window
    const successHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Calendar Event Added</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .success-container {
              text-align: center;
              background: rgba(255, 255, 255, 0.1);
              padding: 2rem;
              border-radius: 12px;
              backdrop-filter: blur(10px);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            .success-icon {
              font-size: 3rem;
              margin-bottom: 1rem;
            }
            .success-title {
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 0.5rem;
            }
            .success-message {
              font-size: 1rem;
              opacity: 0.9;
              margin-bottom: 1rem;
            }
            .close-button {
              background: rgba(255, 255, 255, 0.2);
              border: 1px solid rgba(255, 255, 255, 0.3);
              color: white;
              padding: 0.75rem 1.5rem;
              border-radius: 6px;
              cursor: pointer;
              font-size: 0.9rem;
              transition: all 0.2s ease;
            }
            .close-button:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          </style>
        </head>
        <body>
          <div class="success-container">
            <div class="success-icon">✅</div>
            <div class="success-title">Event Added Successfully!</div>
            <div class="success-message">The race has been added to your Google Calendar.</div>
            <button class="close-button" onclick="closePopup()">Close Window</button>
          </div>
          <script>
            // Notify parent window of success
            if (window.opener) {
              window.opener.postMessage({
                type: 'CALENDAR_SUCCESS',
                eventId: '${response.data.id}',
                eventUrl: '${response.data.htmlLink}'
              }, '*');
            }
            
            // Auto-close after 2 seconds
            setTimeout(() => {
              closePopup();
            }, 2000);
            
            function closePopup() {
              if (window.opener) {
                window.close();
              } else {
                // Fallback: redirect to races page
                window.location.href = '${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/races?calendar_success=true&event_id=${response.data.id}';
              }
            }
          </script>
        </body>
      </html>
    `
    
    return new NextResponse(successHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error in calendar callback:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/races?calendar_error=${encodeURIComponent('Failed to add event to calendar')}`)
  }
}
