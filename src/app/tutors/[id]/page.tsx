"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, GraduationCap, Clock, MapPin, CheckCircle2, ChevronLeft, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/services/api";

export default function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);
  const [tutor, setTutor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchTutor = async () => {
      const isProd = typeof window !== "undefined"
        ? window.location.hostname !== "localhost"
        : process.env.NODE_ENV === "production";

      const fallbackURL = isProd
        ? "https://tutor-booking-backend.vercel.app/api/v1"
        : "http://localhost:5000/api/v1";

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || fallbackURL;

      try {
        const res = await fetch(`${apiUrl}/tutors/${id}`);
        if (res.ok) {
          const result = await res.json();
          const tutorData = result.data;
          setTutor(tutorData);
          // Fetch reviews for this tutor using GET /reviews/:tutorId
          try {
            const reviewsRes = await fetch(`${apiUrl}/reviews/${tutorData.id}`);
            if (reviewsRes.ok) {
              const reviewsResult = await reviewsRes.json();
              setReviews(reviewsResult.data || []);
            }
          } catch (err) {
            console.error("Failed to fetch reviews:", err);
          }
        }
      } catch (error) {
        console.error("Failed to fetch tutor:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTutor();
  }, [id]);

  const handleBooking = async () => {
    if (!selectedScheduleId) {
      toast.error("Please select an available time slot");
      return;
    }

    setIsBooking(true);
    try {
      const res = await api.post("/sessions", {
        tutorId: tutor.id,
        scheduleId: selectedScheduleId
      });
      if (res.data?.success) {
        const paymentUrl = res.data?.data?.paymentUrl;
        if (paymentUrl) {
          toast.success("Session booked! Redirecting to payment...");
          window.location.href = paymentUrl;
        } else {
          toast.success("Session booked successfully! Check your dashboard.");
          router.push("/dashboard/student");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to book session");
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center text-gray-500">Loading tutor profile...</div>;
  }

  if (!tutor) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-500">Tutor not found.</div>;
  }

  const tutorName = tutor.user?.name || "Unknown Tutor";
  const tutorSubject = tutor.tutorSubjects?.[0]?.subject?.name || "General";
  const tutorImage = tutor.profilePhoto || "https://i.ibb.co.com/GQzR5BLS/image-not-found.webp";
  const tutorAbout = tutor.bio || "No description provided.";
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : tutor.rating || "New";
  const tutorReviewsCount = reviews.length || tutor.reviews?.length || 0;
  const tutorExperience = tutor.experience ? `${tutor.experience} years` : "0 years";
  const tutorLocation = "Online";
  const tutorEducation = tutor.qualification || "Not specified";

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <Link href="/tutors" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Tutors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Tutor Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative w-40 h-40 shrink-0">
              <Image
                src={tutorImage}
                alt={tutorName}
                fill
                className="rounded-full object-cover border-4 border-card shadow-lg"
              />
              <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-card" title="Online now"></div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-3">
                <CheckCircle2 className="h-4 w-4" />
                Verified Tutor
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{tutorName}</h1>
              <p className="text-xl text-muted-foreground mb-4">{tutorSubject}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-foreground">{avgRating}</span>
                  <span>({tutorReviewsCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-5 w-5 text-muted-foreground/50" />
                  <span>{tutorLocation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">About Me</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{tutorAbout}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-border">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Education
                </h3>
                <p className="text-muted-foreground">{tutorEducation}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-primary" />
                  Experience
                </h3>
                <p className="text-muted-foreground">{tutorExperience} of teaching</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Student Reviews
              <span className="ml-2 text-base font-normal text-muted-foreground">({tutorReviewsCount})</span>
            </h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to leave one!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <div key={review.id} className="border border-border rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold uppercase">
                          {review.student?.user?.name?.substring(0, 2) || "ST"}
                        </div>
                        <span className="font-semibold text-foreground">{review.student?.user?.name || "Student"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="text-muted-foreground text-sm mt-1">{review.comment}</p>}
                    <p className="text-xs text-muted-foreground/70 mt-2">{review.createdAt ? format(new Date(review.createdAt), "PP") : ""}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl border border-border sticky top-24">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-3xl font-extrabold text-foreground">${tutor.hourlyRate || 0}</span>
                <span className="text-muted-foreground">/hour</span>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {/* Time Slot Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Select Available Slot</label>
                <Select onValueChange={(value) => setSelectedScheduleId(value || "")} value={selectedScheduleId}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {tutor?.tutorSchedules?.filter((ts: any) => !ts.isBooked).length > 0 ? (
                      tutor.tutorSchedules.filter((ts: any) => !ts.isBooked).map((ts: any) => (
                        <SelectItem key={ts.scheduleId} value={ts.scheduleId}>
                          {ts.schedule?.dayOfWeek} • {ts.schedule?.startTime ? format(new Date(ts.schedule.startTime), "p") : ""} - {ts.schedule?.endTime ? format(new Date(ts.schedule.endTime), "p") : ""}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No slots available</SelectItem>
                    )}
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

            <p className="text-center text-sm text-gray-500 mt-4">
              Usually responds within 2 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
