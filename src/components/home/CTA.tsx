import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CTA() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-6 py-16 sm:px-12 sm:py-24 lg:px-16 text-center shadow-2xl">
          {/* Background patterns */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500 opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500 opacity-50 blur-3xl"></div>

          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to Start Learning?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-blue-100">
              Join thousands of students achieving their academic goals. Sign up today and get 20% off your first session!
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "h-14 w-full bg-white text-blue-600 px-8 text-lg hover:bg-gray-50 sm:w-auto")}>
                Get Started Now
              </Link>
              <Link href="/tutors" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-14 w-full px-8 text-lg sm:w-auto border-blue-400 text-white hover:bg-blue-700 hover:text-white")}>
                Browse Tutors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
