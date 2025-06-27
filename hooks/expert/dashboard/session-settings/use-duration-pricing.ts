// hooks/expert/dashboard/session-settings/use-session-settings.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/use-auth";
import {
  getDurationPricingByAuthUser,
  saveDurationPricingByAuthUser,
  type DurationPricing,
} from "@/lib/expert/dashboard/session-settings/duration-pricing";

export const useDurationPricing = () => {
  const { user } = useAuth();
  const authUserId = user?.id || null;

  const [settings, setSettings] = useState<DurationPricing>({
    session_duration_minutes: 15, // Default values
    session_price: 30.0,
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

      const { data, error: fetchError } = await getDurationPricingByAuthUser(
        authUserId
      );

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error("Error loading session settings:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load session settings"
      );
      // Keep default settings on error
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings?: DurationPricing) => {
    if (!authUserId) return false;

    const settingsToSave = newSettings || settings;

    try {
      setIsSaving(true);
      setError(null);

      const { data, error: saveError } = await saveDurationPricingByAuthUser(
        authUserId,
        settingsToSave
      );

      if (saveError) {
        throw saveError;
      }

      if (data) {
        setSettings(data);
        toast.success("Session settings saved successfully");
        return true;
      }

      return false;
    } catch (err) {
      console.error("Error saving session settings:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save session settings";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Helper functions for your component
  const updateDuration = (duration: number) => {
    setSettings((prev) => ({ ...prev, session_duration_minutes: duration }));
  };

  const updatePrice = (price: number) => {
    setSettings((prev) => ({ ...prev, session_price: price }));
  };

  const toggleFree = (isFree: boolean) => {
    setSettings((prev) => ({
      ...prev,
      session_price: isFree ? 0 : 30.0, // Use default of $30 when toggling back to paid
    }));
  };

  return {
    // Current settings
    duration: settings.session_duration_minutes,
    price: settings.session_price,
    isFree: settings.session_price === 0,

    // State
    isLoading,
    isSaving,
    error,

    // Actions
    updateDuration,
    updatePrice,
    toggleFree,
    saveSettings: () => saveSettings(),
    loadSettings,

    // Raw settings for advanced use
    settings,
  };
};
