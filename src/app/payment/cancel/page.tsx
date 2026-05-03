"use client";

import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-card rounded-2xl shadow-xl border border-destructive/20">
        <div className="flex justify-center">
          <div className="bg-destructive/10 p-3 rounded-full">
            <XCircle className="w-16 h-16 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Payment Cancelled</h1>
          <p className="text-muted-foreground">
            It looks like you cancelled the payment process. Don't worry, your slot is still reserved for a short time in your dashboard.
          </p>
        </div>

        <div className="pt-6">
          <Link
            href="/dashboard/student"
            className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-lg gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Need help? <Link href="/" className="text-primary hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
