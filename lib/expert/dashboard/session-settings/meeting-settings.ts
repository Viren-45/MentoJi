// lib/expert/dashboard/session-settings/meeting-settings.ts
import supabase from "@/lib/supabase/supabase-client";
import { MeetingSettingsSchema } from "@/lib/validations/expert/dashboard/session-settings";

export interface MeetingSettingsSettings {
  use_waiting_room: boolean;
  meeting_instructions: string;
}

// Get expert ID from auth user ID (reuse logic)
export async function getExpertIdFromAuthUser(authUserId: string) {
  try {
    const { data, error } = await supabase
      .from("experts")
      .select("id")
      .eq("auth_user_id", authUserId)
      .eq("status", "approved")
      .single();

    if (error) throw error;
    return { expertId: data?.id || null, error: null };
  } catch (error) {
    console.error("Error getting expert ID:", error);
    return { expertId: null, error: error as Error };
  }
}

// Get meeting settings for an expert by auth user ID
export async function getMeetingSettingsByAuthUser(authUserId: string) {
  try {
    // First get expert ID
    const { expertId, error: expertError } = await getExpertIdFromAuthUser(
      authUserId
    );
    if (expertError || !expertId) {
      throw expertError || new Error("Expert not found");
    }

    // Get meeting settings
    const { data, error } = await supabase
      .from("expert_session_settings")
      .select("use_waiting_room, meeting_instructions")
      .eq("expert_id", expertId)
      .single();

    if (error) {
      // If no settings exist yet, return defaults
      if (error.code === "PGRST116") {
        return {
          data: {
            use_waiting_room: true,
            meeting_instructions: "",
          },
          error: null,
        };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching meeting settings:", error);
    return { data: null, error: error as Error };
  }
}

// Save meeting settings for an expert by auth user ID
export async function saveMeetingSettingsByAuthUser(
  authUserId: string,
  settings: MeetingSettingsSettings
) {
  try {
    // Validate the settings
    const validatedSettings = MeetingSettingsSchema.parse(settings);

    // First get expert ID
    const { expertId, error: expertError } = await getExpertIdFromAuthUser(
      authUserId
    );
    if (expertError || !expertId) {
      throw expertError || new Error("Expert not found");
    }

    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from("expert_session_settings")
      .select("id")
      .eq("expert_id", expertId)
      .single();

    let savedSettings;

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from("expert_session_settings")
        .update({
          use_waiting_room: validatedSettings.use_waiting_room,
          meeting_instructions: validatedSettings.meeting_instructions,
          updated_at: new Date().toISOString(),
        })
        .eq("expert_id", expertId)
        .select("use_waiting_room, meeting_instructions")
        .single();

      if (error) throw error;
      savedSettings = data;
    } else {
      // Create new settings with defaults for other required fields
      const { data, error } = await supabase
        .from("expert_session_settings")
        .insert({
          expert_id: expertId,
          use_waiting_room: validatedSettings.use_waiting_room,
          meeting_instructions: validatedSettings.meeting_instructions,
          // Include defaults for other required fields
          session_duration_minutes: 15,
          session_price: 30.0,
        })
        .select("use_waiting_room, meeting_instructions")
        .single();

      if (error) throw error;
      savedSettings = data;
    }

    return { data: savedSettings, error: null };
  } catch (error) {
    console.error("Error saving meeting settings:", error);
    return { data: null, error: error as Error };
  }
}

// Get meeting settings for an expert by expert ID (for internal use)
export async function getMeetingSettings(expertId: string) {
  try {
    const { data, error } = await supabase
      .from("expert_session_settings")
      .select("use_waiting_room, meeting_instructions")
      .eq("expert_id", expertId)
      .single();

    if (error) {
      // If no settings exist yet, return defaults
      if (error.code === "PGRST116") {
        return {
          data: {
            use_waiting_room: true,
            meeting_instructions: "",
          },
          error: null,
        };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching meeting settings:", error);
    return { data: null, error: error as Error };
  }
}

// Save meeting settings for an expert by expert ID (for internal use)
export async function saveMeetingSettings(
  expertId: string,
  settings: MeetingSettingsSettings
) {
  try {
    // Validate the settings
    const validatedSettings = MeetingSettingsSchema.parse(settings);

    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from("expert_session_settings")
      .select("id")
      .eq("expert_id", expertId)
      .single();

    let savedSettings;

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from("expert_session_settings")
        .update({
          use_waiting_room: validatedSettings.use_waiting_room,
          meeting_instructions: validatedSettings.meeting_instructions,
          updated_at: new Date().toISOString(),
        })
        .eq("expert_id", expertId)
        .select("use_waiting_room, meeting_instructions")
        .single();

      if (error) throw error;
      savedSettings = data;
    } else {
      // Create new settings with defaults for other required fields
      const { data, error } = await supabase
        .from("expert_session_settings")
        .insert({
          expert_id: expertId,
          use_waiting_room: validatedSettings.use_waiting_room,
          meeting_instructions: validatedSettings.meeting_instructions,
          // Include defaults for other required fields
          session_duration_minutes: 15,
          session_price: 30.0,
        })
        .select("use_waiting_room, meeting_instructions")
        .single();

      if (error) throw error;
      savedSettings = data;
    }

    return { data: savedSettings, error: null };
  } catch (error) {
    console.error("Error saving meeting settings:", error);
    return { data: null, error: error as Error };
  }
}
