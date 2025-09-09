import { NewsClient } from '@/components/NewsClient'
import { NewsArticle } from '@/types'

async function getNewsData(): Promise<NewsArticle[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/news`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch news')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

export default async function NewsPage() {
  const newsArticles = await getNewsData()

  return <NewsClient initialArticles={newsArticles} />
}
