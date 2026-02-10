import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full bg-gray-100">
        <Skeleton className="h-full w-full" />
      </div>
      
      <CardHeader className="p-4">
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      
      <CardContent className="p-4 pt-0 grow">
        <Skeleton className="h-8 w-1/3" />
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}