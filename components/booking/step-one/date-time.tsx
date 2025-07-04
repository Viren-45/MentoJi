// components/booking/step-one/date-time.tsx
"use client";

import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import DatePicker from './date-picker';
import TimeSlotPicker from './time-slot-picker';
import { AvailableDate } from '@/hooks/booking/use-expert-availability';
import { ExpertSessionSettings } from '@/hooks/booking/use-expert-session-settings';

interface DateTimeStepProps {
  selectedDate: string;
  selectedTime: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  availableDates: AvailableDate[];
  availableTimeSlots: string[];
  sessionSettings: ExpertSessionSettings | null;
}

const DateTimeStep: React.FC<DateTimeStepProps> = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onNext,
  availableDates,
  availableTimeSlots,
  sessionSettings,
}) => {
  const isNextEnabled = selectedDate && selectedTime;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Choose your preferred time</h2>
        </div>
        <p className="text-gray-600 leading-relaxed">
          Select a date and time that works best for your schedule.
          {sessionSettings && (
            <span className="text-blue-600 font-medium ml-1">
              Session duration: {sessionSettings.session_duration_minutes} minutes
            </span>
          )}
        </p>
      </div>

      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Date Picker */}
        <div className="space-y-4">
          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            availableDates={availableDates}
          />
        </div>

        {/* Time Slot Picker */}
        <div className="space-y-4">
          <TimeSlotPicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onTimeSelect={onTimeSelect}
            availableTimeSlots={availableTimeSlots}
          />
        </div>
      </div>

      {/* Selection Summary */}
      {selectedDate && selectedTime && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Selected Time</h3>
              <p className="text-blue-700">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })} at {selectedTime}
                {sessionSettings && (
                  <span className="ml-2">
                    ({sessionSettings.session_duration_minutes} min • ${sessionSettings.session_price})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!isNextEnabled}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all duration-200
            ${isNextEnabled 
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isNextEnabled ? 'Continue to Details' : 'Select date and time to continue'}
        </button>
      </div>
    </div>
  );
};

export default DateTimeStep;