import { NextResponse } from 'next/server'
import { NewsArticle } from '@/types'
import { sortArticlesByDate, parseRSSFeed } from '@/lib/newsUtils'

// Mock news data - In a real implementation, you would fetch from RSS feeds or news APIs
const mockNewsData: NewsArticle[] = [
  {
    id: '1',
    title: 'Verstappen Dominates Bahrain Grand Prix Season Opener',
    description: 'Max Verstappen secured a commanding victory at the Bahrain Grand Prix, leading from pole to flag and setting the tone for the 2024 Formula 1 season.',
    url: 'https://www.formula1.com/en/latest/article/verstappen-dominates-bahrain-grand-prix-season-opener.1abc123def',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    source: 'Formula 1 Official',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    category: 'Race Results'
  },
  {
    id: '2',
    title: 'Ferrari Shows Strong Pace in Pre-Season Testing',
    description: 'Ferrari demonstrated impressive performance during the final pre-season test in Bahrain, with both drivers showing consistent pace and reliability.',
    url: 'https://www.autosport.com/f1/news/ferrari-shows-strong-pace-pre-season-testing/1234567',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    source: 'Autosport',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    category: 'Testing'
  },
  {
    id: '3',
    title: 'Hamilton Announces New Multi-Year Contract Extension',
    description: 'Lewis Hamilton has signed a new multi-year contract extension with Mercedes, committing his future to the team until at least 2026.',
    url: 'https://www.motorsport.com/f1/news/hamilton-announces-new-multi-year-contract/9876543',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    source: 'Motorsport.com',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    category: 'Driver News'
  },
  {
    id: '4',
    title: 'Red Bull Introduces Revolutionary Aero Package',
    description: 'Red Bull Racing has unveiled a groundbreaking aerodynamic package that could give them a significant advantage in the upcoming season.',
    url: 'https://www.racefans.net/2024/03/15/red-bull-introduces-revolutionary-aero-package/',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    source: 'RaceFans',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    category: 'Technical'
  },
  {
    id: '5',
    title: 'Saudi Arabia Grand Prix Circuit Upgrades Announced',
    description: 'The Jeddah Corniche Circuit has announced significant upgrades ahead of the 2024 Saudi Arabia Grand Prix, including improved safety features and fan facilities.',
    url: 'https://www.gpfans.com/en/f1-news/1234567/saudi-arabia-grand-prix-circuit-upgrades-announced/',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    source: 'GPFans',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    category: 'Circuit News'
  },
  {
    id: '6',
    title: 'FIA Announces New Safety Regulations for 2024',
    description: 'The FIA has introduced new safety regulations for the 2024 season, focusing on improved driver protection and enhanced track safety measures.',
    url: 'https://www.fia.com/news/fia-announces-new-safety-regulations-2024',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    source: 'FIA Official',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    category: 'Regulations'
  },
  {
    id: '7',
    title: 'McLaren Reveals New Livery for 2024 Season',
    description: 'McLaren has unveiled their striking new livery for the 2024 Formula 1 season, featuring a bold new design and updated sponsor partnerships.',
    url: 'https://www.skysports.com/f1/news/12345/mclaren-reveals-new-livery-2024-season',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    source: 'Sky Sports F1',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    category: 'Team News'
  },
  {
    id: '8',
    title: 'Norris Sets Fastest Time in Final Practice Session',
    description: 'Lando Norris topped the timesheets in the final practice session ahead of the Bahrain Grand Prix, showing McLaren\'s potential for the weekend.',
    url: 'https://www.formula1.com/en/latest/article/norris-sets-fastest-time-final-practice-session.2def456ghi',
    publishedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 30 hours ago
    source: 'Formula 1 Official',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    category: 'Practice'
  },
  {
    id: '9',
    title: 'Aston Martin Confirms Stroll and Alonso for 2024',
    description: 'Aston Martin has confirmed that Lance Stroll and Fernando Alonso will continue as their driver lineup for the 2024 Formula 1 season.',
    url: 'https://www.autosport.com/f1/news/aston-martin-confirms-stroll-alonso-2024/2345678',
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
    source: 'Autosport',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    category: 'Driver News'
  },
  {
    id: '10',
    title: 'New F1 Sprint Format Announced for 2024',
    description: 'Formula 1 has announced changes to the Sprint format for 2024, with new qualifying procedures and enhanced race weekend structure.',
    url: 'https://www.motorsport.com/f1/news/new-f1-sprint-format-announced-2024/3456789',
    publishedAt: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString(), // 42 hours ago
    source: 'Motorsport.com',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    category: 'Format Changes'
  }
]

// RSS Feed URLs for F1 news sources
const RSS_FEEDS = [
  {
    url: 'https://www.formula1.com/en/latest/all.xml',
    source: 'FORMULA1_OFFICIAL'
  },
  {
    url: 'https://www.autosport.com/rss/f1/news/',
    source: 'AUTOSPORT'
  },
  {
    url: 'https://racingnews365.com/feed/news.xml',
    source: 'RACINGNEWS365'
  },
  {
    url: 'https://www.motorsport.com/rss/f1/news/',
    source: 'MOTORSPORT'
  },
  {
    url: 'https://www.the-race.com/rss/',
    source: 'THE_RACE'
  },
  {
    url: 'https://racer.com/f1/feed',
    source: 'RACER'
  }
]

// Function to fetch real news from RSS feeds
async function fetchRealNews(): Promise<NewsArticle[]> {
  const allArticles: NewsArticle[] = []
  
  try {
    // Fetch from all RSS feeds in parallel
    const feedPromises = RSS_FEEDS.map(async (feed) => {
      try {
        const response = await fetch(feed.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          next: { revalidate: 300 } // Cache for 5 minutes
        })
        
        if (!response.ok) {
          console.error(`Failed to fetch ${feed.source}: ${response.status}`)
          return []
        }
        
        const xmlText = await response.text()
        return parseRSSFeed(xmlText, feed.source)
      } catch (error) {
        console.error(`Error fetching ${feed.source}:`, error)
        return []
      }
    })
    
    const feedResults = await Promise.all(feedPromises)
    
    // Flatten all articles from all feeds
    feedResults.forEach(articles => {
      allArticles.push(...articles)
    })
    
    // If we got real articles, return them, otherwise fall back to mock data
    if (allArticles.length > 0) {
      return allArticles
    }
  } catch (error) {
    console.error('Error fetching RSS feeds:', error)
  }
  
  // Fallback to mock data if RSS fetching fails
  return mockNewsData
}

export async function GET() {
  try {
    // In production, you would implement real RSS feed fetching here
    const newsArticles = await fetchRealNews()
    
    // Sort by publication date (newest first)
    const sortedArticles = sortArticlesByDate(newsArticles)
    
    return NextResponse.json(sortedArticles)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
