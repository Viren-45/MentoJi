// components/expert/profile/booking/booking-modal.tsx
"use client";

import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingCalendar from './booking-calendar';
import { BookingModalProps } from './types/booking-types';

const BookingModal: React.FC<BookingModalProps> = ({
  expertId,
  expertName,
  isOpen,
  selectedDate,
  selectedTimeSlot,
  closeModal,
  selectDate,
  selectTimeSlot,
}) => {
  if (!isOpen) return null;

  const canConfirm = selectedDate && selectedTimeSlot;

  const handleConfirmBooking = () => {
    if (canConfirm) {
      console.log('Confirm booking:', {
        expertId,
        selectedDate,
        selectedTimeSlot,
      });
      
      // TODO: Implement actual booking logic
      // - Create consultation record
      // - Send confirmation email
      // - Redirect to confirmation page
      
      closeModal();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={closeModal}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Select a date
            </h2>
            <p className="text-sm text-gray-600">
              with {expertName}
            </p>
          </div>
        </div>
        
        <button
          onClick={closeModal}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Calendar Content */}
      <div className="max-h-[70vh] overflow-y-auto">
        <BookingCalendar
          expertId={expertId}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onSelectDate={selectDate}
          onSelectTimeSlot={selectTimeSlot}
        />
      </div>

      {/* Footer - Only show when both date and time are selected */}
      {canConfirm && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={handleConfirmBooking}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Confirm Booking
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingModal;