// components/expert/dashboard/connected-calendars/connected-calendars-page.tsx
"use client";

import React from "react";
import CalendarConnectionsList from "./calendar-connections-list";

const ConnectedCalendarsPage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Description */}
      <div>
        <h3 className="text-base font-medium text-gray-900 mb-6">
          These calendars will be used to prevent double bookings
        </h3>
      </div>

      {/* Calendar connections list */}
      <div className="space-y-4">
        <CalendarConnectionsList />
      </div>

      {/* Footer info */}
      <div className="text-center pt-4">
        <p className="text-sm text-gray-500">
          Need help connecting your calendar?{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default ConnectedCalendarsPage;