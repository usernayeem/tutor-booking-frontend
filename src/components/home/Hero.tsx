import { Star, Users, ArrowDown, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative flex min-h-[65vh] items-center overflow-hidden bg-background pb-12 pt-16 md:pb-24 lg:pt-24">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-primary opacity-20 blur-[120px] animate-pulse" />
      
      <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary animate-in fade-in slide-in-from-top-4 duration-1000">
            <CheckCircle2 className="h-4 w-4" />
            <span>Trusted by 10,000+ students worldwide</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Unlock Your Potential with{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary-foreground bg-[length:200%_auto] animate-gradient">
              Expert Tutoring
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl lg:text-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Personalized 1-on-1 online sessions tailored to your learning goals. Start your journey to academic excellence today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link 
              href="/register" 
              className={cn(
                buttonVariants({ size: "lg" }), 
                "h-14 px-10 text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              )}
            >
              Get Started Free
            </Link>
            <Link 
              href="/tutors" 
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }), 
                "h-14 px-10 text-lg transition-all hover:bg-accent hover:scale-105 active:scale-95"
              )}
            >
              Browse Tutors
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm font-medium text-muted-foreground animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full">
              <Users className="h-5 w-5 text-primary" />
              <span>Expert Tutors</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer text-muted-foreground transition-colors hover:text-primary">
        <ArrowDown className="h-6 w-6" />
      </div>
    </section>
  );
}
