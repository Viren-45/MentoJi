// components/booking/step-four/payment-status.tsx
"use client";

import React from 'react';
import { CheckCircle2, XCircle, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';

interface PaymentStatusProps {
  state: 'processing' | 'success' | 'error';
  expertName: string;
  amount: number;
  errorMessage?: string;
  onRetry: () => void;
  onBack: () => void;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
  state,
  expertName,
  amount,
  errorMessage,
  onRetry,
  onBack,
}) => {
  if (state === 'processing') {
    return (
      <div className="p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Processing your payment</h2>
          <p className="text-gray-600 mb-6">
            Please wait while we process your payment of ${amount.toFixed(2)} for your session with {expertName}.
          </p>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Please don't close this window</strong> - We're securely processing your payment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Payment successful!</h2>
          <p className="text-gray-600 mb-6">
            Your session with <strong>{expertName}</strong> has been confirmed. 
            You'll receive a calendar invite shortly.
          </p>
          
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>What's next?</strong> Check your email for booking confirmation and meeting details.
            </p>
          </div>
          
          <div className="mt-4">
            <div className="animate-pulse text-sm text-gray-500">
              Redirecting to confirmation page...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Payment failed</h2>
          <p className="text-gray-600 mb-2">
            We couldn't process your payment for the session with {expertName}.
          </p>
          
          {errorMessage && (
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={onRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
            
            <button
              onClick={onBack}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to review
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Need help? Contact our support team</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentStatus;