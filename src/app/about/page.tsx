import Image from "next/image";
import { BookOpen, Users, Award, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-primary/5">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Empowering Students through <span className="text-primary">Expert Guidance</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We started with a simple mission: to make high-quality, personalized education accessible to everyone, everywhere.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent -z-10 hidden lg:block" />
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Our Story" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
                <p className="text-lg text-muted-foreground">
                  Founded in 2024, TutorBooking emerged from a growing need for a more transparent, effective, and secure way to find expert tutors. We noticed that while there were many platforms, few focused on the quality of the 1-on-1 relationship and the specific needs of modern students.
                </p>
                <p className="text-lg text-muted-foreground">
                  Today, we are a global community of thousands of students and hundreds of vetted educators, working together to achieve academic excellence and personal growth.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold">10k+ Students</h3>
                  <p className="text-sm text-muted-foreground">Trusted by learners worldwide</p>
                </div>
                <div className="space-y-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Award className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold">500+ Tutors</h3>
                  <p className="text-sm text-muted-foreground">Experts in every field</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These principles guide everything we do, from building our platform to supporting our community.
          </p>
        </div>

        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Quality First",
              desc: "We prioritize educational outcomes and tutor expertise above all else.",
              icon: BookOpen,
              color: "bg-blue-500"
            },
            {
              title: "Student Centered",
              desc: "Every feature we build is designed to improve the student's learning experience.",
              icon: Heart,
              color: "bg-red-500"
            },
            {
              title: "Trust & Safety",
              desc: "We maintain a secure environment with rigorous vetting and transparent reviews.",
              icon: Award,
              color: "bg-green-500"
            }
          ].map((value, i) => (
            <div key={i} className="p-8 bg-card border border-border rounded-3xl hover:shadow-xl transition-all">
              <div className={`h-12 w-12 rounded-2xl ${value.color} text-white flex items-center justify-center mb-6`}>
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team/Join Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-8">
          <h2 className="text-3xl font-bold">Ready to start your journey?</h2>
          <p className="text-lg text-muted-foreground">
            Whether you're looking to learn or looking to teach, there's a place for you in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="h-14 px-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/20">
              Join as a Student
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
