// components/booking/step-four/payment-summary.tsx
"use client";

import React from 'react';
import { Receipt } from 'lucide-react';
import { QuestionnaireAnswers } from '../step-two/questionnaire';
import { ExpertSessionSettings } from '@/hooks/booking/use-expert-session-settings';

interface PaymentSummaryProps {
  expertName: string;
  selectedDate: string;
  selectedTime: string;
  sessionSettings: ExpertSessionSettings | null;
  questionnaireAnswers: QuestionnaireAnswers;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  expertName,
  selectedDate,
  selectedTime,
  sessionSettings,
  questionnaireAnswers,
}) => {
  const sessionPrice = sessionSettings?.session_price || 0;
  const platformFeeRate = 0.10; // 10%
  const platformFee = Math.round(sessionPrice * platformFeeRate * 100) / 100;
  const totalAmount = sessionPrice + platformFee;

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 sticky top-8">
      <div className="flex items-center gap-2 mb-6">
        <Receipt className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Booking Summary</h3>
      </div>
      
      {/* Pricing Breakdown */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-4">Price Breakdown</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Session fee</span>
            <span className="text-gray-900">${sessionPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Platform fee (10%)</span>
            <span className="text-gray-900">${platformFee.toFixed(2)}</span>
          </div>
          
          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-lg text-gray-900">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">What's included</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span>1-on-1 video consultation</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span>Calendar invite with meeting link</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span>Session recording (if requested)</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span>24/7 customer support</span>
          </li>
        </ul>
      </div>

      {/* Cancellation Policy */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Cancellation:</strong> Free cancellation up to 24 hours before your session.
        </p>
      </div>
    </div>
  );
};

export default PaymentSummary;