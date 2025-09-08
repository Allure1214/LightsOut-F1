import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function RaceResultsNotFound() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-red-600 mb-4">Race Results Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          The race results you're looking for are not available. This could be because:
        </p>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Possible Reasons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-left space-y-2 text-sm">
              <li>• The race ID is invalid or doesn't exist</li>
              <li>• The race hasn't taken place yet (no results available)</li>
              <li>• The race data is not available in the API</li>
              <li>• There was an error fetching the race results</li>
            </ul>
          </CardContent>
        </Card>
        
        <div className="space-y-4 mt-8">
          <Button asChild>
            <Link href="/races">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Race Calendar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
