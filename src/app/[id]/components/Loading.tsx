import { Skeleton } from "@/components/ui/skeleton";

console.log("Loading component");

export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="relative mx-auto max-w-md">
        {/* Header */}
        <div className="relative">
          <Skeleton className="h-[200px] w-full bg-gray-200" />
          <div className="absolute left-4 top-4">
            <Skeleton className="h-8 w-8 rounded-full bg-gray-300" />
          </div>
        </div>

        {/* Content Card */}
        <div className="relative -mt-4 rounded-t-3xl bg-white px-4 pt-6">
          {/* Date and Share */}
          <div className="mb-2 flex items-center justify-between">
            <Skeleton className="h-4 w-24 bg-gray-200" />
            <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
          </div>

          {/* Title */}
          <Skeleton className="mb-4 h-6 w-3/4 bg-gray-200" />

          {/* Location and Price */}
          <div className="mb-6 space-y-2">
            <Skeleton className="h-4 w-full bg-gray-200" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-20 bg-gray-200" />
              <Skeleton className="h-4 w-16 bg-gray-200" />
            </div>
          </div>

          {/* Step Indicator */}
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-6 w-16 bg-gray-200" />
            <Skeleton className="h-4 w-4 bg-gray-200" />
          </div>

          {/* Time Slots */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-xl bg-gray-200" />
            ))}
          </div>

          {/* Preview Image */}
          <Skeleton className="mb-4 h-[200px] w-full rounded-xl bg-gray-200" />

          {/* Action Buttons */}
          <div className="sticky bottom-0 flex gap-4 bg-white py-4">
            <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
            <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
