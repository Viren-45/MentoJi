// components/expert/dashboard/payment-setup/payment-setup-layout.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
// import PaymentInfoModal from "./payment-info-modal";

interface PaymentSetupLayoutProps {
  children: React.ReactNode;
}

const PaymentSetupLayout = ({ children }: PaymentSetupLayoutProps) => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">Payment settings</h1>
          {/* <PaymentInfoModal>
            <Button 
              variant="outline" 
              size="sm"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Learn more
            </Button>
          </PaymentInfoModal> */}
        </div>
      </div>

      {/* Description */}
      <div>
        <p className="text-sm text-gray-600">
          Connect your Stripe account to receive payments from clients
        </p>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default PaymentSetupLayout;