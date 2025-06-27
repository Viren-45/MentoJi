// components/expert/dashboard/session-settings/sections/booking-rules-section.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useBookingRules } from "@/hooks/expert/dashboard/session-settings/use-booking-rules";

interface BookingRulesSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ADVANCE_BOOKING_OPTIONS = [
  { value: "1", label: "1 hour" },
  { value: "6", label: "6 hours" },
  { value: "24", label: "24 hours" },
  { value: "48", label: "48 hours" },
  { value: "168", label: "1 week" }
];

// Updated to show days instead of weeks/months to match schema
const MAX_DAYS_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "60", label: "60 days" },
  { value: "90", label: "90 days" }
];

const BUFFER_TIME_OPTIONS = [
  { value: "0", label: "No buffer" },
  { value: "5", label: "5 minutes" },
  { value: "10", label: "10 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" }
];

const BookingRulesSection = ({ isOpen, onToggle }: BookingRulesSectionProps) => {
  const {
    advanceBookingHours,
    maxBookingDaysAhead,
    bufferBefore,
    bufferAfter,
    isLoading,
    isSaving,
    updateAdvanceBooking,
    updateMaxDays,
    updateBufferBefore,
    updateBufferAfter,
    saveSettings
  } = useBookingRules();

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
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-48 mt-1 animate-pulse"></div>
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
          <div className="p-2 bg-green-50 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">Booking Rules</h3>
            <p className="text-sm text-gray-500 mt-0.5">Set timing restrictions and buffer periods for your consultations</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Advance Booking Time */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Minimum advance booking time
                </label>
                <div className="max-w-xs">
                  <Select 
                    value={advanceBookingHours.toString()} 
                    onValueChange={(value) => updateAdvanceBooking(parseInt(value))}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ADVANCE_BOOKING_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-500">How far in advance must clients book?</p>
              </div>

              {/* Maximum Days Ahead - Updated to show days */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Maximum booking window
                </label>
                <div className="max-w-xs">
                  <Select 
                    value={maxBookingDaysAhead.toString()} 
                    onValueChange={(value) => updateMaxDays(parseInt(value))}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MAX_DAYS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-500">How far ahead can clients book?</p>
              </div>

              {/* Buffer Before */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Buffer time before sessions
                </label>
                <div className="max-w-xs">
                  <Select 
                    value={bufferBefore.toString()} 
                    onValueChange={(value) => updateBufferBefore(parseInt(value))}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUFFER_TIME_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-500">Prep time before each consultation</p>
              </div>

              {/* Buffer After */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Buffer time after sessions
                </label>
                <div className="max-w-xs">
                  <Select 
                    value={bufferAfter.toString()} 
                    onValueChange={(value) => updateBufferAfter(parseInt(value))}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUFFER_TIME_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-500">Cool-down time after each consultation</p>
              </div>
            </div>

            {/* Buffer Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">💡 Buffer Time Tips</h4>
                  <p className="text-sm text-blue-800">
                    Buffer times help you prepare for sessions and avoid back-to-back scheduling. 
                    Most experts find 10-15 minutes works well for quick preparation and note-taking.
                  </p>
                </div>
              </div>
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

export default BookingRulesSection;