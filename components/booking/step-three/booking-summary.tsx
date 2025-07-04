// components/booking/step-three/booking-summary.tsx
"use client";

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, CreditCard } from 'lucide-react';
import SessionDetails from './session-details';
import QuestionnaireSummary from './questionnaire-summary';
import { QuestionnaireAnswers } from '../step-two/questionnaire';
import { ExpertSessionSettings } from '@/hooks/booking/use-expert-session-settings';

interface BookingSummaryProps {
  expertId: string;
  expertName: string;
  selectedDate: string;
  selectedTime: string;
  sessionSettings: ExpertSessionSettings | null;
  questionnaireAnswers: QuestionnaireAnswers;
  onBack: () => void;
  onConfirmAndPay: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  expertId,
  expertName,
  selectedDate,
  selectedTime,
  sessionSettings,
  questionnaireAnswers,
  onBack,
  onConfirmAndPay,
}) => {
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmAndPay = async () => {
    try {
      setIsCreatingBooking(true);
      setError(null);

      console.log('Creating consultation with data:', {
        expertId,
        selectedDate,
        selectedTime,
        duration: sessionSettings?.session_duration_minutes,
        price: sessionSettings?.session_price,
        questionnaire: questionnaireAnswers,
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // TODO: Replace with actual consultation creation
      // const result = await createConsultation({...});
      
      onConfirmAndPay();
    } catch (error) {
      console.error('Error in handleConfirmAndPay:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsCreatingBooking(false);
    }
  };

  // Validation - if missing required data, show error
  if (!selectedDate || !selectedTime) {
    return (
      <div className="p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Missing booking details</h3>
          <p className="text-gray-600 mb-6">Please go back and select a date and time for your session.</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Review your booking</h2>
          </div>
        </div>
        <p className="text-gray-600 leading-relaxed ml-11">
          Please review your session details before proceeding to payment.
        </p>
      </div>

      {/* Summary Content */}
      <div className="space-y-6 mb-8">
        {/* Expert Info */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Session with</h3>
          <p className="text-xl font-bold text-blue-700">{expertName}</p>
        </div>

        {/* Session Details */}
        <SessionDetails
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          sessionSettings={sessionSettings}
        />

        {/* Questionnaire Summary */}
        <QuestionnaireSummary
          questionnaireAnswers={questionnaireAnswers}
          expertName={expertName}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={isCreatingBooking}
          className="flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back to edit
        </button>
        
        <button
          onClick={handleConfirmAndPay}
          disabled={isCreatingBooking}
          className={`
            flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2
            ${isCreatingBooking 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            } text-white
          `}
        >
          {isCreatingBooking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creating booking...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Confirm & Pay ${sessionSettings?.session_price || 0}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;