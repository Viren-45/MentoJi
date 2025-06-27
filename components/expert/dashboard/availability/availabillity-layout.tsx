// components/expert/dashboard/availability/availability-layout.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import AvailabilityTabs from "./availability-tabs";

interface AvailabilityLayoutProps {
  children: React.ReactNode;
}

const AvailabilityLayout = ({ children }: AvailabilityLayoutProps) => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">Availability</h1>
          <Button 
            variant="outline" 
            size="sm"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Learn more
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <AvailabilityTabs />

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default AvailabilityLayout;