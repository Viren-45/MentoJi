// hooks/expert/dashboard/session-settings/use-booking-preferences.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/use-auth";
import {
  getBookingPreferencesByAuthUser,
  saveBookingPreferencesByAuthUser,
  type BookingPreferencesSettings,
} from "@/lib/expert/dashboard/session-settings/booking-preferences";

export const useBookingPreferences = () => {
  const { user } = useAuth();
  const authUserId = user?.id || null;

  const [settings, setSettings] = useState<BookingPreferencesSettings>({
    auto_confirm_bookings: true,
    send_booking_reminders: true,
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

      const { data, error: fetchError } = await getBookingPreferencesByAuthUser(
        authUserId
      );

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error("Error loading booking preferences:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load booking preferences"
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

      const { data, error: saveError } = await saveBookingPreferencesByAuthUser(
        authUserId,
        settings
      );

      if (saveError) {
        throw saveError;
      }

      if (data) {
        setSettings(data);
        toast.success("Booking preferences saved successfully");
        return true;
      }

      return false;
    } catch (err) {
      console.error("Error saving booking preferences:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to save booking preferences";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Helper functions
  const updateAutoConfirm = (value: boolean) => {
    setSettings((prev) => ({ ...prev, auto_confirm_bookings: value }));
  };

  const updateSendReminders = (value: boolean) => {
    setSettings((prev) => ({ ...prev, send_booking_reminders: value }));
  };

  return {
    // Current settings
    autoConfirm: settings.auto_confirm_bookings,
    sendReminders: settings.send_booking_reminders,

    // State
    isLoading,
    isSaving,
    error,

    // Actions
    updateAutoConfirm,
    updateSendReminders,
    saveSettings,

    // Raw settings for advanced use
    settings,
  };
};
