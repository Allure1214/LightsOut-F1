import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Clock, Calendar } from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  image?: string
  category: string
}

interface NewsCardProps {
  article: NewsArticle
}

export function NewsCard({ article }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 group flex flex-col h-full">
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
            {formatDate(article.publishedAt)}
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
  )
}
