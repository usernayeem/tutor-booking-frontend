import Link from "next/link";
import Image from "next/image";
import { Star, GraduationCap, Clock } from "lucide-react";

/** Generates a stable hue from a string for a consistent avatar color */
function stringToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const hue = stringToHue(name);
  const bg = `hsl(${hue}, 60%, 50%)`;
  const bg2 = `hsl(${(hue + 40) % 360}, 60%, 40%)`;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${bg}, ${bg2})` }}
    >
      <span className="text-white text-4xl font-bold tracking-tight select-none">
        {initials}
      </span>
    </div>
  );
}

export function TutorCard({ tutor }: { tutor: any }) {
  const tutorName = tutor.user?.name || "Unknown Tutor";
  const tutorSubject = tutor.tutorSubjects?.[0]?.subject?.name || "General";
  const rawPhoto = tutor?.profilePhoto || tutor?.user?.image || tutor?.user?.profilePhoto;
  const hasPhoto = rawPhoto && rawPhoto !== "null" && rawPhoto.trim() !== "";
  const tutorAbout = tutor?.bio || "Expert tutor dedicated to helping students achieve their learning goals through personalized sessions.";

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
    <Link
      href={`/tutors/${tutor.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image / Avatar */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {hasPhoto ? (
          <Image
            src={rawPhoto}
            alt={tutorName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <InitialsAvatar name={tutorName} />
        )}

        {/* Availability Badge */}
        {tutor.isAvailable && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow">
            Available
          </span>
        )}

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-foreground flex items-center gap-1 shadow">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {avgRating ?? "New"}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="mb-2">
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {tutorSubject}
          </span>
        </div>
        <h3 className="mb-1.5 text-base font-bold text-foreground leading-tight">
          {tutorName}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
          {tutorAbout}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>{tutor.experience ?? "—"} yrs exp</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>${tutor.hourlyRate}/hr</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="w-full h-9 flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-opacity group-hover:opacity-90">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
}
