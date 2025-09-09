import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Users, Calendar, Newspaper, Clock, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { NewsArticle } from '@/types'

async function getLatestNews(): Promise<NewsArticle[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/news`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch news')
    }
    
    const news = await response.json()
    // Filter only articles with images and get the first 3
    const articlesWithImages = news.filter((article: NewsArticle) => article.image)
    return articlesWithImages.slice(0, 3)
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

export default async function HomePage() {
  const latestNews = await getLatestNews()
  return (
    <div className="space-y-8">
      {/* Hero Section with F1 Image */}
      <section className="relative">
        {/* F1 Background Image */}
        <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg">
          <Image
            src="/images/F1.jpg"
            alt="Formula 1 Las Vegas Grand Prix - Night race with F1 cars on track"
            fill
            className="object-cover object-bottom"
            priority
          />
          {/* Enhanced overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
                Welcome to{' '}
                <span className="text-red-400 drop-shadow-lg">Formula 1</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-lg text-white/95">
                Your ultimate destination for F1 statistics, news, and analysis. 
                Stay up-to-date with the latest from the world of Formula 1.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" asChild>
                  <a href="/drivers">View Standings</a>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20" asChild>
                  <a href="/news">Latest News</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <Trophy className="h-8 w-8 f1-red mb-2" />
            <CardTitle>Driver Standings</CardTitle>
            <CardDescription>
              Current season standings and historical data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <a href="/drivers">View Standings</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 f1-red mb-2" />
            <CardTitle>Team Standings</CardTitle>
            <CardDescription>
              Constructor championship standings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
            <a href="/teams">View Standings</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Calendar className="h-8 w-8 f1-red mb-2" />
            <CardTitle>Race Calendar</CardTitle>
            <CardDescription>
              Upcoming races and past results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
            <a href="/races">View Calendar</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Newspaper className="h-8 w-8 f1-red mb-2" />
            <CardTitle>Latest News</CardTitle>
            <CardDescription>
              F1 news and articles from top sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <a href="/news">Read News</a>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Latest News Preview */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Latest News</h2>
          <Button variant="outline" asChild>
            <a href="/news">View All News</a>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.length > 0 ? (
            latestNews.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow group flex flex-col h-full">
                {article.image && (
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {article.category}
                      </Badge>
                    </div>
                  </div>
                )}
                <CardHeader className="pb-3 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {article.source}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    asChild
                  >
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      Read Full Article
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            // Fallback if no news is available
            [1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-md mb-4" />
                  <CardTitle className="line-clamp-2">
                    Loading F1 News Article {i}...
                  </CardTitle>
                  <CardDescription>
                    Fetching the latest Formula 1 news and updates...
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">F1 News</Badge>
                    <span className="text-sm text-muted-foreground">
                      Loading...
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

    </div>
  )
}
