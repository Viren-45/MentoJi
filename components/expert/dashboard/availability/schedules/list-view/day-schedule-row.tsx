// components/expert/dashboard/availability/schedules/list-view/day-schedule-row.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TimeSlotRow from "./time-slot-row";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  day: string;
  dayCode: string;
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

interface DayScheduleRowProps {
  daySchedule: DaySchedule;
  onChange: (updatedDay: DaySchedule) => void;
  onCopyTimeSlot: (timeSlot: TimeSlot, fromDay: string) => void;
}

const DayScheduleRow = ({ daySchedule, onChange, onCopyTimeSlot }: DayScheduleRowProps) => {
  const { day, dayCode, isAvailable, timeSlots } = daySchedule;

  const handleAvailabilityToggle = () => {
    if (!isAvailable) {
      // When making available, add a default time slot
      onChange({
        ...daySchedule,
        isAvailable: true,
        timeSlots: [{ id: `${day}-1`, startTime: "09:00", endTime: "17:00" }]
      });
    } else {
      // When making unavailable, clear all time slots
      onChange({
        ...daySchedule,
        isAvailable: false,
        timeSlots: []
      });
    }
  };

  const handleTimeSlotChange = (field: 'startTime' | 'endTime', time: string) => {
    // Since we only have one time slot, update the first (and only) one
    const updatedTimeSlot = { ...timeSlots[0], [field]: time };
    
    onChange({
      ...daySchedule,
      timeSlots: [updatedTimeSlot]
    });
  };

  const handleRemoveTimeSlot = () => {
    // Since we only have one time slot, removing it makes the day unavailable
    onChange({
      ...daySchedule,
      isAvailable: false,
      timeSlots: []
    });
  };

  const handleCopyTimeSlot = (timeSlot: TimeSlot) => {
    onCopyTimeSlot(timeSlot, day);
  };

  const getDayCircleClass = () => {
    return "w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-medium flex items-center justify-center";
  };

  return (
    <div className="py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-start space-x-4">
        {/* Day Circle */}
        <div className={getDayCircleClass()}>
          {dayCode}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {!isAvailable ? (
            /* Unavailable State */
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Unavailable</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAvailabilityToggle}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                title="Add availability"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            /* Available State - Single Time Slot */
            <div>
              {timeSlots.length > 0 && (
                <TimeSlotRow
                  timeSlot={timeSlots[0]}
                  onTimeChange={handleTimeSlotChange}
                  onRemove={handleRemoveTimeSlot}
                  onCopy={handleCopyTimeSlot}
                  showCopyButton={true}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayScheduleRow;