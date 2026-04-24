import Link from "next/link";
import Image from "next/image";
import { Star, GraduationCap, Clock } from "lucide-react";

export function TutorCard({ tutor }: { tutor: any }) {
  const tutorName = tutor.user?.name || "Unknown Tutor";
  const tutorSubject = tutor.tutorSubjects?.[0]?.subject?.name || "General";
  const rawPhoto = tutor?.profilePhoto || tutor?.user?.image || tutor?.user?.profilePhoto;
  const tutorImage = (rawPhoto && rawPhoto !== "null" && rawPhoto.trim() !== "") 
    ? rawPhoto 
    : "https://i.ibb.co.com/GQzR5BLS/image-not-found.webp";
  const tutorAbout = tutor?.bio || "No description provided.";
  
  // Rating logic (if available directly or computed from reviews in the component using it)
  // For safety, fallback to 'New' if no rating field exists
  const reviewCount = tutor.reviews?.length || 0;
  const avgRating =
    reviewCount > 0
      ? (
          tutor.reviews.reduce(
            (sum: number, r: any) => sum + (r.rating || 0),
            0
          ) / reviewCount
        ).toFixed(1)
      : tutor.rating
      ? Number(tutor.rating).toFixed(1)
      : null;

  return (
    <Link href={`/tutors/${tutor.id}`} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={tutorImage}
          alt={tutorName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Availability Badge */}
        {tutor.isAvailable && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
            Available
          </span>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-900 flex items-center gap-1 shadow-sm">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          {avgRating || "New"}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="mb-2">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
            {tutorSubject}
          </span>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900">{tutorName}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
          {tutorAbout}
        </p>
        
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <GraduationCap className="h-4 w-4" />
            <span>{tutor.experience} years</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>${tutor.hourlyRate}/hr</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
          <div className="w-full h-10 flex items-center justify-center rounded-xl bg-gray-900 text-white hover:bg-blue-600 transition-colors font-medium">
            Book Session
          </div>
        </div>
      </div>
    </Link>
  );
}
