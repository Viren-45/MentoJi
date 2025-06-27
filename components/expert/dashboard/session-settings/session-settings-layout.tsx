// components/expert/dashboard/session-settings/session-settings-layout.tsx
"use client";

import React from "react";

interface SessionSettingsLayoutProps {
  children: React.ReactNode;
}

const SessionSettingsLayout = ({ children }: SessionSettingsLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Session Settings</h1>
          <p className="text-sm text-gray-600 mt-1">
            Configure your consultation durations, pricing, and booking preferences
          </p>
        </div>

        {/* Content Container */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SessionSettingsLayout;