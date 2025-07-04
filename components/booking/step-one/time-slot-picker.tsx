// components/booking/step-one/time-slot-picker.tsx
"use client";

import React from 'react';
import { Clock } from 'lucide-react';

interface TimeSlotPickerProps {
  selectedDate: string;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  availableTimeSlots: string[];
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  selectedTime,
  onTimeSelect,
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

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!selectedDate) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Available Times</h3>
        </div>
        
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">Select a date</p>
            <p className="text-sm">Choose a date from the left to see available time slots</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Available Times</h3>
        </div>
        <p className="text-sm text-gray-600">
          {formatDate(selectedDate)}
        </p>
      </div>
      
      {availableTimeSlots.length === 0 ? (
        <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No available time slots</p>
            <p className="text-sm text-gray-500 mt-2">Try selecting a different date.</p>
          </div>
        </div>
      ) : (
        <div className="max-h-90 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {availableTimeSlots.map((timeSlot) => (
              <button
                key={timeSlot}
                onClick={() => onTimeSelect(timeSlot)}
                className={`
                  relative px-4 py-3 rounded-lg text-center transition-all duration-200 border-2 font-medium
                  ${selectedTime === timeSlot 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                    : 'hover:border-blue-300 hover:bg-blue-50 border-gray-200 bg-white text-gray-900'
                  }
                `}
              >
                <div className="text-sm">
                  {formatTime(timeSlot)}
                </div>
                
                {/* Available indicator - blue circle for unselected */}
                {selectedTime !== timeSlot && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Time slots info */}
      {availableTimeSlots.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>{availableTimeSlots.length}</strong> time slot{availableTimeSlots.length !== 1 ? 's' : ''} available on this date
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;