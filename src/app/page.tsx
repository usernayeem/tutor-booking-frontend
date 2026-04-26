import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Subjects from "@/components/home/Subjects";
import TopTutors from "@/components/home/TopTutors";
import CTA from "@/components/home/CTA";
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Subjects />
      <TopTutors />
      <CTA />
    </>
  );
}
