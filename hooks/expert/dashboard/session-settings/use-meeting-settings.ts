// hooks/expert/dashboard/session-settings/use-meeting-settings.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/use-auth";
import {
  getMeetingSettingsByAuthUser,
  saveMeetingSettingsByAuthUser,
  type MeetingSettingsSettings,
} from "@/lib/expert/dashboard/session-settings/meeting-settings";

export const useMeetingSettings = () => {
  const { user } = useAuth();
  const authUserId = user?.id || null;

  const [settings, setSettings] = useState<MeetingSettingsSettings>({
    use_waiting_room: true,
    meeting_instructions: "",
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

      const { data, error: fetchError } = await getMeetingSettingsByAuthUser(
        authUserId
      );

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error("Error loading meeting settings:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load meeting settings"
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

      const { data, error: saveError } = await saveMeetingSettingsByAuthUser(
        authUserId,
        settings
      );

      if (saveError) {
        throw saveError;
      }

      if (data) {
        setSettings(data);
        toast.success("Meeting settings saved successfully");
        return true;
      }

      return false;
    } catch (err) {
      console.error("Error saving meeting settings:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save meeting settings";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Helper functions
  const updateWaitingRoom = (value: boolean) => {
    setSettings((prev) => ({ ...prev, use_waiting_room: value }));
  };

  const updateInstructions = (value: string) => {
    setSettings((prev) => ({ ...prev, meeting_instructions: value }));
  };

  return {
    // Current settings
    useWaitingRoom: settings.use_waiting_room,
    meetingInstructions: settings.meeting_instructions,

    // State
    isLoading,
    isSaving,
    error,

    // Actions
    updateWaitingRoom,
    updateInstructions,
    saveSettings,

    // Raw settings for advanced use
    settings,
  };
};
