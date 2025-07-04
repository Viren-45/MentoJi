// components/payment/payment-form.tsx
"use client";

import React, { useState } from 'react';
import { CreditCard, Lock, Shield, CheckCircle } from 'lucide-react';
import { confirmConsultationPayment } from '@/lib/booking/consultation-service';

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

interface PaymentFormProps {
  consultation: ConsultationData;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  consultation, 
  onPaymentSuccess, 
  onPaymentError 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('billing.')) {
      const billingField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [billingField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    handleInputChange('cardNumber', formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    handleInputChange('expiryDate', formatted);
  };

  const validateForm = () => {
    const { cardNumber, expiryDate, cvv, cardholderName, billingAddress } = formData;
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      return 'Please enter a valid card number';
    }
    if (!expiryDate || expiryDate.length < 5) {
      return 'Please enter a valid expiry date';
    }
    if (!cvv || cvv.length < 3) {
      return 'Please enter a valid CVV';
    }
    if (!cardholderName.trim()) {
      return 'Please enter the cardholder name';
    }
    if (!billingAddress.street.trim()) {
      return 'Please enter your billing address';
    }
    if (!billingAddress.city.trim()) {
      return 'Please enter your city';
    }
    if (!billingAddress.zipCode.trim()) {
      return 'Please enter your zip code';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      onPaymentError(validationError);
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing (replace with actual Stripe integration)
      console.log('Processing payment for consultation:', consultation.id);
      console.log('Payment details:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment - generate mock payment intent ID
      const mockPaymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Update consultation status
      const result = await confirmConsultationPayment(consultation.id, mockPaymentIntentId);
      
      if (result.success) {
        console.log('Payment confirmed successfully');
        onPaymentSuccess();
      } else {
        onPaymentError(result.error || 'Failed to confirm payment');
      }
      
    } catch (error) {
      console.error('Payment processing error:', error);
      onPaymentError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
            <p className="text-gray-600 text-sm">Secure payment processing</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Payment Method Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">Payment Method</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 p-3 border-2 rounded-lg transition-all ${
                paymentMethod === 'card' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm font-medium">Credit Card</span>
              </div>
            </button>
          </div>
        </div>

        {/* Card Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Card Information</h3>
          
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                maxLength={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={formData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Billing Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Billing Address</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address
            </label>
            <input
              type="text"
              value={formData.billingAddress.street}
              onChange={(e) => handleInputChange('billing.street', e.target.value)}
              placeholder="123 Main Street"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.billingAddress.city}
                onChange={(e) => handleInputChange('billing.city', e.target.value)}
                placeholder="New York"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={formData.billingAddress.state}
                onChange={(e) => handleInputChange('billing.state', e.target.value)}
                placeholder="NY"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                value={formData.billingAddress.zipCode}
                onChange={(e) => handleInputChange('billing.zipCode', e.target.value)}
                placeholder="10001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={formData.billingAddress.country}
                onChange={(e) => handleInputChange('billing.country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Secure Payment</p>
              <p className="text-sm text-green-600">
                Your payment information is encrypted and secure. We never store your card details.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
            isProcessing 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Complete Payment - ${consultation.price_amount}
            </>
          )}
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By completing this payment, you agree to our Terms of Service and Privacy Policy. 
          You will be charged ${consultation.price_amount} for this consultation session.
        </p>
      </form>
    </div>
  );
};

export default PaymentForm;