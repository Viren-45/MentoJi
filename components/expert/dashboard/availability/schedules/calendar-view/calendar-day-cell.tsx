// components/expert/dashboard/availability/schedules/calendar-view/calendar-day-cell.tsx
"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import CalendarTimeSlot from "./calendar-time-slot";

interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  timeSlots: TimeSlot[];
  isUnavailable?: boolean;
  unavailableReason?: string;
}

interface CalendarDayCellProps {
  day: CalendarDay;
}

const CalendarDayCell = ({ day }: CalendarDayCellProps) => {
  const {
    date,
    dayNumber,
    isCurrentMonth,
    isToday,
    timeSlots,
    isUnavailable,
    unavailableReason
  } = day;

  // Check if the date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
  const cellDate = new Date(date);
  cellDate.setHours(0, 0, 0, 0);
  const isPast = cellDate < today;
  const isClickable = isCurrentMonth && !isPast;

  const getCellClasses = () => {
    let classes = "min-h-[150px] p-3 relative transition-all duration-150 flex flex-col ";
    
    if (!isCurrentMonth) {
      classes += "bg-gray-50 ";
    } else if (isPast) {
      classes += "bg-gray-100 ";
    } else {
      classes += "bg-white hover:border-blue-500 hover:border-2 cursor-pointer ";
    }

    return classes;
  };

  const getDayNumberClasses = () => {
    let classes = "text-sm font-bold mb-2 ";
    
    if (!isCurrentMonth) {
      classes += "text-gray-400 ";
    } else if (isPast) {
      classes += "text-gray-500 ";
    } else if (isToday) {
      classes += "text-blue-600 font-bold";
    } else {
      classes += "text-gray-900 ";
    }

    return classes;
  };

  const getTimeSlotOpacity = () => {
    if (!isCurrentMonth || isPast) {
      return "opacity-50";
    }
    return "";
  };

  return (
    <div className={getCellClasses()}>
      {/* Day Number */}
      <div className="flex items-center justify-between">
        <span className={getDayNumberClasses()}>
          {dayNumber}
        </span>
        
        {/* Recurring indicator for special days */}
        {unavailableReason && isClickable && (
          <RotateCcw className="w-3 h-3 text-gray-400" />
        )}
      </div>

      {/* Time Slots or Unavailable Message - Centered */}
      <div className={`flex-1 flex flex-col font-semibold items-center justify-center ${getTimeSlotOpacity()}`}>
        {isUnavailable ? (
          <div className="text-xs text-gray-500 text-center">
            {unavailableReason ? (
              <>
                <div className="font-medium text-gray-700">{unavailableReason}</div>
                <div className="text-gray-500">Unavailable</div>
              </>
            ) : (
              <div className="text-gray-500">Unavailable</div>
            )}
          </div>
        ) : (
          <div className="space-y-1 text-center">
            {timeSlots.map((slot, index) => (
              <CalendarTimeSlot
                key={index}
                startTime={slot.startTime}
                endTime={slot.endTime}
                isAvailable={slot.isAvailable}
                isPast={isPast}
                isCurrentMonth={isCurrentMonth}
              />
            ))}
          </div>
        )}
      </div>

      {/* Today indicator */}
      {isToday && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></div>
      )}
    </div>
  );
};

export default CalendarDayCell;