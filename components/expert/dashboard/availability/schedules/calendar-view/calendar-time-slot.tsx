// components/expert/dashboard/availability/schedules/calendar-view/calendar-time-slot.tsx
"use client";

import React from "react";

interface CalendarTimeSlotProps {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isPast?: boolean;
  isCurrentMonth?: boolean;
}

const CalendarTimeSlot = ({ 
  startTime, 
  endTime, 
  isAvailable, 
  isPast = false,
  isCurrentMonth = true 
}: CalendarTimeSlotProps) => {
  
  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    return `${hour}:${minute}`;
  };

  const formatTimeRange = () => {
    return `${formatTime(startTime)} – ${formatTime(endTime)}`;
  };

  const getSlotClasses = () => {
    let classes = "text-xs leading-tight ";
    
    if (!isCurrentMonth || isPast) {
      classes += "text-gray-400 ";
    } else if (isAvailable) {
      classes += "text-gray-700 ";
    } else {
      classes += "text-gray-500 ";
    }

    return classes;
  };

  return (
    <div className={getSlotClasses()}>
      {formatTimeRange()}
    </div>
  );
};

export default CalendarTimeSlot;