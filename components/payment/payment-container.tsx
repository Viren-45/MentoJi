// components/payment/payment-container.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getConsultationById } from '@/lib/booking/consultation-service';
import { useAuth } from '@/hooks/auth/use-auth';
import BookingSummaryCard from './booking-summary-card';
import PaymentForm from './payment-form';

interface PaymentContainerProps {
  consultationId: string;
}

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

const PaymentContainer: React.FC<PaymentContainerProps> = ({ consultationId }) => {
  const [consultation, setConsultation] = useState<ConsultationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, isClient } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getConsultationById(consultationId);
        
        if (result.success && result.data) {
          setConsultation(result.data);
          
          // Validate consultation status
          if (result.data.status !== 'pending') {
            setError('This booking is no longer available for payment');
            return;
          }
          
          if (result.data.payment_status !== 'pending') {
            setError('Payment has already been processed for this booking');
            return;
          }
          
        } else {
          setError(result.error || 'Consultation not found');
        }
        
      } catch (err) {
        console.error('Error fetching consultation:', err);
        setError('Failed to load consultation details');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [consultationId]);

  // Redirect if not authenticated as client
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    if (!loading && isAuthenticated && !isClient) {
      setError('You need a client account to complete this payment');
      return;
    }
  }, [loading, isAuthenticated, isClient, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading payment details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !consultation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Success state - render payment components
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-1">
            You're almost there! Complete your payment to confirm your session.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Booking Summary */}
          <div>
            <BookingSummaryCard consultation={consultation} />
          </div>
          
          {/* Right: Payment Form */}
          <div>
            <PaymentForm 
              consultation={consultation}
              onPaymentSuccess={() => {
                // Navigate to success page or booking confirmation
                router.push(`/booking-confirmation/${consultationId}`);
              }}
              onPaymentError={(error) => {
                setError(`Payment failed: ${error}`);
              }}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PaymentContainer;