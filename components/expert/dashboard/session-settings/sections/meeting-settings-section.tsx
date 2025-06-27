// components/expert/dashboard/session-settings/sections/meeting-settings-section.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Video, Users, Mic, FileText, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useMeetingSettings } from "@/hooks/expert/dashboard/session-settings/use-meeting-settings";

interface MeetingSettingsSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MeetingSettingsSection = ({ isOpen, onToggle }: MeetingSettingsSectionProps) => {
  const {
    useWaitingRoom,
    meetingInstructions,
    isLoading,
    isSaving,
    updateWaitingRoom,
    updateInstructions,
    saveSettings
  } = useMeetingSettings();

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
              <div className="h-5 bg-gray-200 rounded w-36 animate-pulse"></div>
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
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Video className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">Meeting Settings</h3>
            <p className="text-sm text-gray-500 mt-0.5">Configure how you'll conduct your consultations</p>
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
            {/* Auto-record sessions - Coming Soon */}
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg opacity-60">
              <div className="flex items-start space-x-3 flex-1">
                <div className="p-1.5 bg-gray-50 rounded-lg mt-0.5">
                  <Mic className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Auto-record sessions <span className="text-xs text-gray-400">(Coming Soon)</span></h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Automatically record all consultations for transcription and future AI-powered features.
                  </p>
                </div>
              </div>
              <Switch 
                checked={false} 
                disabled={true}
                className="ml-4 flex-shrink-0 opacity-50"
              />
            </div>

            {/* Generate AI Summary - Coming Soon */}
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg opacity-60">
              <div className="flex items-start space-x-3 flex-1">
                <div className="p-1.5 bg-gray-50 rounded-lg mt-0.5">
                  <FileText className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Generate AI summary <span className="text-xs text-gray-400">(Coming Soon)</span></h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Create automatic summaries with key points, action items, and insights after each session.
                  </p>
                </div>
              </div>
              <Switch 
                checked={false} 
                disabled={true}
                className="ml-4 flex-shrink-0 opacity-50"
              />
            </div>

            {/* Use waiting room */}
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="flex items-start space-x-3 flex-1">
                <div className="p-1.5 bg-blue-50 rounded-lg mt-0.5">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Use waiting room</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Clients wait in a waiting room until you join the session. Helps you prepare and join on time.
                  </p>
                </div>
              </div>
              <Switch 
                checked={useWaitingRoom} 
                onCheckedChange={updateWaitingRoom}
                disabled={isSaving}
                className="data-[state=checked]:bg-blue-600 ml-4 flex-shrink-0"
              />
            </div>

            {/* Meeting Instructions */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Meeting instructions for clients
              </label>
              <Textarea
                value={meetingInstructions}
                onChange={(e) => updateInstructions(e.target.value)}
                disabled={isSaving}
                placeholder="Any special instructions for clients before the session..."
                rows={3}
                className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">
                These instructions will be included in booking confirmations
              </p>
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

export default MeetingSettingsSection;