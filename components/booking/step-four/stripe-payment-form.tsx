// components/booking/step-four/stripe-payment-form.tsx
"use client";

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock, Mail, User, AlertCircle } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  onSubmit: (paymentData: any) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  onSubmit,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [customerData, setCustomerData] = useState({
    email: '',
    fullName: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cardError, setCardError] = useState<string>('');

  const handleInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCardChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerData.email) newErrors.email = 'Email is required';
    if (!customerData.fullName) newErrors.fullName = 'Full name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setCardError('Stripe has not loaded yet. Please try again.');
      return;
    }

    if (!validateForm()) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setCardError('Card element not found. Please refresh and try again.');
      return;
    }

    setIsProcessing(true);
    setCardError('');

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: customerData.fullName,
          email: customerData.email,
        },
      });

      if (paymentMethodError) {
        setCardError(paymentMethodError.message || 'An error occurred');
        setIsProcessing(false);
        return;
      }

      // TODO: Create payment intent on your backend
      // const { client_secret } = await createPaymentIntent(amount, paymentMethod.id);

      // For now, simulate the payment process
      const paymentData = {
        paymentMethodId: paymentMethod.id,
        customerData,
        amount,
        currency: 'USD',
      };

      await onSubmit(paymentData);

    } catch (error) {
      console.error('Payment error:', error);
      setCardError('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Stripe Elements styling
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#374151',
        fontFamily: '"Inter", "system-ui", "sans-serif"',
        '::placeholder': {
          color: '#9CA3AF',
        },
        iconColor: '#6B7280',
      },
      invalid: {
        color: '#EF4444',
        iconColor: '#EF4444',
      },
    },
    hidePostalCode: false,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={customerData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
              disabled={isProcessing}
            />
          </div>
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={customerData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.fullName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="John Doe"
              disabled={isProcessing}
            />
          </div>
          {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* Stripe Card Element */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className={`w-full px-4 py-3 border rounded-lg transition-colors ${
            cardError ? 'border-red-300' : 'border-gray-300 focus-within:border-blue-500'
          }`}>
            <CardElement
              options={cardElementOptions}
              onChange={handleCardChange}
            />
          </div>
          {cardError && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{cardError}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            !stripe || isProcessing
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
          } text-white`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing payment...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay ${amount.toFixed(2)}
            </>
          )}
        </button>
      </form>

      {/* Security Info */}
      <div className="mt-4 space-y-2">
        <div className="text-center text-xs text-gray-500">
          Your payment is secured with 256-bit SSL encryption
        </div>
        <div className="text-center text-xs text-gray-400">
          Powered by Stripe
        </div>
      </div>
    </div>
  );
};

export default StripePaymentForm;