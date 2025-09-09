import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, ArrowLeft } from 'lucide-react'

export default function CircuitNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <MapPin className="h-24 w-24 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold f1-red mb-4">Circuit Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The circuit you're looking for doesn't exist or has been removed.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/circuits">
            <Button className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Circuits
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
