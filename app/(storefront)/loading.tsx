import { CatalogSkeleton } from "@/components/catalog/product-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-96 mb-6" />
        
        {/* Search Bar Skeleton */}
        <div className="space-y-6 mb-8">
          <Skeleton className="h-10 w-full max-w-sm" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </section>

      <CatalogSkeleton />
    </div>
  );
}