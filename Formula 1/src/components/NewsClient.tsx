'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Calendar, ExternalLink, Clock, Filter, RefreshCw } from 'lucide-react'
import { NewsCard } from '@/components/NewsCard'
import { NewsSkeleton } from '@/components/NewsSkeleton'
import { NewsArticle } from '@/types'
import { searchArticles, filterArticlesByCategory } from '@/lib/newsUtils'

interface NewsClientProps {
  initialArticles: NewsArticle[]
}

const CATEGORIES = [
  'All',
  'Race Results',
  'Testing',
  'Driver News',
  'Technical',
  'Circuit News',
  'Regulations',
  'Team News',
  'Format Changes'
]

export function NewsClient({ initialArticles }: NewsClientProps) {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles)
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>(initialArticles)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(false)
  const [showFeatured, setShowFeatured] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)

  // Filter and search articles
  useEffect(() => {
    let filtered = articles

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filterArticlesByCategory(filtered, selectedCategory)
    }

    // Search articles
    if (searchQuery.trim()) {
      filtered = searchArticles(filtered, searchQuery)
    }

    setFilteredArticles(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [articles, searchQuery, selectedCategory])

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

  // Get featured article (first article with image)
  const featuredArticle = filteredArticles.find(article => article.image)
  const remainingArticles = paginatedArticles.filter(article => article.id !== featuredArticle?.id)

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/news')
      if (response.ok) {
        const newArticles = await response.json()
        setArticles(newArticles)
      }
    } catch (error) {
      console.error('Error refreshing news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen news-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
      {/* Header Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          Latest <span className="f1-red">F1 News</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Stay up-to-date with the latest Formula 1 news, race updates, driver transfers, and technical developments from around the world.
        </p>
      </section>

      {/* Search and Filter Section */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search F1 news..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Today
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Results Count and Pagination Controls */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredArticles.length)} of {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value={9}>9</option>
            <option value={15}>15</option>
            <option value={24}>24</option>
          </select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>
      </section>

      {/* Featured News Section */}
      {showFeatured && featuredArticle && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Featured News</h2>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="md:flex">
              {featuredArticle.image && (
                <div className="md:w-2/5">
                  <div className="aspect-video md:aspect-[4/3] relative">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="md:w-3/5 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{featuredArticle.category}</Badge>
                  <Badge variant="outline">{featuredArticle.source}</Badge>
                </div>
                <h3 className="text-2xl font-bold mb-3 line-clamp-2">
                  {featuredArticle.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {featuredArticle.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(featuredArticle.publishedAt).toLocaleDateString()}
                  </div>
                  <Button asChild>
                    <a href={featuredArticle.url} target="_blank" rel="noopener noreferrer">
                      Read More
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* News Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All News</h2>
          {showFeatured && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFeatured(false)}
            >
              Hide Featured
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <NewsSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showFeatured ? remainingArticles : paginatedArticles).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* No Results */}
      {filteredArticles.length === 0 && !isLoading && (
        <section className="text-center py-12">
          <div className="space-y-4">
            <div className="text-6xl">🔍</div>
            <h3 className="text-2xl font-bold">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or category filter
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </section>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <section className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className="w-10"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </section>
      )}

      {/* News Sources Info */}
      <section className="bg-muted/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">News Sources</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-2">Official Sources</h4>
            <p>Formula 1 Official Website</p>
            <p>FIA Official News</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Sports Media</h4>
            <p>Autosport</p>
            <p>Motorsport.com</p>
            <p>Sky Sports F1</p>
            <p>Racer</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Specialized</h4>
            <p>The Race</p>
            <p>RacingNews365</p>
            <p>RaceFans</p>
            <p>GPFans</p>
          </div>
        </div>
      </section>
        </div>
      </div>
    </div>
  )
}
