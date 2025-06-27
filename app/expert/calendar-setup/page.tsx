// app/expert/calendar-setup/page.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProviderSelection from "@/components/expert/calendar-setup/provider-selection";
import ConnectionStatus from "@/components/expert/calendar-setup/connection-status";
import supabase from "@/lib/supabase/supabase-client";

type SetupStep = "select" | "connecting" | "success" | "error";

interface ConnectionState {
  step: SetupStep;
  provider?: string;
  error?: string;
  isLoading: boolean;
}

const CalendarSetupPage = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    step: "select",
    isLoading: false,
  });

  const handleProviderSelect = async (provider: string) => {
    setConnectionState({
      step: "connecting",
      provider,
      isLoading: true,
    });

    try {
      console.log('Starting OAuth flow for provider:', provider);
      
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }
      
      // Start OAuth flow
      const response = await fetch('/api/nylas/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ provider }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        console.log('Redirecting to:', data.authUrl);
        // Redirect to OAuth URL
        window.location.href = data.authUrl;
      } else {
        console.error('OAuth start failed:', data.error);
        setConnectionState({
          step: "error",
          provider,
          error: data.error || "Failed to start authentication",
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      setConnectionState({
        step: "error",
        provider,
        error: "Network error occurred",
        isLoading: false,
      });
    }
  };

  const handleRetry = () => {
    setConnectionState({
      step: "select",
      isLoading: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Connect Your Calendar
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                Connect your calendar to manage your availability and automatically sync your consultation sessions.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Benefits Section */}
            <div className="bg-blue-50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-blue-900">Why connect your calendar?</h3>
              <div className="grid gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-blue-800">Automatically block consultation times</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-blue-800">Prevent double-booking conflicts</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-blue-800">Show real-time availability to clients</span>
                </div>
              </div>
            </div>

            {/* Connection Flow */}
            {connectionState.step === "select" && (
              <ProviderSelection
                onProviderSelect={handleProviderSelect}
                isLoading={connectionState.isLoading}
              />
            )}

            {(connectionState.step === "connecting" || 
              connectionState.step === "success" || 
              connectionState.step === "error") && (
              <ConnectionStatus
                step={connectionState.step}
                provider={connectionState.provider}
                error={connectionState.error}
                onRetry={handleRetry}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarSetupPage;