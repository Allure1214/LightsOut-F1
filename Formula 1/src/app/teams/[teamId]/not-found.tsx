import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search, AlertCircle } from 'lucide-react'

export default function TeamNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/teams">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team Standings
            </Link>
          </Button>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Team Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The team you're looking for doesn't exist or is not available.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-red-600" />
                What can you do?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Check the team name</p>
                    <p className="text-sm text-gray-600">
                      Make sure the team name is spelled correctly and try again.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Browse all teams</p>
                    <p className="text-sm text-gray-600">
                      Go back to the team standings to see all available teams.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Try a different season</p>
                    <p className="text-sm text-gray-600">
                      The team might not have participated in the selected season.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/teams">
                <Search className="w-4 h-4 mr-2" />
                Browse All Teams
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/drivers">
                <Search className="w-4 h-4 mr-2" />
                View Drivers
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


