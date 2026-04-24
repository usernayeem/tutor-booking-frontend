"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Mail, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPasswordPage() {
  const { forgetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgetPassword(email);
      setSent(true);
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {sent ? "Check your email" : "Forgot password?"}
          </CardTitle>
          <CardDescription>
            {sent
              ? `We've sent a password reset OTP to ${email}. Please check your inbox.`
              : "Enter your registered email address and we'll send you an OTP to reset your password."}
          </CardDescription>
        </CardHeader>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Sending OTP..."
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" /> Send Reset OTP
                  </span>
                )}
              </Button>
              <Link
                href="/login"
                className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Login
              </Link>
            </CardFooter>
          </form>
        ) : (
          <CardFooter className="flex flex-col gap-3 pt-2">
            <Link href={`/reset-password?email=${encodeURIComponent(email)}`}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Enter OTP &amp; Reset Password
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-sm text-gray-500 hover:text-blue-600 underline transition-colors"
            >
              Use a different email
            </button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
