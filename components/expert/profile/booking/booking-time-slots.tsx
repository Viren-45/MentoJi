// components/expert/profile/booking/booking-time-slots.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, DollarSign } from 'lucide-react';
import { useExpertAvailability } from '@/hooks/booking/use-expert-availability';

interface BookingTimeSlotsProps {
  expertId: string;
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  selectedDuration: number;
  selectTimeSlot: (timeSlot: string) => void;
  selectDuration: (duration: number) => void;
  goToStep: (step: 'calendar' | 'time-slots' | 'confirmation') => void;
}

const BookingTimeSlots: React.FC<BookingTimeSlotsProps> = ({
  expertId,
  selectedDate,
  selectedTimeSlot,
  selectedDuration,
  selectTimeSlot,
  selectDuration,
  goToStep
}) => {
  const { getTimeSlotsForDate } = useExpertAvailability(expertId);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Duration options (in minutes)
  const durationOptions = [
    { minutes: 30, price: 50, label: '30 min' },
    { minutes: 45, price: 70, label: '45 min' },
    { minutes: 60, price: 90, label: '60 min' },
  ];

  // Load time slots when date or duration changes
  useEffect(() => {
    const loadTimeSlots = async () => {
      if (!selectedDate) return;

      setLoading(true);
      try {
        const slots = await getTimeSlotsForDate(selectedDate, selectedDuration);
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error loading time slots:', error);
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    loadTimeSlots();
  }, [selectedDate, selectedDuration, getTimeSlotsForDate]);

  const selectedDurationOption = durationOptions.find(option => option.minutes === selectedDuration);

  if (!selectedDate) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Please select a date first.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Selected Date */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        <button
          onClick={() => goToStep('calendar')}
          className="text-blue-600 text-sm hover:text-blue-700 transition-colors"
        >
          Change date
        </button>
      </div>

      {/* Duration Selection */}
      <div className="mb-6">
        <h4 className="text-base font-semibold text-gray-900 mb-3">
          Session Duration
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {durationOptions.map((option) => (
            <button
              key={option.minutes}
              onClick={() => selectDuration(option.minutes)}
              className={`
                p-3 rounded-lg border-2 transition-all text-center
                ${selectedDuration === option.minutes
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
              `}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{option.label}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span className="text-sm font-semibold">{option.price}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-semibold text-gray-900">
            Available Times
          </h4>
          {selectedDurationOption && (
            <div className="text-sm text-gray-600">
              ${selectedDurationOption.price} / {selectedDurationOption.label}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : availableSlots.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => selectTimeSlot(slot)}
                className={`
                  p-3 rounded-lg border-2 transition-all text-center font-medium
                  ${selectedTimeSlot === slot
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {slot}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Clock className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-gray-500">
              No available time slots for this date and duration.
            </p>
            <button
              onClick={() => goToStep('calendar')}
              className="text-blue-600 text-sm hover:text-blue-700 transition-colors mt-2"
            >
              Try a different date
            </button>
          </div>
        )}
      </div>

      {/* Selected Summary */}
      {selectedTimeSlot && selectedDurationOption && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-semibold text-blue-900 mb-2">
            Selected Session
          </h5>
          <div className="text-sm text-blue-700 space-y-1">
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{format(selectedDate, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{selectedTimeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{selectedDurationOption.label}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-blue-200">
              <span>Total:</span>
              <span>${selectedDurationOption.price}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTimeSlots;