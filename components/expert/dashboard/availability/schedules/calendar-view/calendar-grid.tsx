// components/expert/dashboard/availability/schedules/calendar-view/calendar-grid.tsx
"use client";

import React from "react";
import CalendarDayCell from "./calendar-day-cell";

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

interface CalendarGridProps {
  calendarDays: CalendarDay[];
}

const CalendarGrid = ({ calendarDays }: CalendarGridProps) => {
  const dayHeaders = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Split calendar days into weeks (7 days each)
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {dayHeaders.map((day) => (
          <div
            key={day}
            className="p-4 text-center text-base font-semibold text-gray-600 uppercase tracking-wide bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Weeks */}
      <div className="divide-y divide-gray-200">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 divide-x divide-gray-200">
            {week.map((day, dayIndex) => (
              <CalendarDayCell
                key={`${weekIndex}-${dayIndex}`}
                day={day}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;