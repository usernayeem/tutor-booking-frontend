"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { BookOpen, ArrowLeft, MailCheck } from "lucide-react";
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
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/auth";
import { toast } from "sonner";

function VerifyEmailForm() {
  const { verifyEmail } = useAuth();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [formData, setFormData] = useState({
    email: emailFromQuery,
    otp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyEmail({ email: formData.email, otp: formData.otp });
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address first.");
      return;
    }
    setIsResending(true);
    try {
      await authService.forgetPassword(formData.email);
      toast.success("A new OTP has been sent to your email.");
    } catch (error: any) {
      // If forget-password fails (e.g. email not verified), try login to trigger resend
      toast.info("Please check your inbox — an OTP was already sent upon registration.");
    } finally {
      setIsResending(false);
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
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription>
            We sent a verification OTP to your email. Enter it below to activate your account.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="verify-email">Email address</Label>
              <Input
                id="verify-email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* OTP */}
            <div className="space-y-2">
              <Label htmlFor="verify-otp">Verification OTP</Label>
              <Input
                id="verify-otp"
                name="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                className="tracking-widest text-center font-mono text-lg"
                value={formData.otp}
                onChange={handleChange}
              />
            </div>

            {/* Resend link */}
            <div className="text-center text-sm text-gray-500">
              Didn&apos;t receive the OTP?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-blue-600 hover:underline font-medium disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                "Verifying..."
              ) : (
                <span className="flex items-center gap-2">
                  <MailCheck className="h-4 w-4" /> Verify Email
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
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
