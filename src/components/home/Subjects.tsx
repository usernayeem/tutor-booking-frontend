import Link from "next/link";
import { BookOpen, ArrowRight, Lightbulb, PenTool, Database, Code, Globe, Beaker, Briefcase, Calculator } from "lucide-react";

const isProd = typeof window !== "undefined" 
  ? window.location.hostname !== "localhost"
  : process.env.NODE_ENV === "production";

const fallbackURL = isProd 
  ? "https://tutor-booking-backend.vercel.app/api/v1" 
  : "http://localhost:5000/api/v1";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || fallbackURL;

// Map to match some common subject names to specific icons and colors
const iconMap: Record<string, { icon: any, color: string, bg: string }> = {
  "Mathematics": { icon: Calculator, color: "text-blue-600", bg: "bg-blue-100" },
  "Physics": { icon: Lightbulb, color: "text-yellow-600", bg: "bg-yellow-100" },
  "Chemistry": { icon: Beaker, color: "text-green-600", bg: "bg-green-100" },
  "Computer Science": { icon: Code, color: "text-indigo-600", bg: "bg-indigo-100" },
  "English": { icon: PenTool, color: "text-rose-600", bg: "bg-rose-100" },
  "History": { icon: Globe, color: "text-amber-600", bg: "bg-amber-100" },
  "Business": { icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-100" },
  "Data Science": { icon: Database, color: "text-cyan-600", bg: "bg-cyan-100" },
};

// Fallback palette
const fallbackPalette = [
  { color: "text-purple-600", bg: "bg-purple-100" },
  { color: "text-pink-600", bg: "bg-pink-100" },
  { color: "text-orange-600", bg: "bg-orange-100" },
  { color: "text-teal-600", bg: "bg-teal-100" },
];

export default async function Subjects() {
  let subjects: any[] = [];

  try {
    const res = await fetch(`${API_BASE}/subjects`, {
      cache: "no-store",
    });
    if (res.ok) {
      const result = await res.json();
      subjects = result?.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
  }

  if (subjects.length === 0) return null;

  // Take up to 8 subjects for the grid
  const displaySubjects = subjects.slice(0, 8);

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Browse by Subject
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Find expert tutors in {subjects.length} subject{subjects.length !== 1 ? "s" : ""} and counting.
            </p>
          </div>
          <Link
            href="/subjects"
            className="hidden md:inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Explore all subjects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Premium Subject Grid */}
        <div className="flex flex-wrap justify-center gap-8">
          {displaySubjects.map((subject: any, index: number) => {
            const mappedTheme = iconMap[subject.name as string];
            const fallbackTheme = fallbackPalette[index % fallbackPalette.length];
            const IconComponent = mappedTheme?.icon || BookOpen;
            const iconColor = mappedTheme?.color || fallbackTheme.color;
            const iconBg = mappedTheme?.bg || fallbackTheme.bg;

            return (
              <div key={subject.id} className="w-full max-w-[340px] flex">
                <Link
                  href={`/tutors?subjectId=${subject.id}`}
                  className="group flex flex-col w-full justify-center rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                >
                  {/* Subtle hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 transition-opacity group-hover:opacity-100" />
                  
                  <div className="relative z-10 flex items-start justify-between">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
                      <IconComponent className={`h-6 w-6 ${iconColor}`} />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                  
                  <h3 className="relative z-10 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {subject.name}
                  </h3>
                  {subject.description && (
                    <p className="relative z-10 mt-2 text-sm text-gray-500 line-clamp-2">
                      {subject.description}
                    </p>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/subjects"
            className="inline-flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            Explore all subjects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
