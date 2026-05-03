"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Clock, BookOpen, UserCheck } from "lucide-react";

const isProd = process.env.NODE_ENV === "production";
const fallbackURL = isProd 
  ? "https://tutor-booking-backend.vercel.app/api/v1" 
  : "http://localhost:5000/api/v1";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || fallbackURL;

export default function Statistics() {
  const [stats, setStats] = useState([
    { label: "Expert Tutors", value: "...", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Total Subjects", value: "...", icon: BookOpen, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Active Sessions", value: "5k+", icon: UserCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Success Rate", value: "99%", icon: Clock, color: "text-green-500", bg: "bg-green-500/10" },
  ]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [tutorsRes, subjectsRes] = await Promise.all([
          fetch(`${API_BASE}/tutors?limit=1`),
          fetch(`${API_BASE}/subjects`),
        ]);

        const tutorsData = await tutorsRes.json();
        const subjectsData = await subjectsRes.json();

        const tutorCount = tutorsData?.meta?.total || tutorsData?.data?.length || 0;
        const subjectCount = subjectsData?.data?.length || 0;

        setStats(prev => [
          { ...prev[0], value: `${tutorCount}+` },
          { ...prev[1], value: `${subjectCount}` },
          prev[2],
          prev[3],
        ]);
      } catch (error) {
        console.error("Failed to fetch statistics", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
