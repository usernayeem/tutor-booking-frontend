import Link from "next/link";
import { Search, Star, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-12 pt-20 md:pb-24 lg:pb-32 lg:pt-32">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>

      <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
        <div className="mx-auto max-w-3xl space-y-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Master Any Subject with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Expert Tutors</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
            Unlock your potential with personalized, 1-on-1 online tutoring. Find the perfect match for your learning style and schedule.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4">
            <Link href="/tutors" className={cn(buttonVariants({ size: "lg" }), "h-14 w-full bg-blue-600 px-8 text-lg hover:bg-blue-700 sm:w-auto shadow-xl shadow-blue-200")}>
              <Search className="mr-2 h-5 w-5" />
              Find a Tutor
            </Link>
            <Link href="/register" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-14 w-full px-8 text-lg sm:w-auto border-2")}>
              Become a Tutor
            </Link>
          </div>

          <div className="pt-8 flex items-center justify-center gap-8 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span>10,000+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span>4.9/5 Average Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
