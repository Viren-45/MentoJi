// lib/expert/dashboard/session-settings/booking-preferences.ts
import supabase from "@/lib/supabase/supabase-client";
import { BookingPreferencesSchema } from "@/lib/validations/expert/dashboard/session-settings";

export interface BookingPreferencesSettings {
  auto_confirm_bookings: boolean;
  send_booking_reminders: boolean;
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

// Get booking preferences for an expert by auth user ID
export async function getBookingPreferencesByAuthUser(authUserId: string) {
  try {
    // First get expert ID
    const { expertId, error: expertError } = await getExpertIdFromAuthUser(
      authUserId
    );
    if (expertError || !expertId) {
      throw expertError || new Error("Expert not found");
    }

    // Get booking preferences
    const { data, error } = await supabase
      .from("expert_session_settings")
      .select("auto_confirm_bookings, send_booking_reminders")
      .eq("expert_id", expertId)
      .single();

    if (error) {
      // If no settings exist yet, return defaults
      if (error.code === "PGRST116") {
        return {
          data: {
            auto_confirm_bookings: true,
            send_booking_reminders: true,
          },
          error: null,
        };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching booking preferences:", error);
    return { data: null, error: error as Error };
  }
}

// Save booking preferences for an expert by auth user ID
export async function saveBookingPreferencesByAuthUser(
  authUserId: string,
  preferences: BookingPreferencesSettings
) {
  try {
    // Validate the preferences
    const validatedPreferences = BookingPreferencesSchema.parse(preferences);

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
          auto_confirm_bookings: validatedPreferences.auto_confirm_bookings,
          send_booking_reminders: validatedPreferences.send_booking_reminders,
          updated_at: new Date().toISOString(),
        })
        .eq("expert_id", expertId)
        .select("auto_confirm_bookings, send_booking_reminders")
        .single();

      if (error) throw error;
      savedSettings = data;
    } else {
      // Create new settings with defaults for other required fields
      const { data, error } = await supabase
        .from("expert_session_settings")
        .insert({
          expert_id: expertId,
          auto_confirm_bookings: validatedPreferences.auto_confirm_bookings,
          send_booking_reminders: validatedPreferences.send_booking_reminders,
          // Include defaults for other required fields
          session_duration_minutes: 15,
          session_price: 30.0,
        })
        .select("auto_confirm_bookings, send_booking_reminders")
        .single();

      if (error) throw error;
      savedSettings = data;
    }

    return { data: savedSettings, error: null };
  } catch (error) {
    console.error("Error saving booking preferences:", error);
    return { data: null, error: error as Error };
  }
}

// Get booking preferences for an expert by expert ID (for internal use)
export async function getBookingPreferences(expertId: string) {
  try {
    const { data, error } = await supabase
      .from("expert_session_settings")
      .select("auto_confirm_bookings, send_booking_reminders")
      .eq("expert_id", expertId)
      .single();

    if (error) {
      // If no settings exist yet, return defaults
      if (error.code === "PGRST116") {
        return {
          data: {
            auto_confirm_bookings: true,
            send_booking_reminders: true,
          },
          error: null,
        };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching booking preferences:", error);
    return { data: null, error: error as Error };
  }
}

// Save booking preferences for an expert by expert ID (for internal use)
export async function saveBookingPreferences(
  expertId: string,
  preferences: BookingPreferencesSettings
) {
  try {
    // Validate the preferences
    const validatedPreferences = BookingPreferencesSchema.parse(preferences);

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
          auto_confirm_bookings: validatedPreferences.auto_confirm_bookings,
          send_booking_reminders: validatedPreferences.send_booking_reminders,
          updated_at: new Date().toISOString(),
        })
        .eq("expert_id", expertId)
        .select("auto_confirm_bookings, send_booking_reminders")
        .single();

      if (error) throw error;
      savedSettings = data;
    } else {
      // Create new settings with defaults for other required fields
      const { data, error } = await supabase
        .from("expert_session_settings")
        .insert({
          expert_id: expertId,
          auto_confirm_bookings: validatedPreferences.auto_confirm_bookings,
          send_booking_reminders: validatedPreferences.send_booking_reminders,
          // Include defaults for other required fields
          session_duration_minutes: 15,
          session_price: 30.0,
        })
        .select("auto_confirm_bookings, send_booking_reminders")
        .single();

      if (error) throw error;
      savedSettings = data;
    }

    return { data: savedSettings, error: null };
  } catch (error) {
    console.error("Error saving booking preferences:", error);
    return { data: null, error: error as Error };
  }
}
