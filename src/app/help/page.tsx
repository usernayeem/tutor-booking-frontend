import { HelpCircle, Book, Shield, CreditCard, User, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
  { title: "Getting Started", icon: HelpCircle, color: "text-blue-500", bg: "bg-blue-50" },
  { title: "Tutor Guide", icon: Book, color: "text-purple-500", bg: "bg-purple-50" },
  { title: "Payments", icon: CreditCard, color: "text-green-500", bg: "bg-green-50" },
  { title: "Account", icon: User, color: "text-orange-500", bg: "bg-orange-50" },
  { title: "Trust & Safety", icon: Shield, color: "text-red-500", bg: "bg-red-50" },
  { title: "Technical Support", icon: MessageCircle, color: "text-teal-500", bg: "bg-teal-50" },
];

const popularQuestions = [
  "How do I book a session with a tutor?",
  "What is the cancellation policy?",
  "How do I update my profile information?",
  "How are payments handled on the platform?",
  "How can I become a verified tutor?",
  "Is there a trial session available?"
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Help Center</h1>
          <p className="text-xl opacity-90">Find answers, guides, and support for your learning journey.</p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Browse by Category</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <div key={i} className="p-8 border border-border rounded-[2rem] hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer group">
                <div className={`h-14 w-14 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
                <p className="text-muted-foreground mb-4">Articles and guides to help you master {cat.title.toLowerCase()}.</p>
                <div className="flex items-center gap-2 text-primary font-bold">
                  Explore articles
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Questions */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Popular Questions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {popularQuestions.map((q, i) => (
                <Link key={i} href="#" className="flex items-center gap-4 p-4 hover:bg-background rounded-xl transition-colors group">
                  <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  <span className="font-medium text-foreground/80 group-hover:text-primary transition-colors">{q}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still need help? */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto bg-card border border-border p-12 rounded-[3rem] text-center space-y-8 shadow-sm">
            <h2 className="text-3xl font-bold">Still need help?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              If you can't find the answer you're looking for, our support team is available 24/7 to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="h-14 px-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                Contact Support
              </Link>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
