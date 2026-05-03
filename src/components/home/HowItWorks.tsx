import { UserPlus, Search, CalendarCheck, GraduationCap } from "lucide-react";

const steps = [
  {
    title: "Create an Account",
    description: "Sign up as a student or tutor in just a few minutes. It's completely free to join our community.",
    icon: UserPlus,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Find Your Match",
    description: "Browse through hundreds of vetted expert tutors. Filter by subject, rating, and availability.",
    icon: Search,
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    title: "Book a Session",
    description: "Select a time that works for you and book a 1-on-1 session. Secure payments via Stripe.",
    icon: CalendarCheck,
    color: "bg-green-500/10 text-green-600",
  },
  {
    title: "Start Learning",
    description: "Join your interactive video classroom and start your journey to academic excellence.",
    icon: GraduationCap,
    color: "bg-orange-500/10 text-orange-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How TutorBooking Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in four simple steps and transform your learning experience today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-border -z-10" />
              )}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`h-16 w-16 rounded-2xl ${step.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
