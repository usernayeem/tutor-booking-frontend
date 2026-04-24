import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TutorCard } from "@/components/tutors/TutorCard";

export default async function TutorsDirectory({ searchParams }: { searchParams: Promise<{ search?: string; subjectId?: string }> }) {
  const resolvedParams = await searchParams;
  let tutors: any[] = [];
  let subjectName = "";

  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/tutors`);
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
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/subjects`,
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
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header & Search */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
          {subjectName ? `${subjectName} Tutors` : "Find Your Perfect Tutor"}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {subjectName
            ? `Browse verified ${subjectName} tutors and book your first session today.`
            : "Browse our network of verified experts and book your first session today."}
        </p>
        
        <form method="GET" action="/tutors" className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              name="search"
              placeholder="Search by subject or name..." 
              className="pl-10 h-12 border-gray-200 text-base rounded-xl"
              defaultValue={resolvedParams?.search || ""}
            />
          </div>
          <Button type="submit" className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 font-medium">
            Search
          </Button>
        </form>
      </div>

      {/* Grid of Tutors */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tutors.map((tutor: any) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
      
      {tutors.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No tutors found. Please check back later.
        </div>
      )}
    </div>
  );
}
