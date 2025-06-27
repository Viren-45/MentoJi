// components/expert/dashboard/connected-calendars/calendar-info-modal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CalendarInfoModalProps {
  children: React.ReactNode;
}

const CalendarInfoModal = ({ children }: CalendarInfoModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            How calendar integration works
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Main explanation */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  Prevent double-booking
                </h3>
                <p className="text-gray-600 text-sm">
                  We check your connected calendars for existing events to prevent double-booking. 
                  When you have a meeting already scheduled, clients won't be able to book that time slot.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  Automatic event creation
                </h3>
                <p className="text-gray-600 text-sm">
                  When clients book consultations, we automatically create events in your calendar 
                  with all the meeting details and client information.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  Privacy and security
                </h3>
                <p className="text-gray-600 text-sm">
                  Your calendar data is encrypted and secure. We only access availability information 
                  and never read the content of your personal events.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits section */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Benefits of connecting your calendar:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Real-time availability sync across all your devices</li>
              <li>• Automatic meeting reminders and notifications</li>
              <li>• Seamless integration with your existing workflow</li>
              <li>• Professional client experience with instant booking confirmations</li>
            </ul>
          </div>

          {/* Technical details */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Technical details:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• We use secure OAuth 2.0 authentication</p>
              <p>• Calendar data is synced in real-time</p>
              <p>• You can disconnect your calendar at any time</p>
              <p>• All data transmission is encrypted using TLS 1.3</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarInfoModal;