import { ShieldCheck, Video, CalendarClock, CreditCard } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Verified Tutors",
      description: "Every tutor goes through a strict verification process to ensure top-quality education.",
      icon: ShieldCheck,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "1-on-1 Video Sessions",
      description: "Learn effectively with high-quality, interactive video classrooms built for education.",
      icon: Video,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Flexible Scheduling",
      description: "Book sessions at times that work best for you. Easy rescheduling and cancellations.",
      icon: CalendarClock,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Secure Payments",
      description: "Pay securely via Stripe. 100% satisfaction guarantee or your money back.",
      icon: CreditCard,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Choose TutorBooking?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We provide everything you need to achieve your academic goals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl bg-card border border-border p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
