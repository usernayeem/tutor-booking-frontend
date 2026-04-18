import Link from "next/link";
import Image from "next/image";
import { Search, Star, GraduationCap, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data (will be replaced by API call later)
const ALL_TUTORS = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    subject: "Advanced Mathematics",
    rating: 4.9,
    reviews: 120,
    hourlyRate: 45,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
    experience: "8 years",
    about: "Former university professor specializing in Calculus and Linear Algebra.",
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
    about: "Passionate about making complex physics concepts easy to understand.",
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
    about: "Native speaker providing immersive and conversational Spanish lessons.",
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
    about: "Software engineer teaching Python, JavaScript, and Data Structures.",
  },
  {
    id: 5,
    name: "Amira Hassan",
    subject: "Biology",
    rating: 4.9,
    reviews: 150,
    hourlyRate: 38,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&h=400",
    experience: "7 years",
    about: "Medical student helping high schoolers ace their Biology exams.",
  },
  {
    id: 6,
    name: "David Chen",
    subject: "English Literature",
    rating: 4.6,
    reviews: 64,
    hourlyRate: 30,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400",
    experience: "4 years",
    about: "Helping students analyze literature and improve their essay writing skills.",
  }
];

export default function TutorsDirectory() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header & Search */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Find Your Perfect Tutor</h1>
        <p className="text-lg text-gray-600 mb-8">Browse our network of verified experts and book your first session today.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search by subject or name..." 
              className="pl-10 h-12 border-gray-200 text-base rounded-xl"
            />
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-200 gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Grid of Tutors */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ALL_TUTORS.map((tutor) => (
          <Link href={`/tutors/${tutor.id}`} key={tutor.id} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              <Image
                src={tutor.image}
                alt={tutor.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-900 flex items-center gap-1 shadow-sm">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {tutor.rating}
              </div>
            </div>
            <div className="flex flex-col flex-1 p-5">
              <div className="mb-2">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  {tutor.subject}
                </span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">{tutor.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                {tutor.about}
              </p>
              
              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <GraduationCap className="h-4 w-4" />
                  <span>{tutor.experience}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>${tutor.hourlyRate}/hr</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
