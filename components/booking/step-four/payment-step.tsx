// components/booking/step-four/payment-step.tsx
"use client";

import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowLeft, CreditCard, Shield } from 'lucide-react';
import StripePaymentForm from './stripe-payment-form';
import PaymentSummary from './payment-summary';
import PaymentStatus from './payment-status';
import { QuestionnaireAnswers } from '../step-two/questionnaire';
import { ExpertSessionSettings } from '@/hooks/booking/use-expert-session-settings';
import { useAuth } from '@/hooks/auth/use-auth';

// Load Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentStepProps {
  expertId: string;
  expertName: string;
  selectedDate: string;
  selectedTime: string;
  sessionSettings: ExpertSessionSettings | null;
  questionnaireAnswers: QuestionnaireAnswers;
  onBack: () => void;
  onPaymentSuccess: (consultationId: string) => void;
}

type PaymentState = 'form' | 'processing' | 'success' | 'error';

const PaymentStep: React.FC<PaymentStepProps> = ({
  expertId,
  expertName,
  selectedDate,
  selectedTime,
  sessionSettings,
  questionnaireAnswers,
  onBack,
  onPaymentSuccess,
}) => {
  const { user, isLoading, isAuthenticated, isClient } = useAuth();
  const [paymentState, setPaymentState] = useState<PaymentState>('form');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Calculate total amount including platform fee
  const sessionPrice = sessionSettings?.session_price || 0;
  const platformFeeRate = 0.10; // 10%
  const platformFee = Math.round(sessionPrice * platformFeeRate * 100) / 100;
  const totalAmount = sessionPrice + platformFee;

  // Debug logging
  console.log('🔍 Auth Debug in Payment Step:', {
    user: user,
    userId: user?.id,
    isLoading,
    isAuthenticated,
    isClient,
    userType: user?.user_type
  });

  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      setPaymentState('processing');
      setErrorMessage('');

      // Enhanced debugging
      console.log('🔍 Payment Submit Debug:', {
        user: user,
        userId: user?.id,
        isLoading,
        isAuthenticated,
        isClient,
        userType: user?.user_type,
        hasUser: !!user,
        userObject: JSON.stringify(user, null, 2)
      });

      // Check if auth is still loading
      if (isLoading) {
        throw new Error('Authentication still loading. Please wait and try again.');
      }

      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        throw new Error('You must be logged in to make a payment. Please sign in and try again.');
      }

      // Check if user has an ID
      if (!user.id) {
        console.error('❌ User object missing ID:', user);
        throw new Error('Invalid user session. Please sign out and sign in again.');
      }

      // Check if user is a client
      if (!isClient) {
        throw new Error('Only clients can book sessions. Please sign in with a client account.');
      }

      console.log('🚀 Starting payment process...', {
        paymentMethodId: paymentData.paymentMethodId,
        customerData: paymentData.customerData,
        expertId,
        selectedDate,
        selectedTime,
        sessionPrice,
        totalAmount,
        clientId: user.id,
      });

      // Step 1: Create payment intent
      console.log('📝 Step 1: Creating payment intent...');
      const createIntentResponse = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expertId,
          clientId: user.id,
          selectedDate,
          selectedTime,
          duration: sessionSettings?.session_duration_minutes || 30,
          sessionPrice: sessionPrice,
          platformFeeRate: platformFeeRate,
          questionnaire: questionnaireAnswers,
          customerEmail: paymentData.customerData.email,
          customerName: paymentData.customerData.fullName,
        }),
      });

      if (!createIntentResponse.ok) {
        throw new Error(`Server error: ${createIntentResponse.status}`);
      }

      const createIntentResult = await createIntentResponse.json();

      if (!createIntentResult.success) {
        throw new Error(createIntentResult.error || 'Failed to create payment intent');
      }

      console.log('✅ Payment intent created:', createIntentResult.data.paymentIntentId);

      // Step 2: Confirm payment with Stripe
      console.log('💳 Step 2: Confirming payment with Stripe...');
      const confirmResponse = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: createIntentResult.data.paymentIntentId,
          paymentMethodId: paymentData.paymentMethodId,
          consultationId: createIntentResult.data.consultationId,
        }),
      });

      if (!confirmResponse.ok) {
        throw new Error(`Server error: ${confirmResponse.status}`);
      }

      const confirmResult = await confirmResponse.json();

      if (!confirmResult.success) {
        if (confirmResult.criticalError) {
          // Payment succeeded but booking failed - this needs manual intervention
          console.error('🚨 CRITICAL ERROR:', confirmResult);
          setErrorMessage(
            'Payment was processed but there was an issue confirming your booking. ' +
            'Please contact support immediately with this reference: ' +
            confirmResult.paymentIntentId
          );
        } else {
          throw new Error(confirmResult.error || 'Payment confirmation failed');
        }
        setPaymentState('error');
        return;
      }

      console.log('🎉 Payment and booking confirmed successfully!', {
        consultationId: confirmResult.data.consultationId,
        meetingUrl: confirmResult.data.meetingUrl,
        status: confirmResult.data.status,
      });

      // Show success state briefly
      setPaymentState('success');
      
      // Then trigger callback to redirect to confirmation page
      setTimeout(() => {
        onPaymentSuccess(confirmResult.data.consultationId);
      }, 2000);

    } catch (error) {
      console.error('❌ Payment error:', error);
      setPaymentState('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Payment failed. Please try again.'
      );
    }
  };

  const handleRetry = () => {
    setPaymentState('form');
    setErrorMessage('');
  };

  // Show loading state if auth is still loading
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading user session...</span>
        </div>
      </div>
    );
  }

  // Show auth error if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-6">You must be signed in to complete your booking.</p>
          <button
            onClick={() => window.location.href = '/auth/sign-in'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Show error if user is not a client
  if (!isClient) {
    return (
      <div className="p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Client Account Required</h3>
          <p className="text-gray-600 mb-6">You need a client account to book sessions.</p>
          <button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show payment status for processing, success, or error states
  if (paymentState !== 'form') {
    return (
      <PaymentStatus
        state={paymentState}
        expertName={expertName}
        amount={totalAmount}
        errorMessage={errorMessage}
        onRetry={handleRetry}
        onBack={onBack}
      />
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
            <CreditCard className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Complete your booking</h2>
          </div>
        </div>
        <p className="text-gray-600 leading-relaxed ml-11">
          Enter your payment details to confirm your session with {expertName}.
        </p>
        
        {/* Debug info for development */}
        <div className="ml-11 mt-2 text-sm text-gray-500">
          Logged in as: {user?.first_name} {user?.last_name} ({user?.user_type})
        </div>
      </div>

      {/* Payment Content with Stripe Provider */}
      <Elements stripe={stripePromise}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Payment Form */}
          <div className="order-2 lg:order-1">
            <StripePaymentForm
              amount={totalAmount}
              onSubmit={handlePaymentSubmit}
            />
          </div>

          {/* Right: Payment Summary */}
          <div className="order-1 lg:order-2">
            <PaymentSummary
              expertName={expertName}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              sessionSettings={sessionSettings}
              questionnaireAnswers={questionnaireAnswers}
            />
          </div>
        </div>
      </Elements>

      {/* Security Notice */}
      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
        <Shield className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </div>
  );
};

export default PaymentStep;