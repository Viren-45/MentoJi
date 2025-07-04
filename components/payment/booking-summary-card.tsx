// components/payment/booking-summary-card.tsx
"use client";

import React from 'react';
import { Calendar, Clock, DollarSign, User, MessageSquare, MapPin } from 'lucide-react';

interface ConsultationData {
  id: string;
  expert_id: string;
  client_id: string | null;
  consultation_datetime: string;
  end_datetime: string;
  duration_minutes: number;
  price_amount: number;
  client_questionnaire: any;
  status: string;
  payment_status: string;
  experts?: {
    first_name: string;
    last_name: string;
    job_title: string;
    company: string;
    profile_picture_url: string;
  };
}

interface BookingSummaryCardProps {
  consultation: ConsultationData;
}

const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({ consultation }) => {
  const expert = consultation.experts;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Check if questionnaire has answers
  const questionnaire = consultation.client_questionnaire || {};
  const hasQuestionnaireAnswers = Object.values(questionnaire).some(
    (answer: any) => answer && String(answer).trim().length > 0
  );

  const answeredQuestions = [
    { 
      label: "What specific challenge or question would you like to discuss?", 
      answer: questionnaire.question1 
    },
    { 
      label: "What context or background information should the expert know?", 
      answer: questionnaire.question2 
    },
    { 
      label: "What outcome or advice are you hoping to get from this session?", 
      answer: questionnaire.question3 
    },
  ].filter(q => q.answer && String(q.answer).trim().length > 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-50 border-b border-blue-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Summary</h2>
        <p className="text-gray-600">Review your session details</p>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Expert Info */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-4">
            {expert?.profile_picture_url && (
              <img 
                src={expert.profile_picture_url} 
                alt={`${expert.first_name} ${expert.last_name}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Session with</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {expert ? `${expert.first_name} ${expert.last_name}` : 'Expert'}
              </h3>
              {expert && (
                <p className="text-sm text-gray-600">
                  {expert.job_title} @ {expert.company}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Session Details */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Session Details</h4>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Date */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Date</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatDate(consultation.consultation_datetime)}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Time</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatTime(consultation.consultation_datetime)} - {formatTime(consultation.end_datetime)}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Duration</p>
                <p className="text-base font-semibold text-gray-900">
                  {consultation.duration_minutes} minutes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-green-700">
                  ${consultation.price_amount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Questionnaire Answers */}
        {hasQuestionnaireAnswers ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-600" />
              <h4 className="text-lg font-semibold text-gray-900">Your Preparation Notes</h4>
            </div>
            
            <div className="space-y-3">
              {answeredQuestions.map((question, index) => (
                <div key={index} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-amber-800 mb-2">
                    {question.label}
                  </p>
                  <p className="text-gray-800 leading-relaxed">
                    {question.answer}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="bg-amber-100 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> These details will be shared with {expert?.first_name || 'your expert'} before your session to help them prepare.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">
              No preparation notes provided
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingSummaryCard;