// components/expert/calendar-setup/connection-status.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ConnectionStatusProps {
  step: "connecting" | "success" | "error";
  provider?: string;
  error?: string;
  onRetry: () => void;
}

const ConnectionStatus = ({ step, provider, error, onRetry }: ConnectionStatusProps) => {
  const router = useRouter();

  if (step === "connecting") {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-blue-600 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Connecting to {provider}...
          </h3>
          <p className="text-gray-600 mt-2">
            You'll be redirected to sign in to your calendar provider.
          </p>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Calendar Connected Successfully!
          </h3>
          <p className="text-gray-600 mt-2">
            Your {provider} calendar is now connected. You can start managing your availability.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={() => router.push("/expert/dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/expert/dashboard/availability")}
            className="w-full"
          >
            Set Up Availability
          </Button>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Connection Failed
          </h3>
          <p className="text-gray-600 mt-2">
            {error || "We couldn't connect to your calendar. Please try again."}
          </p>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={onRetry}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/expert/dashboard")}
            className="w-full"
          >
            Skip for Now
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Having trouble? Contact support for assistance.</p>
        </div>
      </div>
    );
  }

  return null;
};

export default ConnectionStatus;