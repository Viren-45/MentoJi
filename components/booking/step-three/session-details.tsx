// components/booking/step-three/session-details.tsx
"use client";

import React from 'react';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { ExpertSessionSettings } from '@/hooks/booking/use-expert-session-settings';

interface SessionDetailsProps {
  selectedDate: string;
  selectedTime: string;
  sessionSettings: ExpertSessionSettings | null;
}

const SessionDetails: React.FC<SessionDetailsProps> = ({
  selectedDate,
  selectedTime,
  sessionSettings,
}) => {
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Date</p>
            <p className="text-base font-semibold text-gray-900">{formatDate(selectedDate)}</p>
          </div>
        </div>

        {/* Time & Duration */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Time & Duration</p>
            <p className="text-base font-semibold text-gray-900">
              {formatTime(selectedTime)}
              {sessionSettings && (
                <span className="text-sm text-gray-600 font-normal">
                  {' '}({sessionSettings.session_duration_minutes} min)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Price</p>
            <p className="text-base font-semibold text-gray-900">
              ${sessionSettings?.session_price || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Session Info */}
      {sessionSettings && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Session will be conducted via video call</p>
            <p>• You'll receive a calendar invite with meeting details</p>
            <p>• Cancellation allowed up to 24 hours before session</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetails;