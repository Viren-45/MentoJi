// components/expert/dashboard/session-settings/sections/duration-pricing-section.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, DollarSign, Heart, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useDurationPricing } from "@/hooks/expert/dashboard/session-settings/use-duration-pricing";

interface DurationPricingSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

const DURATION_OPTIONS = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" }
];

const DurationPricingSection = ({ isOpen, onToggle }: DurationPricingSectionProps) => {
  const { 
    duration, 
    price, 
    isFree, 
    isLoading,
    isSaving,
    updateDuration,
    updatePrice, 
    toggleFree,
    saveSettings 
  } = useDurationPricing();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid numbers
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
      updatePrice(parseFloat(value) || 0);
    }
  };

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
              <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-64 mt-1 animate-pulse"></div>
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
          <div className="p-2 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">Session Duration & Pricing</h3>
            <p className="text-sm text-gray-500 mt-0.5">Choose your session length and set your rate</p>
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
            {/* Session Duration */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Session Duration
              </label>
              <div className="max-w-xs">
                <Select 
                  value={duration.toString()} 
                  onValueChange={(value) => updateDuration(parseInt(value))}
                  disabled={isSaving}
                >
                  <SelectTrigger className="w-full h-11 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="py-2">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Free Consultation Toggle */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-900">Free Consultation</h4>
                    <p className="text-sm text-red-700">Build reputation and help professionals starting out</p>
                  </div>
                </div>
                <Switch
                  checked={isFree}
                  onCheckedChange={toggleFree}
                  disabled={isSaving}
                  className="data-[state=checked]:bg-red-500"
                />
              </div>
            </div>

            {/* Price Input */}
            {!isFree && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Price per Session
                </label>
                <div className="relative max-w-xs">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                  </div>
                  <Input
                    type="number"
                    value={price.toString()}
                    onChange={handlePriceChange}
                    disabled={isSaving}
                    className="pl-10 pr-16 h-11 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    step="5"
                    placeholder="0"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-sm font-medium text-gray-600">USD</span>
                  </div>
                </div>
              </div>
            )}

            {/* Free Consultation Benefits */}
            {isFree && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-2">✨ Benefits of Free Consultations</h4>
                    <ul className="text-sm text-green-800 space-y-1.5">
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Build your reputation and get initial reviews</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Help professionals who are just starting out</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Create goodwill and potential future paid clients</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Stand out from other experts in your field</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
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

export default DurationPricingSection;