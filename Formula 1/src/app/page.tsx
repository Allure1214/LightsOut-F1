import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Users, Calendar, Newspaper } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
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
              View Calendar
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
            <Button variant="outline" className="w-full">
              Read News
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Recent News Preview */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Latest News</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-md mb-4" />
                <CardTitle className="line-clamp-2">
                  Sample F1 News Article Title {i}
                </CardTitle>
                <CardDescription>
                  Brief description of the news article content...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">F1 News</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Quick Stats</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl f1-red">2025</CardTitle>
              <CardDescription>Current Season</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">24</p>
              <p className="text-muted-foreground">Races</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl f1-red">10</CardTitle>
              <CardDescription>Teams</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">20</p>
              <p className="text-muted-foreground">Drivers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl f1-red">23</CardTitle>
              <CardDescription>Countries</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">5</p>
              <p className="text-muted-foreground">Continents</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
