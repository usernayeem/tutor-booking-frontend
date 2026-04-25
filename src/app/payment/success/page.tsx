"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to student dashboard after 5 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard/student");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-2xl shadow-xl border border-green-50">
        <div className="flex justify-center">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="text-gray-500">
            Thank you for your payment. Your session has been successfully booked and confirmed.
          </p>
        </div>

        <div className="pt-6">
          <Link
            href="/dashboard/student"
            className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200 gap-2"
          >
            Go to My Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-xs text-gray-400">
            Redirecting to dashboard in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
