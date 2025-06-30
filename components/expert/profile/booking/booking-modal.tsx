// components/expert/profile/booking/booking-modal.tsx
"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import DatePicker from './date-picker';
import TimeSlotPicker from './time-slot-picker';
import { useExpertAvailability } from '@/hooks/booking/use-expert-availability';

interface BookingModalProps {
  expertId: string;
  expertName: string;
  isOpen: boolean;
  closeModal: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  expertId,
  expertName,
  isOpen,
  closeModal,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Use the real hooks to get expert availability
  const { 
    availableDates, 
    loading, 
    error, 
    getTimeSlotsForDate,
    sessionSettings 
  } = useExpertAvailability(expertId);

  const handleDateSelect = (date: string) => {
    console.log('📅 Date selected:', date);
    setSelectedDate(date);
    // Reset time when date changes
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    console.log('⏰ Time selected:', time);
    setSelectedTime(time);
  };

  const handleNext = () => {
    // For now, just close the modal
    // Later this will navigate to payment/confirmation
    console.log('Booking details:', {
      expertId,
      expertName,
      selectedDate,
      selectedTime,
      sessionSettings,
    });
    closeModal();
  };

  // Get available time slots for selected date
  const getTimeSlotsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    // Parse the date string as a local date to avoid timezone conversion
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    
    console.log('🔍 Getting time slots for:', {
      selectedDate,
      parsedDate: date,
      dateComponents: { year, month, day }
    });
    
    return getTimeSlotsForDate(date);
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[600px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Book a session with {expertName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Loading availability...
              </p>
            </div>
            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[600px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Book a session with {expertName}
              </h2>
              <p className="text-sm text-red-600 mt-1">
                {error}
              </p>
            </div>
            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Unable to load booking availability</p>
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Book a session with {expertName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Choose your preferred date and time
              {sessionSettings && (
                <span className="ml-2 text-blue-600">
                  ({sessionSettings.session_duration_minutes} min · ${sessionSettings.session_price})
                </span>
              )}
            </p>
          </div>
          
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            
            {/* Left: Date Selection */}
            <div className="overflow-hidden">
              <DatePicker
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                availableDates={availableDates}
              />
            </div>
            
            {/* Right: Time Selection */}
            <div className="overflow-hidden">
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onTimeSelect={handleTimeSelect}
                onNext={handleNext}
                availableTimeSlots={getTimeSlotsForSelectedDate()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;