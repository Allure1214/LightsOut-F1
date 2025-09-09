'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DriverStandingsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="w-14 h-14 rounded-full" />
            <Skeleton className="h-12 w-80" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-96 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Table Skeleton */}
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4">
                    <Skeleton className="h-4 w-8" />
                  </th>
                  <th className="text-left p-4">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="text-left p-4">
                    <Skeleton className="h-4 w-12" />
                  </th>
                  <th className="text-center p-4">
                    <Skeleton className="h-4 w-12" />
                  </th>
                  <th className="text-center p-4">
                    <Skeleton className="h-4 w-8" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        {index < 3 && <Skeleton className="h-3 w-16" />}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info Cards Skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-8" />
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
