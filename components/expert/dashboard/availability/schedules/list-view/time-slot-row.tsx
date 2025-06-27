// components/expert/dashboard/availability/schedules/list-view/time-slot-row.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, Copy } from "lucide-react";
import TimePicker from "./time-picker";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface TimeSlotRowProps {
  timeSlot: TimeSlot;
  onTimeChange: (field: 'startTime' | 'endTime', time: string) => void;
  onRemove: () => void;
  onCopy: (timeSlot: TimeSlot) => void;
  showCopyButton?: boolean;
}

const TimeSlotRow = ({ 
  timeSlot, 
  onTimeChange, 
  onRemove, 
  onCopy,
  showCopyButton = true 
}: TimeSlotRowProps) => {
  const { startTime, endTime } = timeSlot;

  return (
    <div className="flex items-center space-x-3">
      {/* Start Time */}
      <TimePicker
        value={startTime}
        onChange={(time) => onTimeChange('startTime', time)}
      />
      
      {/* Separator */}
      <span className="text-gray-500">-</span>
      
      {/* End Time */}
      <TimePicker
        value={endTime}
        onChange={(time) => onTimeChange('endTime', time)}
      />

      {/* Actions */}
      <div className="flex items-center space-x-1">
        {/* Remove Time Slot */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
          title="Remove time slot"
        >
          <X className="w-4 h-4" />
        </Button>
        
        {/* Copy to Other Days */}
        {showCopyButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(timeSlot)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            title="Copy to other days"
          >
            <Copy className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TimeSlotRow;