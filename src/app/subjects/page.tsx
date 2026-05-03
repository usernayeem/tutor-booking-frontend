import Link from "next/link";
import { BookOpen, ChevronRight, Search, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function SubjectsDirectory({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const resolvedParams = await searchParams;
  const searchTerm = resolvedParams.search?.toLowerCase() || "";
  
  let subjects = [];
  const isProd = process.env.NODE_ENV === "production";
  const fallbackURL = isProd 
    ? "https://tutor-booking-backend.vercel.app/api/v1" 
    : "http://localhost:5000/api/v1";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || fallbackURL;

  try {
    const res = await fetch(`${apiUrl}/subjects`, {
      cache: "no-store",
    });
    if (res.ok) {
      const result = await res.json();
      subjects = result.data || [];
      
      // Implement basic search filtering if backend doesn't support it
      if (searchTerm) {
        subjects = subjects.filter((s: any) => 
          s.name.toLowerCase().includes(searchTerm) || 
          s.description?.toLowerCase().includes(searchTerm)
        );
      }
    }
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-primary pb-16 pt-24 text-primary-foreground">
        {/* Background decoration */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Explore Our Subjects
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/80 sm:text-xl">
              From advanced sciences to creative arts, find expert tutors ready to help you master any topic.
            </p>
            <form method="GET" action="/subjects" className="mx-auto flex max-w-lg items-center rounded-xl bg-background p-1 shadow-lg border border-border">
              <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                name="search"
                defaultValue={resolvedParams.search || ""}
                placeholder="Search subjects..."
                className="border-0 bg-transparent px-4 text-foreground focus-visible:ring-0 shadow-none text-base"
              />
              <Button type="submit" size="sm" className="rounded-lg px-6">
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="container mx-auto px-4 pt-16 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject: any) => (
            <Link 
              key={subject.id}
              href={`/tutors?subjectId=${subject.id}`}
              className="group flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {subject.name}
              </h3>
              <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
                {subject.description || "Master this subject with our experienced and verified tutors."}
              </p>
              <div className="flex items-center text-sm font-medium text-primary">
                <span>View Tutors</span>
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-24 text-center">
            <GraduationCap className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold text-foreground">No Subjects Found</h3>
            <p className="text-muted-foreground max-w-md">
              We are currently updating our curriculum. Please check back later to see our available subjects and tutors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
