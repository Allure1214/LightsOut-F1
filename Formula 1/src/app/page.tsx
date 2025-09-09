import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Users, Calendar, Newspaper, Clock, ExternalLink, ChevronRight, Star, TrendingUp, Award, Zap } from 'lucide-react'
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
    <div className="min-h-screen">
      <div className="space-y-12 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section with Enhanced Design */}
      <section className="relative">
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden rounded-2xl">
          <Image
            src="/images/F1.jpg"
            alt="Formula 1 Las Vegas Grand Prix - Night race with F1 cars on track"
            fill
            className="object-cover object-bottom"
            priority
          />
          {/* Dynamic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-5xl mx-auto">
              <div className="mb-4 sm:mb-6">
                <Badge className="bg-red-600/90 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium mb-4">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Live F1 Data & Statistics
                </Badge>
              </div>
              
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-red-100 to-red-300 bg-clip-text text-transparent">
                  LightsOut
                </span>
                <br />
                <span className="text-xl sm:text-3xl md:text-5xl text-red-400 font-light">
                  Formula 1 Hub
                </span>
              </h1>
              
              <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed text-white/90 font-light px-2">
                Your ultimate destination for real-time F1 statistics, breaking news, and comprehensive analysis. 
                Experience Formula 1 like never before with live data and expert insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 focus-ring" 
                  asChild
                >
                  <a href="/drivers" className="flex items-center justify-center" aria-label="View driver standings and statistics">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    View Driver Standings
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold backdrop-blur-sm transition-all duration-300 transform hover:scale-105 focus-ring" 
                  asChild
                >
                  <a href="/news" className="flex items-center justify-center" aria-label="Read latest Formula 1 news and articles">
                    <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Latest News
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </a>
                </Button>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section>
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Explore F1 Universe</h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Dive deep into comprehensive Formula 1 data, statistics, and insights
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">Driver Standings</CardTitle>
              <CardDescription className="text-base">
                Real-time championship standings with detailed driver statistics and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 group-hover:shadow-lg transition-all duration-300" 
                asChild
              >
                <a href="/drivers" className="flex items-center justify-center">
                  View Standings
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">Team Standings</CardTitle>
              <CardDescription className="text-base">
                Constructor championship standings with team performance analysis and statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 group-hover:shadow-lg transition-all duration-300" 
                asChild
              >
                <a href="/teams" className="flex items-center justify-center">
                  View Standings
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">Race Calendar</CardTitle>
              <CardDescription className="text-base">
                Complete race schedule with qualifying results, race results, and sprint events
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 group-hover:shadow-lg transition-all duration-300" 
                asChild
              >
                <a href="/races" className="flex items-center justify-center">
                  View Calendar
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Newspaper className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">Latest News</CardTitle>
              <CardDescription className="text-base">
                Breaking F1 news, analysis, and insights from trusted sources worldwide
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 group-hover:shadow-lg transition-all duration-300" 
                asChild
              >
                <a href="/news" className="flex items-center justify-center">
                  Read News
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Latest News Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">Latest F1 News</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Stay updated with the latest Formula 1 news and insights
            </p>
          </div>
          <Button 
            variant="outline" 
            size="lg"
            className="bg-white/50 hover:bg-white/80 border-white/30 text-foreground font-semibold px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto focus-ring"
            asChild
          >
            <a href="/news" className="flex items-center justify-center" aria-label="View all Formula 1 news articles">
              View All News
              <ChevronRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {latestNews.length > 0 ? (
            latestNews.map((article, index) => (
              <Card 
                key={article.id} 
                className={`group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden ${
                  index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {article.image && (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-600/90 text-white font-medium px-3 py-1">
                        {article.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center text-white/80 text-sm">
                        <Clock className="h-4 w-4 mr-2" />
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs font-medium">
                      {article.source}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-xs text-muted-foreground">Featured</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-red-600 transition-colors leading-tight">
                    {article.title}
                  </CardTitle>
                  
                  <CardDescription className="text-sm line-clamp-3 leading-relaxed">
                    {article.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <Button 
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 group-hover:shadow-lg transition-all duration-300"
                    asChild
                  >
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      Read Full Article
                      <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            // Enhanced loading state
            [1, 2, 3].map((i) => (
              <Card key={i} className="group hover:shadow-lg transition-shadow border-0 bg-white/50 dark:bg-slate-800/50">
                <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-t-lg mb-4 animate-pulse" />
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
                  <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      </div>
    </div>
  )
}
