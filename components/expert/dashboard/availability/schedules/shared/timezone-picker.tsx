// components/expert/dashboard/availability/schedules/shared/timezone-picker.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { ALL_TIMEZONES, getTimezonesByRegion, findTimezone } from "./timezone-data";

interface TimezonePickerProps {
  value: string;
  onChange: (timezone: string) => void;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

const TimezonePicker = ({ 
  value, 
  onChange, 
  className = "",
  triggerClassName = "",
  contentClassName = ""
}: TimezonePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userTimezone, setUserTimezone] = useState("");
  const [currentTimes, setCurrentTimes] = useState<Record<string, string>>({});

  // Auto-detect user's timezone
  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimezone(detected);
    } catch (error) {
      console.warn('Could not detect timezone:', error);
      setUserTimezone('UTC');
    }
  }, []);

  // Update current times every minute
  useEffect(() => {
    const updateTimes = () => {
      const times: Record<string, string> = {};
      ALL_TIMEZONES.forEach(tz => {
        try {
          const now = new Date();
          const timeString = now.toLocaleTimeString('en-US', {
            timeZone: tz.value,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          });
          times[tz.value] = timeString;
        } catch (error) {
          times[tz.value] = '--:--';
        }
      });
      setCurrentTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Group timezones by region
  const groupedTimezones = getTimezonesByRegion();

  // Find current timezone display name
  const getCurrentDisplayName = () => {
    const found = findTimezone(value);
    return found?.value || value;
  };

  // Check if timezone is user's detected timezone
  const isUserTimezone = (timezoneValue: string) => {
    return timezoneValue === userTimezone;
  };

  // Handle timezone selection
  const handleTimezoneSelect = (timezoneValue: string) => {
    onChange(timezoneValue);
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger 
          className={`
            flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:ring-offset-1 rounded px-2 py-1
            ${triggerClassName}
          `}
        >
          <span className="font-medium">{getCurrentDisplayName()}</span>
          <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className={`w-96 max-h-96 overflow-hidden p-0 ${contentClassName}`}
          align="start"
        >
          {/* Scrollable Content */}
          <div className="max-h-96 overflow-y-auto">
            {/* User's detected timezone at top if different */}
            {userTimezone && !ALL_TIMEZONES.some(tz => tz.value === userTimezone && tz.value === value) && (
              <div className="p-2 border-b border-gray-100">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 px-2">
                  DETECTED
                </div>
                <DropdownMenuItem
                  onClick={() => handleTimezoneSelect(userTimezone)}
                  className="text-sm cursor-pointer p-2 rounded hover:bg-blue-50"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-blue-600 font-medium">
                      {userTimezone.split('/').pop()?.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm font-mono text-gray-600">
                      {currentTimes[userTimezone] || '--:--'}
                    </span>
                  </div>
                </DropdownMenuItem>
              </div>
            )}
            
            {/* Grouped timezones */}
            {Object.entries(groupedTimezones).map(([region, timezones]) => (
              <div key={region}>
                {/* Region Header */}
                <div className="sticky top-0 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  {region.replace('_', '/')}
                </div>
                
                {/* Region Timezones */}
                <div className="p-2">
                  {timezones.map((timezone) => (
                    <DropdownMenuItem
                      key={timezone.value}
                      onClick={() => handleTimezoneSelect(timezone.value)}
                      className={`
                        text-sm cursor-pointer p-2 rounded mb-1 hover:bg-blue-50
                        ${timezone.value === value ? 'bg-blue-50 text-blue-600 font-medium' : ''}
                        ${isUserTimezone(timezone.value) && timezone.value !== value ? 'text-blue-500' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">
                          {timezone.display}
                        </span>
                        <span className="text-sm font-mono text-gray-600 ml-4 flex-shrink-0">
                          {currentTimes[timezone.value] || '--:--'}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TimezonePicker;