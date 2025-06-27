// hooks/expert/dashboard/session-settings/use-booking-rules.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/use-auth";
import {
  getBookingRulesByAuthUser,
  saveBookingRulesByAuthUser,
  type BookingRulesSettings,
} from "@/lib/expert/dashboard/session-settings/booking-rules";

export const useBookingRules = () => {
  const { user } = useAuth();
  const authUserId = user?.id || null;

  const [settings, setSettings] = useState<BookingRulesSettings>({
    buffer_before_minutes: 15,
    buffer_after_minutes: 15,
    advance_booking_hours: 24,
    max_booking_days_ahead: 30,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing settings
  useEffect(() => {
    if (authUserId) {
      loadSettings();
    }
  }, [authUserId]);

  const loadSettings = async () => {
    if (!authUserId) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await getBookingRulesByAuthUser(
        authUserId
      );

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error("Error loading booking rules:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load booking rules"
      );
      // Keep default settings on error
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!authUserId) return false;

    try {
      setIsSaving(true);
      setError(null);

      const { data, error: saveError } = await saveBookingRulesByAuthUser(
        authUserId,
        settings
      );

      if (saveError) {
        throw saveError;
      }

      if (data) {
        setSettings(data);
        toast.success("Booking rules saved successfully");
        return true;
      }

      return false;
    } catch (err) {
      console.error("Error saving booking rules:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save booking rules";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Helper functions
  const updateAdvanceBooking = (hours: number) => {
    setSettings((prev) => ({ ...prev, advance_booking_hours: hours }));
  };

  const updateMaxDays = (days: number) => {
    setSettings((prev) => ({ ...prev, max_booking_days_ahead: days }));
  };

  const updateBufferBefore = (minutes: number) => {
    setSettings((prev) => ({ ...prev, buffer_before_minutes: minutes }));
  };

  const updateBufferAfter = (minutes: number) => {
    setSettings((prev) => ({ ...prev, buffer_after_minutes: minutes }));
  };

  return {
    // Current settings
    advanceBookingHours: settings.advance_booking_hours,
    maxBookingDaysAhead: settings.max_booking_days_ahead,
    bufferBefore: settings.buffer_before_minutes,
    bufferAfter: settings.buffer_after_minutes,

    // State
    isLoading,
    isSaving,
    error,

    // Actions
    updateAdvanceBooking,
    updateMaxDays,
    updateBufferBefore,
    updateBufferAfter,
    saveSettings,

    // Raw settings for advanced use
    settings,
  };
};
