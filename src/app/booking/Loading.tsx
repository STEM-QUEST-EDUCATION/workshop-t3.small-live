import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function LoadingStep4() {
  return (
    <div className="space-y-4">
      {/* Booking Summary Card Loading State */}
      <Card className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" /> {/* Title */}
            <Skeleton className="h-4 w-40" /> {/* Date and Time */}
            <Skeleton className="h-4 w-36" /> {/* Location */}
          </div>
          <div className="flex flex-col items-center bg-blue-100/50 px-2 py-1 rounded">
            <Skeleton className="h-4 w-4 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </Card>

      {/* Price Details Card Loading State */}
      <Card className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="border-t pt-3 flex justify-between items-center">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
      </Card>

      {/* Payment Options Loading State */}
      <div className="mt-8">
        <div className="grid grid-cols-2 gap-2">
          {/* Pay Now Button Loading State */}
          <div className="h-20 rounded-lg border-2 border-gray-200 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Pay Later Button Loading State */}
          <div className="h-20 rounded-lg border-2 border-gray-200 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

