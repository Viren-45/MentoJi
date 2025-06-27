// app/expert/calendar-setup/success/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CalendarSuccessPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-green-600"
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
              <CardTitle className="text-3xl font-bold text-gray-900">
                🎉 Calendar Connected Successfully!
              </CardTitle>
              <p className="text-lg text-gray-600 mt-3">
                Your calendar is now integrated with MentoJi. You're all set to start managing your availability!
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* What's Next Section */}
            <div className="bg-blue-50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-blue-900 text-lg">What's next?</h3>
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Set Your Availability</h4>
                    <p className="text-blue-800 text-sm">Define when you're available for consultations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Configure Session Settings</h4>
                    <p className="text-blue-800 text-sm">Set your consultation duration and pricing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Start Accepting Bookings</h4>
                    <p className="text-blue-800 text-sm">Your calendar will automatically sync with bookings</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Enabled */}
            <div className="bg-green-50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-green-900 text-lg">✅ Features Now Enabled</h3>
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-800">Automatic meeting invites</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                onClick={() => router.push("/expert/dashboard/availability")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Set Up Availability
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/expert/dashboard")}
                className="border-gray-300 hover:bg-gray-50"
              >
                Go to Dashboard
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help getting started?{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  View our setup guide
                </a>{" "}
                or{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  contact support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarSuccessPage;