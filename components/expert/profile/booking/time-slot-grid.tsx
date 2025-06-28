// components/expert/profile/booking/time-slot-grid.tsx
"use client";

import React from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { TimeSlotGridProps } from './types/booking-types';

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  selectedDate,
  selectedTimeSlot,
  timeSlots,
  loading,
  onSelectTimeSlot,
}) => {
  
  if (loading) {
    return (
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-base font-semibold text-gray-900 mb-4">
          Available times for {format(selectedDate, 'EEEE, MMMM d')}
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-base font-semibold text-gray-900 mb-4">
          Available times for {format(selectedDate, 'EEEE, MMMM d')}
        </h4>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-3">
            <Clock className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-gray-500 text-sm">
            No available time slots for this date.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Try selecting a different date.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-6">
      <h4 className="text-base font-semibold text-gray-900 mb-4">
        Available times for {format(selectedDate, 'EEEE, MMMM d')}
      </h4>
      
      <div className="grid grid-cols-3 gap-2">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => onSelectTimeSlot(slot)}
            className={`
              p-3 rounded-lg border text-center text-sm font-medium transition-all
              ${selectedTimeSlot === slot
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {slot}
          </button>
        ))}
      </div>

      {/* Selected slot confirmation */}
      {selectedTimeSlot && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              Selected: {format(selectedDate, 'MMM d, yyyy')} at {selectedTimeSlot}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotGrid;