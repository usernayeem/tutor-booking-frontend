"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Loader2, XCircle } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const verificationStarted = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || verificationStarted.current) return;

      verificationStarted.current = true;
      try {
        const response = await api.post("/payment/verify-payment", {
          stripeSessionId: sessionId
        });

        if (response.data?.success) {
          setIsSuccess(true);
        } else {
          toast.error("Payment verification failed. Please contact support if you were charged.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("An error occurred during verification.");
      } finally {
        setIsVerifying(false);
      }
    };

    if (sessionId) {
      verifyPayment();
    } else {
      setIsVerifying(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!isVerifying && isSuccess) {
      const timer = setTimeout(() => {
        router.push("/dashboard/student");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVerifying, isSuccess, router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-card rounded-2xl shadow-xl border border-border">
        <div className="flex justify-center">
          {isVerifying ? (
            <div className="bg-primary/10 p-4 rounded-full animate-pulse">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : isSuccess ? (
            <div className="bg-green-500/10 p-4 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          ) : (
            <div className="bg-destructive/10 p-4 rounded-full">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {isVerifying ? "Verifying Payment..." : isSuccess ? "Payment Successful!" : "Verification Failed"}
          </h1>
          <p className="text-muted-foreground">
            {isVerifying
              ? "We are confirming your payment with Stripe. Please wait a moment."
              : isSuccess
                ? "Thank you for your payment. Your session has been successfully booked and confirmed."
                : "We couldn't verify your payment. If you've been charged, please contact our support team."
            }
          </p>
        </div>

        <div className="pt-6">
          <Link
            href="/dashboard/student"
            className={`inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white rounded-lg transition-all shadow-lg gap-2 ${isSuccess ? "bg-green-600 hover:bg-green-700 shadow-green-500/10" : "bg-primary hover:bg-primary/90 shadow-primary/10"
              }`}
          >
            {isSuccess ? "Go to My Dashboard" : "Back to Dashboard"}
            <ArrowRight className="w-5 h-5" />
          </Link>
          {isSuccess && (
            <p className="mt-4 text-xs text-gray-400">
              Redirecting to dashboard in a few seconds...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
