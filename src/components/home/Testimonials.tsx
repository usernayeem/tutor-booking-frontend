import Image from "next/image";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      content: "The tutors here are exceptional. I went from struggling in Calculus to getting an A in just two months. Highly recommended!",
      author: "Emily Chen",
      role: "High School Student",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    },
    {
      id: 2,
      content: "As a working professional, the flexible scheduling is a lifesaver. My Spanish has improved dramatically thanks to Elena.",
      author: "David Smith",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    },
    {
      id: 3,
      content: "The video platform is seamless and the secure payment system gives me peace of mind. Best tutoring service I've used.",
      author: "Sarah Johnson",
      role: "University Student",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    },
  ];

  return (
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by Students Worldwide
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Don't just take our word for it. Read what our students have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="relative rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="mb-6 text-gray-700 italic text-lg leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <Image
                  src={testimonial.image}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
