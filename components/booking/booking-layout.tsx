// components/booking/booking-layout.tsx
"use client";

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BookingProgress from './booking-progress';
import DateTimeStep from './step-one/date-time';
import Questionnaire from './step-two/questionnaire';
import BookingSummary from './step-three/booking-summary';
import PaymentStep from './step-four/payment-step';
import { QuestionnaireAnswers } from './step-two/questionnaire';
import { useExpertAvailability } from '@/hooks/booking/use-expert-availability';

interface BookingLayoutProps {
  expertId: string;
  expertName: string;
  expertUsername: string;
  expertJobTitle: string;
  expertCompany: string;
  expertProfilePicture: string;
}

const BookingLayout: React.FC<BookingLayoutProps> = ({
  expertId,
  expertName,
  expertUsername,
  expertJobTitle,
  expertCompany,
  expertProfilePicture,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<QuestionnaireAnswers>({
    question1: '',
    question2: '',
    question3: '',
  });

  // Use the same hooks as the modal
  const { 
    availableDates, 
    loading, 
    error, 
    getTimeSlotsForDate,
    sessionSettings 
  } = useExpertAvailability(expertId);

  const handleBackToProfile = () => {
    router.push(`/expert/${expertUsername}`);
  };

  const handleDateSelect = (date: string) => {
    console.log('📅 Date selected:', date);
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    console.log('⏰ Time selected:', time);
    setSelectedTime(time);
  };

  const handleStepOneNext = () => {
    if (selectedDate && selectedTime) {
      console.log('Moving to step 2 with:', { selectedDate, selectedTime });
      setCurrentStep(2);
    }
  };

  const handleStepOneBack = () => {
    setCurrentStep(1);
  };

  const handleStepTwoBack = () => {
    setCurrentStep(2);
  };

  const handleStepThreeBack = () => {
    setCurrentStep(3);
  };

  const handleQuestionnaireSkip = () => {
    console.log('Questionnaire skipped');
    // Set empty answers when skipped
    setQuestionnaireAnswers({
      question1: '',
      question2: '',
      question3: '',
    });
    setCurrentStep(3); // Move to step 3 (review/summary)
  };

  const handleQuestionnaireNext = (answers: QuestionnaireAnswers) => {
    console.log('Questionnaire completed with answers:', answers);
    setQuestionnaireAnswers(answers);
    setCurrentStep(3); // Move to step 3 (review/summary)
  };

  const handleProceedToPayment = () => {
    console.log('Proceeding to payment step with booking data:', {
      expertId,
      expertName,
      selectedDate,
      selectedTime,
      sessionSettings,
      questionnaireAnswers,
    });
    setCurrentStep(4); // Move to step 4 (payment)
  };

  const handlePaymentSuccess = (consultationId: string) => {
    console.log('Payment successful, consultation created:', consultationId);
    
    // TODO: Navigate to confirmation page
    // router.push(`/booking/confirmation/${consultationId}`);
    alert(`Payment successful! Consultation ID: ${consultationId}\n\nWould redirect to confirmation page.`);
  };

  // Get available time slots for selected date
  const getTimeSlotsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return getTimeSlotsForDate(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading booking availability...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <p className="text-lg font-semibold">Unable to load booking availability</p>
                <p className="text-sm">{error}</p>
              </div>
              <button 
                onClick={handleBackToProfile}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={handleBackToProfile}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Expert Info */}
            <div className="flex items-center gap-4">
              <img
                src={expertProfilePicture}
                alt={expertName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Book a session with {expertName}
                </h1>
                <p className="text-sm text-gray-600">
                  {expertJobTitle} @ {expertCompany}
                  {sessionSettings && (
                    <span className="ml-2 text-blue-600">
                      • {sessionSettings.session_duration_minutes} min • ${sessionSettings.session_price}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <BookingProgress currentStep={currentStep} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Step 1: Date & Time */}
          {currentStep === 1 && (
            <DateTimeStep
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={handleDateSelect}
              onTimeSelect={handleTimeSelect}
              onNext={handleStepOneNext}
              availableDates={availableDates}
              availableTimeSlots={getTimeSlotsForSelectedDate()}
              sessionSettings={sessionSettings}
            />
          )}
          
          {/* Step 2: Questionnaire */}
          {currentStep === 2 && (
            <Questionnaire
              onSkip={handleQuestionnaireSkip}
              onNext={handleQuestionnaireNext}
              onBack={handleStepOneBack}
              expertName={expertName}
            />
          )}

          {/* Step 3: Review & Summary */}
          {currentStep === 3 && (
            <BookingSummary
              expertId={expertId}
              expertName={expertName}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              sessionSettings={sessionSettings}
              questionnaireAnswers={questionnaireAnswers}
              onBack={handleStepTwoBack}
              onConfirmAndPay={handleProceedToPayment}
            />
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <PaymentStep
              expertId={expertId}
              expertName={expertName}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              sessionSettings={sessionSettings}
              questionnaireAnswers={questionnaireAnswers}
              onBack={handleStepThreeBack}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingLayout;