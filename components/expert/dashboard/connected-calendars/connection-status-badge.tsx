// components/expert/dashboard/connected-calendars/connection-status-badge.tsx
"use client";

import React from "react";

interface ConnectionStatusBadgeProps {
  isConnected: boolean;
  comingSoon?: boolean;
}

const ConnectionStatusBadge = ({ isConnected, comingSoon }: ConnectionStatusBadgeProps) => {
  if (comingSoon) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
        Coming Soon
      </span>
    );
  }

  if (isConnected) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
        Connected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      Available
    </span>
  );
};

export default ConnectionStatusBadge;