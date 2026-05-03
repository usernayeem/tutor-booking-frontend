import Link from "next/link";
import { BookOpen } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TutorCard } from "@/components/tutors/TutorCard";

const isProd = process.env.NODE_ENV === "production";
const fallbackURL = isProd 
  ? "https://tutor-booking-backend.vercel.app/api/v1" 
  : "http://localhost:5000/api/v1";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || fallbackURL;

export default async function TopTutors() {
  let tutors: any[] = [];

  try {
    // Removed sortBy=rating as it causes the query to fail since rating is not a direct database column
    const res = await fetch(`${API_BASE}/tutors?limit=4`, {
      cache: "no-store",
    });
    if (res.ok) {
      const result = await res.json();
      tutors =
        result?.data?.data ||
        result?.data ||
        [];
      tutors = tutors.slice(0, 4);
    }
  } catch (error) {
    console.error("Failed to fetch tutors:", error);
  }

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Learn from the Best
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Browse our highest-rated tutors across various subjects.
            </p>
          </div>
          <Link
            href="/tutors"
            className={cn(buttonVariants({ variant: "outline" }), "hidden md:flex gap-2")}
          >
            <BookOpen className="h-4 w-4" />
            View All Tutors
          </Link>
        </div>

        {tutors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tutors.map((tutor: any) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="font-medium">No tutors available yet.</p>
            <p className="text-sm mt-1">Check back soon — tutors are being added!</p>
          </div>
        )}

        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/tutors"
            className={cn(buttonVariants({ variant: "outline" }), "w-full max-w-sm gap-2")}
          >
            <BookOpen className="h-4 w-4" />
            View All Tutors
          </Link>
        </div>
      </div>
    </section>
  );
}
