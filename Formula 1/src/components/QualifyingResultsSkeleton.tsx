import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function QualifyingResultsSkeleton() {
  return (
    <div className="space-y-8 qualifying-results-skeleton">
      {/* Header Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-32" />
          <div className="flex-1">
            <Skeleton className="h-12 w-96 mb-2" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>

        {/* Qualifying Info Cards Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Circuit Info Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Qualifying Results Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          {/* Qualifying Format Info Skeleton */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>

          {/* Desktop Table Skeleton */}
          <div className="hidden md:block">
            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-8 gap-4 py-3 border-b">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              
              {/* Rows */}
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="grid grid-cols-8 gap-4 py-3 border-b">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Cards Skeleton */}
          <div className="md:hidden space-y-3">
            {Array.from({ length: 20 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-6 w-16 mb-1" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm pt-3 border-t">
                    <div className="text-center">
                      <Skeleton className="h-3 w-8 mb-1 mx-auto" />
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </div>
                    <div className="text-center">
                      <Skeleton className="h-3 w-8 mb-1 mx-auto" />
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </div>
                    <div className="text-center">
                      <Skeleton className="h-3 w-8 mb-1 mx-auto" />
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
