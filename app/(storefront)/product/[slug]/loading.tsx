import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Image Skeleton */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Details Skeleton */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-4 w-24 mb-2" /> {/* Category */}
            <Skeleton className="h-10 w-3/4" />    {/* Title */}
          </div>
          
          <Skeleton className="h-8 w-32" />        {/* Price */}
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="pt-6">
            <Skeleton className="h-12 w-full md:w-1/2" /> {/* Button */}
          </div>
        </div>
      </div>
    </div>
  );
}