// components/expert/dashboard/session-settings/sections/booking-preferences-section.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, Calendar, Bell, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useBookingPreferences } from "@/hooks/expert/dashboard/session-settings/use-booking-preferences";

interface BookingPreferencesSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

const BookingPreferencesSection = ({ isOpen, onToggle }: BookingPreferencesSectionProps) => {
  const {
    autoConfirm,
    sendReminders,
    isLoading,
    isSaving,
    updateAutoConfirm,
    updateSendReminders,
    saveSettings
  } = useBookingPreferences();

  const handleSave = async () => {
    await saveSettings();
  };

  // Show loading skeleton while initial data loads
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg animate-pulse">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
            </div>
            <div className="text-left">
              <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-56 mt-1 animate-pulse"></div>
            </div>
          </div>
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">Booking Preferences</h3>
            <p className="text-sm text-gray-500 mt-0.5">Configure how bookings are handled and confirmed</p>
          </div>
        </div>
        <div className="flex items-center text-gray-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="border-t border-gray-100">
          <div className="p-6 space-y-6 max-w-2xl">
            {/* Auto-confirm bookings */}
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="flex items-start space-x-3 flex-1">
                <div className="p-1.5 bg-green-50 rounded-lg mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Auto-confirm bookings</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Automatically confirm bookings without manual approval. Recommended for faster booking experience.
                  </p>
                </div>
              </div>
              <Switch 
                checked={autoConfirm} 
                onCheckedChange={updateAutoConfirm}
                disabled={isSaving}
                className="data-[state=checked]:bg-blue-600 ml-4 flex-shrink-0"
              />
            </div>

            {/* Send reminders */}
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="flex items-start space-x-3 flex-1">
                <div className="p-1.5 bg-orange-50 rounded-lg mt-0.5">
                  <Bell className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Send booking reminders</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Automatically send email reminders to clients 24 hours and 1 hour before their consultation.
                  </p>
                </div>
              </div>
              <Switch 
                checked={sendReminders} 
                onCheckedChange={updateSendReminders}
                disabled={isSaving}
                className="data-[state=checked]:bg-blue-600 ml-4 flex-shrink-0"
              />
            </div>

            {/* Allow same-day bookings - Coming Soon */}
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg opacity-60">
              <div className="flex items-start space-x-3 flex-1">
                <div className="p-1.5 bg-gray-50 rounded-lg mt-0.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Allow same-day bookings <span className="text-xs text-gray-400">(Coming Soon)</span></h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Override minimum advance booking time for urgent consultations. You'll still get notifications.
                  </p>
                </div>
              </div>
              <Switch 
                checked={false} 
                disabled={true}
                className="ml-4 flex-shrink-0 opacity-50"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex justify-start">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 min-w-[120px]"
            >
              {isSaving ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPreferencesSection;