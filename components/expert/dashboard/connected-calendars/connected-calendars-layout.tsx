// components/expert/dashboard/connected-calendars/connected-calendars-layout.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import CalendarInfoModal from "./calendar-info-modal";

interface ConnectedCalendarsLayoutProps {
  children: React.ReactNode;
}

const ConnectedCalendarsLayout = ({ children }: ConnectedCalendarsLayoutProps) => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">Calendar settings</h1>
          <CalendarInfoModal>
            <Button 
              variant="outline" 
              size="sm"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Learn more
            </Button>
          </CalendarInfoModal>
        </div>
      </div>

      {/* Description */}
      <div>
        <p className="text-sm text-gray-600">
          Set which calendars we use to check for busy times
        </p>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default ConnectedCalendarsLayout;