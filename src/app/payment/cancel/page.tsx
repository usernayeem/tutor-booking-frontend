"use client";

import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-2xl shadow-xl border border-red-50">
        <div className="flex justify-center">
          <div className="bg-red-100 p-3 rounded-full">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Payment Cancelled</h1>
          <p className="text-gray-500">
            It looks like you cancelled the payment process. Don't worry, your slot is still reserved for a short time in your dashboard.
          </p>
        </div>

        <div className="pt-6">
          <Link
            href="/dashboard/student"
            className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-lg gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Need help? <Link href="/" className="text-blue-600 hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
