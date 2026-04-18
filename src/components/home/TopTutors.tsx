import Image from "next/image";
import Link from "next/link";
import { Star, GraduationCap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TopTutors() {
  const tutors = [
    {
      id: 1,
      name: "Dr. Sarah Jenkins",
      subject: "Advanced Mathematics",
      rating: 4.9,
      reviews: 120,
      hourlyRate: 45,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
      experience: "8 years",
    },
    {
      id: 2,
      name: "Michael Chang",
      subject: "Physics & Chemistry",
      rating: 4.8,
      reviews: 85,
      hourlyRate: 40,
      image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400&h=400",
      experience: "5 years",
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      subject: "Spanish Language",
      rating: 5.0,
      reviews: 210,
      hourlyRate: 35,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400",
      experience: "10 years",
    },
    {
      id: 4,
      name: "James Wilson",
      subject: "Computer Science",
      rating: 4.7,
      reviews: 95,
      hourlyRate: 50,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
      experience: "6 years",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Learn from the Best
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Browse our highest-rated tutors across various subjects.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex" asChild>
            <Link href="/tutors">View All Tutors</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tutors.map((tutor) => (
            <div key={tutor.id} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={tutor.image}
                  alt={tutor.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {tutor.subject}
                  </span>
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {tutor.rating}
                  </div>
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900">{tutor.name}</h3>
                
                <div className="mb-4 flex flex-col gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>{tutor.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>${tutor.hourlyRate}/hour</span>
                  </div>
                </div>

                <Button className="w-full bg-gray-900 hover:bg-blue-600 transition-colors" asChild>
                  <Link href={`/tutors/${tutor.id}`}>Book Session</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline" className="w-full max-w-sm" asChild>
            <Link href="/tutors">View All Tutors</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
