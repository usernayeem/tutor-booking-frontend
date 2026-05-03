import { TutorCardSkeleton } from "@/components/tutors/TutorCardSkeleton";

export function TopTutorsSkeleton() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-12">
          <div className="w-full md:w-auto">
            <div className="h-10 w-64 bg-muted animate-pulse mb-3 rounded-lg" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="hidden md:block h-10 w-36 bg-muted animate-pulse rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <TutorCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
