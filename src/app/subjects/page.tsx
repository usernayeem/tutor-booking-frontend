import Link from "next/link";
import { BookOpen, ChevronRight, Search, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function SubjectsDirectory() {
  let subjects = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/subjects`, {
      cache: "no-store",
    });
    if (res.ok) {
      const result = await res.json();
      subjects = result.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <div className="bg-blue-600 pb-16 pt-24 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Explore Our Subjects
            </h1>
            <p className="mb-8 text-lg text-blue-100 sm:text-xl">
              From advanced sciences to creative arts, find expert tutors ready to help you master any topic.
            </p>
            <div className="mx-auto flex max-w-lg items-center rounded-xl bg-white p-2 shadow-lg">
              <Search className="ml-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search subjects..."
                className="border-0 bg-transparent px-4 text-gray-900 focus-visible:ring-0 shadow-none text-base"
              />
              <Button className="rounded-lg bg-blue-600 px-6 hover:bg-blue-700">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="container mx-auto px-4 pt-16 md:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subjects.map((subject: any) => (
            <Link 
              key={subject.id} 
              href={`/tutors?subjectId=${subject.id}`}
              className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-blue-100"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {subject.name}
              </h3>
              <p className="mb-6 flex-1 text-sm text-gray-600 line-clamp-2">
                {subject.description || "Master this subject with our experienced and verified tutors."}
              </p>
              <div className="flex items-center text-sm font-medium text-blue-600">
                <span>View Tutors</span>
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-24 text-center">
            <GraduationCap className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No Subjects Found</h3>
            <p className="text-gray-500 max-w-md">
              We are currently updating our curriculum. Please check back later to see our available subjects and tutors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
