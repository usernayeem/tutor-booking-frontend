import Image from "next/image";
import { Star, Quote, MessageSquare } from "lucide-react";

const isProd = process.env.NODE_ENV === "production";
const fallbackURL = isProd 
  ? "https://tutor-booking-backend.vercel.app/api/v1" 
  : "http://localhost:5000/api/v1";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || fallbackURL;

export default async function Testimonials() {
  let reviews: any[] = [];

  try {
    // Step 1: Fetch first few tutors
    const tutorRes = await fetch(`${API_BASE}/tutors?limit=10`, {
      cache: "no-store",
    });

    if (tutorRes.ok) {
      const tutorData = await tutorRes.json();
      const tutors: any[] =
        tutorData?.data?.data || tutorData?.data || [];

      // Step 2: For each tutor, fetch their reviews in parallel
      const reviewPromises = tutors.slice(0, 10).map(async (tutor: any) => {
        try {
          const rRes = await fetch(`${API_BASE}/reviews/${tutor.id}`, {
            cache: "no-store",
          });
          if (!rRes.ok) return [];
          const rData = await rRes.json();
          const tutorReviews: any[] = rData?.data || [];
          // Attach tutor info to each review
          return tutorReviews
            .filter((r: any) => r.comment && r.comment.trim().length > 10)
            .map((r: any) => ({
              ...r,
              tutorName: tutor.user?.name || "Tutor",
            }));
        } catch {
          return [];
        }
      });

      const allReviewArrays = await Promise.all(reviewPromises);
      reviews = allReviewArrays.flat().slice(0, 3);
    }
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }

  return (
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by Students Worldwide
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Here's what our students are saying about their tutors.
          </p>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {reviews.map((item: any) => {
              const authorName = item.student?.user?.name || "Student";
              const authorRole = `Student · Tutored by ${item.tutorName}`;
              const content = item.comment;
              const rating = item.rating || 5;

              return (
                <div
                  key={item.id}
                  className="relative flex flex-col rounded-2xl bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Quote icon */}
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-blue-100 fill-blue-100" />

                  {/* Star rating */}
                  <div className="flex gap-1 mb-6 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < rating ? "fill-current" : "fill-none"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mb-6 text-gray-700 italic text-base leading-relaxed flex-1">
                    &ldquo;{content}&rdquo;
                  </p>

                  <div className="flex items-center gap-4 mt-auto border-t pt-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg shrink-0">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{authorName}</h4>
                      <p className="text-sm text-gray-500">{authorRole}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="font-medium text-gray-900 text-lg">No reviews yet.</p>
            <p className="text-sm text-gray-500 mt-1">Check back later to see what students think about our tutors!</p>
          </div>
        )}
      </div>
    </section>
  );
}
