// components/expert/dashboard/availability/schedules/time-picker.tsx
"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  className?: string;
}

const TimePicker = ({ value, onChange, className }: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Generate time options (15-minute intervals)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = formatDisplayTime(timeString);
        times.push({ value: timeString, display: displayTime });
      }
    }
    return times;
  };

  const formatDisplayTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour}:${minute} ${period}`;
  };

  const timeOptions = generateTimeOptions();
  const displayValue = formatDisplayTime(value);

  const handleTimeSelect = (timeValue: string) => {
    onChange(timeValue);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`
            inline-flex items-center justify-between px-3 py-1.5 text-sm 
            border border-gray-200 rounded-md hover:border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            bg-white transition-colors duration-150 min-w-[80px]
            ${className}
          `}
        >
          <span className="font-medium">{displayValue}</span>
          <ChevronDown className="w-3 h-3 ml-2 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-32 max-h-60 overflow-y-auto"
        align="start"
      >
        {timeOptions.map((time) => (
          <DropdownMenuItem
            key={time.value}
            onClick={() => handleTimeSelect(time.value)}
            className={`
              text-sm cursor-pointer
              ${time.value === value ? 'bg-blue-50 text-blue-600 font-medium' : ''}
            `}
          >
            {time.display}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TimePicker;