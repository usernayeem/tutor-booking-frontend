import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TutorCard } from "@/components/tutors/TutorCard";

export const dynamic = 'force-dynamic';

export default async function TutorsDirectory({ searchParams }: { searchParams: Promise<{ search?: string; subjectId?: string }> }) {
  const resolvedParams = await searchParams;
  let tutors: any[] = [];
  let subjectName = "";

  const isProd = process.env.NODE_ENV === "production";
  const fallbackURL = isProd 
    ? "https://tutor-booking-backend.vercel.app/api/v1" 
    : "http://localhost:5000/api/v1";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || fallbackURL;

  try {
    const url = new URL(`${apiUrl}/tutors`);
    if (resolvedParams?.search) {
      url.searchParams.append('searchTerm', resolvedParams.search);
    }
    if (resolvedParams?.subjectId) {
      url.searchParams.append('subjectId', resolvedParams.subjectId);
    }
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (res.ok) {
      const result = await res.json();
      // Backend returns { data: { data: [], meta: {} } } for paginated responses
      tutors = result?.data?.data || result?.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch tutors:", error);
  }

  // Fetch subject name for page title if filtering by subject
  if (resolvedParams?.subjectId) {
    try {
      const subjectRes = await fetch(
        `${apiUrl}/subjects`,
        { cache: "no-store" }
      );
      if (subjectRes.ok) {
        const subjectData = await subjectRes.json();
        const subjects: any[] = subjectData?.data || [];
        const found = subjects.find((s: any) => s.id === resolvedParams.subjectId);
        if (found) subjectName = found.name;
      }
    } catch { /* ignore */ }
  }

  return (
    <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header & Search */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          {subjectName ? `${subjectName} Tutors` : "Find Your Perfect Tutor"}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          {subjectName
            ? `Browse verified ${subjectName} tutors and book your first session today.`
            : "Browse our network of verified experts and book your first session today."}
        </p>
        
        <form method="GET" action="/tutors" className="flex flex-col sm:flex-row gap-3 bg-card p-3 rounded-xl shadow-sm border border-border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search by subject or name..."
              className="pl-10 h-11 rounded-lg"
              defaultValue={resolvedParams?.search || ""}
            />
          </div>
          <Button type="submit" className="h-11 px-8 rounded-lg font-medium">
            Search
          </Button>
        </form>
      </div>

      {/* Grid of Tutors — 4 columns on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tutors.map((tutor: any) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
      
      {tutors.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">No tutors found</p>
          <p className="text-sm mt-1">Try a different search term or check back later.</p>
        </div>
      )}
    </div>
    </div>
  );
}
