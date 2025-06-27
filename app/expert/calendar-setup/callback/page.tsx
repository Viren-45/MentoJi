// app/expert/calendar-setup/callback/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CalendarCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Check for OAuth errors
        if (error) {
          setStatus('error');
          setError(`Authentication failed: ${error}`);
          return;
        }

        if (!code || !state) {
          setStatus('error');
          setError('Missing authorization code or state parameter');
          return;
        }

        // Parse state to get provider and expert ID
        let stateData;
        try {
          stateData = JSON.parse(state);
        } catch {
          setStatus('error');
          setError('Invalid state parameter');
          return;
        }

        // Exchange code for access token
        const response = await fetch('/api/nylas/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            provider: stateData.provider,
            expertId: stateData.expertId,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setStatus('success');
          // Redirect to success page after a short delay
          setTimeout(() => {
            router.push('/expert/calendar-setup/success');
          }, 2000);
        } else {
          setStatus('error');
          setError(result.error || 'Failed to connect calendar');
        }

      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setError('An unexpected error occurred');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-gray-900">
              {status === 'processing' && 'Connecting Calendar...'}
              {status === 'success' && 'Calendar Connected!'}
              {status === 'error' && 'Connection Failed'}
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            {status === 'processing' && (
              <div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                <p className="text-gray-600">
                  Please wait while we connect your calendar...
                </p>
              </div>
            )}

            {status === 'success' && (
              <div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                <p className="text-gray-600">
                  Your calendar has been successfully connected! Redirecting to your dashboard...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/expert/calendar-setup')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/expert/dashboard')}
                    className="w-full"
                  >
                    Skip for Now
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarCallbackPage;