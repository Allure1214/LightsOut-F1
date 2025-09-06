import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function TeamStandingsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="h-12 w-80" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-6 w-32 mx-auto" />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="text-center p-4">
            <Skeleton className="h-8 w-16 mx-auto mb-2" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table Skeleton */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4"><Skeleton className="h-4 w-8" /></th>
                  <th className="text-left p-4"><Skeleton className="h-4 w-16" /></th>
                  <th className="text-center p-4"><Skeleton className="h-4 w-12" /></th>
                  <th className="text-center p-4"><Skeleton className="h-4 w-12" /></th>
                  <th className="text-center p-4"><Skeleton className="h-4 w-12" /></th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="space-y-1">
                        <Skeleton className="h-8 w-16 mx-auto" />
                        <Skeleton className="h-3 w-12 mx-auto" />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="space-y-1">
                        <Skeleton className="h-6 w-8 mx-auto" />
                        <Skeleton className="h-3 w-8 mx-auto" />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Skeleton className="h-8 w-8 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Skeleton */}
          <div className="md:hidden space-y-3 p-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-6" />
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Cards Skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
