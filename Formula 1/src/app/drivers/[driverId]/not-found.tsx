import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, UserX, Search } from 'lucide-react'

export default function DriverNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <UserX className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Driver Not Found
            </CardTitle>
            <CardDescription className="text-gray-600">
              The driver you're looking for doesn't exist or the data is currently unavailable.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              This could be due to:
            </div>
            <ul className="text-sm text-muted-foreground text-left space-y-1">
              <li>• Invalid driver ID</li>
              <li>• Driver not active in the selected season</li>
              <li>• API data temporarily unavailable</li>
              <li>• Historical data not available for this driver</li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1">
                <Link href="/drivers">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Driver Standings
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Drivers
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
