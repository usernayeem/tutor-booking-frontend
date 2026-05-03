import { Skeleton } from "@/components/ui/skeleton";

export function TutorCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Image Skeleton */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      
      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 p-4">
        <div className="mb-2">
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="space-y-2 mb-4 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="mt-4">
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
