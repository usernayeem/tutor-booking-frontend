import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Subjects from "@/components/home/Subjects";
import TopTutors from "@/components/home/TopTutors";
import CTA from "@/components/home/CTA";
import Statistics from "@/components/home/Statistics";
import FAQs from "@/components/home/FAQs";
import Newsletter from "@/components/home/Newsletter";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <Hero />
      <Statistics />
      <Features />
      <WhyChooseUs />
      <HowItWorks />
      <Subjects />
      <TopTutors />
      <FAQs />
      <Newsletter />
      <CTA />
    </>
  );
}
