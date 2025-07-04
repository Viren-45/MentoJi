// components/booking/booking-progress.tsx
"use client";

import React from 'react';
import { Check } from 'lucide-react';

interface BookingProgressProps {
  currentStep: number;
}

const BookingProgress: React.FC<BookingProgressProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Date & Time', description: 'Choose your preferred slot' },
    { number: 2, title: 'Details', description: 'Share your challenge' },
    { number: 3, title: 'Review', description: 'Confirm your booking' },
    { number: 4, title: 'Payment', description: 'Complete your session' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200
                  ${currentStep > step.number
                    ? 'bg-green-600 text-white'
                    : currentStep === step.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              
              {/* Step Info */}
              <div className="mt-2 text-center">
                <div
                  className={`
                    text-sm font-medium
                    ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}
                  `}
                >
                  {step.title}
                </div>
                <div
                  className={`
                    text-xs mt-1
                    ${currentStep >= step.number ? 'text-gray-600' : 'text-gray-400'}
                  `}
                >
                  {step.description}
                </div>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-px mx-4 mt-5">
                <div
                  className={`
                    h-full transition-all duration-200
                    ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'}
                  `}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BookingProgress;