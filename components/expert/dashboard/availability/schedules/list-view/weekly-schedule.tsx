// components/expert/dashboard/availability/schedules/list-view/weekly-schedule.tsx
"use client";

import React, { useState } from "react";
import { RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import DayScheduleRow from "./day-schedule-row";
import CopyTimesModal from "./modals/copy-times-modal";
import TimezonePicker from "../shared/timezone-picker";
import { useAvailabilityRules } from "@/hooks/expert/dashboard/availability/use-availability-rules";
import { useAuth } from "@/hooks/auth/use-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  day: string;
  dayCode: string;
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

const WeeklySchedule = () => {
  const { user } = useAuth();
  const authUserId = user?.id || null;
  const {
    schedule,
    timezone,
    isLoading,
    error,
    setSchedule,
    setTimezone,
    saveSchedule,
    isSaving
  } = useAvailabilityRules(authUserId);

  // Copy Times Modal State
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [sourceDay, setSourceDay] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleDayScheduleChange = (index: number, updatedDay: DaySchedule) => {
    const newSchedule = [...schedule];
    newSchedule[index] = updatedDay;
    setSchedule(newSchedule);
  };

  const handleCopyTimeSlot = (timeSlot: TimeSlot, fromDay: string) => {
    setSelectedTimeSlot(timeSlot);
    setSourceDay(fromDay);
    setCopyModalOpen(true);
  };

  const handleApplyCopyTimes = (selectedDays: string[]) => {
    if (!selectedTimeSlot) return;

    const newSchedule = schedule.map(daySchedule => {
      if (selectedDays.includes(daySchedule.day)) {
        // Override the existing time slot with the copied one
        const newTimeSlot: TimeSlot = {
          id: `${daySchedule.day}-1`,
          startTime: selectedTimeSlot.startTime,
          endTime: selectedTimeSlot.endTime
        };

        return {
          ...daySchedule,
          isAvailable: true,
          timeSlots: [newTimeSlot] // Replace existing time slots with just this one
        };
      }
      return daySchedule;
    });

    setSchedule(newSchedule);
    setCopyModalOpen(false);
    setSelectedTimeSlot(null);
    setSourceDay("");
  };

  const getAvailableDays = () => {
    return schedule.filter(day => day.isAvailable).map(day => day.day);
  };

  const handleSave = async () => {
    setSaveSuccess(false);
    const success = await saveSchedule();
    if (success) {
      setSaveSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleCancel = () => {
    // Reset to original data by reloading from backend
    window.location.reload(); // Simple approach, or implement proper reset
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading schedule...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {saveSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Schedule saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Weekly Hours Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <RotateCcw className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-900">Weekly hours</h3>
        </div>
        <p className="text-xs text-gray-500">
          Set when you are typically available for consultations
        </p>
      </div>

      {/* Schedule List */}
      <div className="space-y-1">
        {schedule.map((daySchedule, index) => (
          <DayScheduleRow
            key={daySchedule.day}
            daySchedule={daySchedule}
            onChange={(updatedDay) => handleDayScheduleChange(index, updatedDay)}
            onCopyTimeSlot={handleCopyTimeSlot}
          />
        ))}
      </div>

      {/* Timezone Selector */}
      <div className="pt-4 border-t border-gray-200">
        <TimezonePicker
          value={timezone}
          onChange={setTimezone}
          contentClassName="w-80"
        />
      </div>

      {/* Save Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button 
          onClick={handleCancel}
          disabled={isSaving}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSaving && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isSaving ? "Saving..." : "Save changes"}</span>
        </button>
      </div>

      {/* Copy Times Modal */}
      <CopyTimesModal
        isOpen={copyModalOpen}
        onClose={() => {
          setCopyModalOpen(false);
          setSelectedTimeSlot(null);
          setSourceDay("");
        }}
        onApply={handleApplyCopyTimes}
        timeSlot={selectedTimeSlot}
        currentDay={sourceDay}
        availableDays={getAvailableDays()}
      />
    </div>
  );
};

export default WeeklySchedule;