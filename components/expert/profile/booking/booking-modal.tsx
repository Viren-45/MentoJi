// components/expert/profile/booking/booking-modal.tsx
"use client";

import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingCalendar from './booking-calendar';
import BookingTimeSlots from './booking-time-slots';

interface BookingModalProps {
  expertId: string;
  expertName: string;
  expertJobTitle: string;
  expertCompany: string;
  expertProfilePicture: string;
  isOpen: boolean;
  currentStep: 'calendar' | 'time-slots' | 'confirmation';
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  selectedDuration: number;
  closeModal: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: 'calendar' | 'time-slots' | 'confirmation') => void;
  selectDate: (date: Date) => void;
  selectTimeSlot: (timeSlot: string) => void;
  selectDuration: (duration: number) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  expertId,
  expertName,
  expertJobTitle,
  expertCompany,
  expertProfilePicture,
  isOpen,
  currentStep,
  selectedDate,
  selectedTimeSlot,
  selectedDuration,
  closeModal,
  goToNextStep,
  goToPreviousStep,
  goToStep,
  selectDate,
  selectTimeSlot,
  selectDuration
}) => {
  if (!isOpen) return null;

  const getStepTitle = () => {
    switch (currentStep) {
      case 'calendar':
        return 'Select a date';
      case 'time-slots':
        return 'Select a time';
      case 'confirmation':
        return 'Confirm booking';
      default:
        return 'Book a session';
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 'calendar':
        return selectedDate !== null;
      case 'time-slots':
        return selectedTimeSlot !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canGoNext()) {
      goToNextStep();
    }
  };

  const handleBack = () => {
    if (currentStep === 'calendar') {
      closeModal();
    } else {
      goToPreviousStep();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeModal}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {getStepTitle()}
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

        {/* Expert Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <img
              src={expertProfilePicture}
              alt={expertName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{expertName}</h3>
              <p className="text-sm text-gray-600">
                {expertJobTitle} @ {expertCompany}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {currentStep === 'calendar' && (
            <BookingCalendar 
              expertId={expertId}
              selectedDate={selectedDate}
              selectDate={selectDate}
            />
          )}
          
          {currentStep === 'time-slots' && (
            <BookingTimeSlots 
              expertId={expertId}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              selectedDuration={selectedDuration}
              selectTimeSlot={selectTimeSlot}
              selectDuration={selectDuration}
              goToStep={goToStep}
            />
          )}
          
          {currentStep === 'confirmation' && (
            <div className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Booking Confirmation
                </h3>
                <p className="text-gray-600">
                  Confirmation step coming soon...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            {currentStep !== 'calendar' && (
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                className="flex-1"
              >
                Back
              </Button>
            )}
            
            {currentStep !== 'confirmation' && (
              <Button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {currentStep === 'time-slots' ? 'Continue' : 'Next'}
              </Button>
            )}
            
            {currentStep === 'confirmation' && (
              <Button
                onClick={() => {
                  // Handle booking confirmation
                  console.log('Confirm booking');
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Confirm Booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;