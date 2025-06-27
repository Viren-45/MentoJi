// components/expert/dashboard/availability/schedules/calendar-view/calendar-header.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TimezonePicker from "@/components/expert/dashboard/availability/schedules/shared/timezone-picker";

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

const CalendarHeader = ({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  timezone,
  onTimezoneChange
}: CalendarHeaderProps) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const formatMonthYear = () => {
    return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  return (
    <div className="flex items-center justify-between">
      {/* Month Navigation */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreviousMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h3 className="text-lg font-medium text-gray-900 min-w-[140px] text-center">
          {formatMonthYear()}
        </h3>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onNextMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Timezone Selector - Using shared component */}
      <div className="flex items-center space-x-2">
        <TimezonePicker
          value={timezone}
          onChange={onTimezoneChange}
          triggerClassName="text-gray-600 hover:text-gray-900"
          contentClassName="w-96"
        />
      </div>
    </div>
  );
};

export default CalendarHeader;