"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileRedirect() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push(`/dashboard/${user.role.toLowerCase()}/profile`);
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return <div className="min-h-screen flex items-center justify-center">Redirecting to profile...</div>;
}
