"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, GraduationCap, Clock, MapPin, CheckCircle2, ChevronLeft, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock data (will fetch by ID later)
const MOCK_TUTOR = {
  id: 1,
  name: "Dr. Sarah Jenkins",
  subject: "Advanced Mathematics",
  rating: 4.9,
  reviews: 120,
  hourlyRate: 45,
  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=800",
  experience: "8 years",
  location: "Online",
  about: "I am a former university professor with a Ph.m. in Applied Mathematics. I specialize in making complex mathematical concepts accessible and intuitive. My teaching philosophy focuses on building a strong foundational understanding before tackling advanced problem-solving techniques. I have successfully helped over 500 students improve their grades and gain confidence in Calculus, Linear Algebra, and Statistics.",
  education: "Ph.D. in Mathematics, Stanford University",
  languages: ["English (Native)", "Spanish (Conversational)"],
};

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);

  // In a real app, we would fetch the tutor using params.id
  const tutor = MOCK_TUTOR;

  const handleBooking = () => {
    if (!date || !time) {
      toast.error("Please select a date and time");
      return;
    }
    
    setIsBooking(true);
    // Simulate API call for checkout/booking
    setTimeout(() => {
      setIsBooking(false);
      toast.success("Session booked successfully! Check your dashboard.");
      router.push("/dashboard/student");
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <Link href="/tutors" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Tutors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Tutor Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative w-40 h-40 shrink-0">
              <Image
                src={tutor.image}
                alt={tutor.name}
                fill
                className="rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white" title="Online now"></div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                <CheckCircle2 className="h-4 w-4" />
                Verified Tutor
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{tutor.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{tutor.subject}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-900">{tutor.rating}</span>
                  <span>({tutor.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{tutor.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{tutor.about}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-100">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Education
                </h3>
                <p className="text-gray-600">{tutor.education}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Experience
                </h3>
                <p className="text-gray-600">{tutor.experience} of teaching</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 sticky top-24">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-3xl font-extrabold text-gray-900">${tutor.hourlyRate}</span>
                <span className="text-gray-500">/hour</span>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {/* Date Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Select Date</label>
                <Popover>
                  <PopoverTrigger 
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full justify-start text-left font-normal h-12",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Slot Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Select Time</label>
                <Select onValueChange={setTime} value={time}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="13:00">01:00 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM</SelectItem>
                    <SelectItem value="17:00">05:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-md"
              onClick={handleBooking}
              disabled={isBooking}
            >
              {isBooking ? "Confirming..." : "Book Session"}
            </Button>
            <Button size="lg" variant="outline" className="w-full h-14 text-lg mt-3">
              Send Message
            </Button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Usually responds within 2 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
