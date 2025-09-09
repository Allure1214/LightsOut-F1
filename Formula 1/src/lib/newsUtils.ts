import { NewsArticle } from '@/types'

// RSS Feed URLs for F1 news sources
export const F1_NEWS_SOURCES = {
  FORMULA1_OFFICIAL: 'https://www.formula1.com/en/latest/all.xml',
  AUTOSPORT: 'https://www.autosport.com/rss/f1/news/',
  MOTORSPORT: 'https://www.motorsport.com/rss/f1/news/',
  RACINGNEWS365: 'https://racingnews365.com/feed/news.xml',
  THE_RACE: 'https://www.the-race.com/rss/',
  RACER: 'https://racer.com/f1/feed',
  RACEFANS: 'https://www.racefans.net/feed/',
  GPFANS: 'https://www.gpfans.com/en/feed/',
  SKY_SPORTS_F1: 'https://feeds.skynews.com/feeds/rss/sports/formula1.xml'
}

// Function to parse RSS XML and convert to NewsArticle format
export function parseRSSFeed(xmlText: string, source: string): NewsArticle[] {
  try {
    // This is a simplified parser - in production, you'd use a proper XML parser
    const items = xmlText.match(/<item>[\s\S]*?<\/item>/g) || []
    
    return items.map((item, index): NewsArticle | null => {
      // Extract title - handle both CDATA and regular content
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)
      const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '').trim() : ''
      
      // Extract description - handle both CDATA and regular content
      const descriptionMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/)
      const description = descriptionMatch ? (descriptionMatch[1] || descriptionMatch[2] || '').trim() : ''
      
      // Extract link
      const linkMatch = item.match(/<link>(.*?)<\/link>/)
      const url = linkMatch ? linkMatch[1].trim() : ''
      
      // Extract publication date
      const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/)
      const publishedAt = pubDateMatch ? new Date(pubDateMatch[1].trim()).toISOString() : new Date().toISOString()
      
      // Extract image - try multiple patterns
      const imageMatch = item.match(/<enclosure[^>]*url="([^"]*)"[^>]*type="image\/[^"]*"[^>]*\/>/) ||
                        item.match(/<media:content[^>]*url="([^"]*)"[^>]*type="image\/[^"]*"[^>]*\/>/) ||
                        item.match(/<image><url>(.*?)<\/url><\/image>/)
      const image = imageMatch ? imageMatch[1].trim() : undefined
      
      // Extract category from title or description
      const category = extractCategory(title, description)
      
      // Clean and validate data
      const cleanTitle = cleanText(title)
      const cleanDescription = cleanText(description)
      
      // Skip if no title or URL
      if (!cleanTitle || !url) {
        return null
      }
      
      return {
        id: `${source}-${index}-${Date.now()}`,
        title: cleanTitle,
        description: cleanDescription,
        url,
        publishedAt,
        source: getSourceName(source),
        image,
        category
      }
    }).filter((article): article is NewsArticle => article !== null)
  } catch (error) {
    console.error('Error parsing RSS feed:', error)
    return []
  }
}

// Function to clean HTML entities and tags from text
function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim()
}

// Function to extract category from title or description
function extractCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase()
  
  if (text.includes('race') || text.includes('grand prix') || text.includes('qualifying') || text.includes('practice')) {
    return 'Race Results'
  } else if (text.includes('test') || text.includes('testing')) {
    return 'Testing'
  } else if (text.includes('driver') || text.includes('contract') || text.includes('signs')) {
    return 'Driver News'
  } else if (text.includes('technical') || text.includes('aero') || text.includes('engine') || text.includes('upgrade')) {
    return 'Technical'
  } else if (text.includes('circuit') || text.includes('track') || text.includes('venue')) {
    return 'Circuit News'
  } else if (text.includes('regulation') || text.includes('rule') || text.includes('fia')) {
    return 'Regulations'
  } else if (text.includes('team') || text.includes('livery') || text.includes('sponsor')) {
    return 'Team News'
  } else if (text.includes('sprint') || text.includes('format') || text.includes('schedule')) {
    return 'Format Changes'
  } else {
    return 'General'
  }
}

// Function to get display name for source
function getSourceName(source: string): string {
  const sourceNames: Record<string, string> = {
    FORMULA1_OFFICIAL: 'Formula 1 Official',
    AUTOSPORT: 'Autosport',
    MOTORSPORT: 'Motorsport.com',
    RACINGNEWS365: 'RacingNews365',
    THE_RACE: 'The Race',
    RACER: 'Racer',
    RACEFANS: 'RaceFans',
    GPFANS: 'GPFans',
    SKY_SPORTS_F1: 'Sky Sports F1'
  }
  
  return sourceNames[source] || source
}

// Function to fetch news from multiple sources
export async function fetchNewsFromSources(): Promise<NewsArticle[]> {
  const allArticles: NewsArticle[] = []
  
  // In a real implementation, you would fetch from actual RSS feeds
  // For now, we'll return mock data
  return allArticles
}

// Function to sort articles by date
export function sortArticlesByDate(articles: NewsArticle[]): NewsArticle[] {
  return articles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

// Function to filter articles by category
export function filterArticlesByCategory(articles: NewsArticle[], category: string): NewsArticle[] {
  if (!category || category === 'all') return articles
  return articles.filter(article => 
    article.category.toLowerCase() === category.toLowerCase()
  )
}

// Function to search articles by query
export function searchArticles(articles: NewsArticle[], query: string): NewsArticle[] {
  if (!query.trim()) return articles
  
  const searchQuery = query.toLowerCase()
  return articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery) ||
    article.description.toLowerCase().includes(searchQuery) ||
    article.source.toLowerCase().includes(searchQuery) ||
    article.category.toLowerCase().includes(searchQuery)
  )
}
