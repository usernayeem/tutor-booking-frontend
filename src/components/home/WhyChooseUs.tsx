import { CheckCircle, ShieldCheck, Zap, HeartHandshake } from "lucide-react";

const reasons = [
  {
    title: "Vetted Expert Tutors",
    description: "Every tutor on our platform undergoes a rigorous 4-step verification process to ensure quality and safety.",
    icon: ShieldCheck,
    color: "text-green-500",
  },
  {
    title: "Interactive Learning",
    description: "Our integrated classroom features video, whiteboards, and collaborative tools for a superior learning experience.",
    icon: Zap,
    color: "text-yellow-500",
  },
  {
    title: "Personalized Approach",
    description: "Get a customized learning plan tailored to your specific goals, pace, and learning style.",
    icon: HeartHandshake,
    color: "text-red-500",
  },
  {
    title: "Guaranteed Satisfaction",
    description: "If you're not satisfied with your first lesson, we'll find you a new tutor for free. Your learning is our priority.",
    icon: CheckCircle,
    color: "text-blue-500",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Thousands of Students Trust Us
          </h2>
          <p className="text-lg text-muted-foreground">
            We provide the most effective and secure platform for connecting students with expert educators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {reasons.map((reason, index) => (
            <div key={index} className="flex gap-6 items-start">
              <div className={`p-3 rounded-2xl bg-card border border-border shadow-sm ${reason.color}`}>
                <reason.icon className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">{reason.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
