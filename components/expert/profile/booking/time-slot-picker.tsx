// components/expert/profile/booking/components/TimeSlotPicker.tsx
"use client";

import React from 'react';
import { Clock } from 'lucide-react';

interface TimeSlotPickerProps {
  selectedDate: string;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  availableTimeSlots: string[];
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  selectedTime,
  onTimeSelect,
  onNext,
  availableTimeSlots,
}) => {
  const formatDate = (dateString: string) => {
    // Parse the date string as a local date to avoid timezone conversion
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isNextEnabled = selectedDate && selectedTime;

  if (!selectedDate) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">Select a date</p>
          <p className="text-sm">Choose a date from the left to see available time slots</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-xs">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Available Times</h3>
        </div>
        <p className="text-sm text-gray-600">
          {formatDate(selectedDate)}
        </p>
      </div>
      
      {availableTimeSlots.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No available time slots for this date.</p>
            <p className="text-sm text-gray-500 mt-2">Try selecting a different date.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Time Slots - Single Column */}
          <div className="flex-1 overflow-y-auto mb-4">
            <div className="space-y-3">
              {availableTimeSlots.map((timeSlot) => (
                <button
                  key={timeSlot}
                  onClick={() => onTimeSelect(timeSlot)}
                  className={`
                    w-full relative px-4 py-3 rounded-lg text-center transition-all duration-200 border-2
                    ${selectedTime === timeSlot 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'hover:border-blue-300 hover:bg-blue-50 border-gray-200 bg-white'
                    }
                  `}
                >
                  <div className="font-semibold">
                    {timeSlot}
                  </div>
                  
                  {/* Available indicator - blue circle for unselected */}
                  {selectedTime !== timeSlot && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Next Button - Fixed at bottom */}
          <div className="flex-shrink-0 border-t pt-4">
            <button
              onClick={onNext}
              disabled={!isNextEnabled}
              className={`
                w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
                ${isNextEnabled 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isNextEnabled ? 'Next' : 'Select a time slot'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TimeSlotPicker;