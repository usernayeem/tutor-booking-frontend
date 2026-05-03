import { TutorCardSkeleton } from "@/components/tutors/TutorCardSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header & Search Skeleton */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="h-10 w-64 bg-muted animate-pulse mx-auto mb-4 rounded-lg" />
          <div className="h-6 w-96 bg-muted animate-pulse mx-auto mb-8 rounded-lg" />
          
          <div className="flex flex-col sm:flex-row gap-3 bg-card p-3 rounded-xl shadow-sm border border-border">
            <div className="flex-1 h-11 bg-muted animate-pulse rounded-lg" />
            <div className="w-24 h-11 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>

        {/* Grid of Skeleton Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <TutorCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
