// components/expert/dashboard/availability/schedules/modals/copy-times-modal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface CopyTimesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selectedDays: string[]) => void;
  timeSlot: TimeSlot | null;
  currentDay: string;
  availableDays: string[];
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday", 
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const CopyTimesModal = ({ 
  isOpen, 
  onClose, 
  onApply, 
  timeSlot, 
  currentDay,
  availableDays 
}: CopyTimesModalProps) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const formatDisplayTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour}:${minute} ${period}`;
  };

  const handleDayToggle = (day: string, checked: boolean) => {
    if (checked) {
      setSelectedDays([...selectedDays, day]);
    } else {
      setSelectedDays(selectedDays.filter(d => d !== day));
    }
  };

  const handleApply = () => {
    onApply(selectedDays);
    setSelectedDays([]);
    onClose();
  };

  const handleClose = () => {
    setSelectedDays([]);
    onClose();
  };

  if (!timeSlot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">
            Copy times to...
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {/* Time Display */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="text-sm text-blue-600 font-medium">
            {formatDisplayTime(timeSlot.startTime)} - {formatDisplayTime(timeSlot.endTime)}
          </div>
        </div>

        {/* Day Selection */}
        <div className="space-y-3">
          {DAYS_OF_WEEK.map((day) => {
            const isCurrentDay = day === currentDay;
            const isAvailable = availableDays.includes(day);
            
            return (
              <div
                key={day}
                className={`
                  flex items-center space-x-3 p-2 rounded-md
                  ${isCurrentDay ? 'bg-gray-100' : 'hover:bg-gray-50'}
                `}
              >
                <Checkbox
                  id={day}
                  checked={selectedDays.includes(day)}
                  onCheckedChange={(checked) => handleDayToggle(day, checked as boolean)}
                  disabled={isCurrentDay}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label
                  htmlFor={day}
                  className={`
                    text-sm cursor-pointer flex-1
                    ${isCurrentDay ? 'text-gray-500' : 'text-gray-900'}
                    ${!isAvailable && !isCurrentDay ? 'text-gray-400' : ''}
                  `}
                >
                  {day}
                  {isCurrentDay && (
                    <span className="ml-2 text-xs text-gray-400">(current)</span>
                  )}
                  {!isAvailable && !isCurrentDay && (
                    <span className="ml-2 text-xs text-gray-400">(unavailable)</span>
                  )}
                </label>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-900"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={selectedDays.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CopyTimesModal;