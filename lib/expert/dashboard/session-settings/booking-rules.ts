// lib/expert/dashboard/session-settings/booking-rules.ts
import supabase from "@/lib/supabase/supabase-client";
import { BookingRulesSchema } from "@/lib/validations/expert/dashboard/session-settings";

export interface BookingRulesSettings {
  buffer_before_minutes: number;
  buffer_after_minutes: number;
  advance_booking_hours: number;
  max_booking_days_ahead: number;
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

// Get booking rules for an expert by auth user ID
export async function getBookingRulesByAuthUser(authUserId: string) {
  try {
    // First get expert ID
    const { expertId, error: expertError } = await getExpertIdFromAuthUser(
      authUserId
    );
    if (expertError || !expertId) {
      throw expertError || new Error("Expert not found");
    }

    // Get booking rules
    const { data, error } = await supabase
      .from("expert_session_settings")
      .select(
        "buffer_before_minutes, buffer_after_minutes, advance_booking_hours, max_booking_days_ahead"
      )
      .eq("expert_id", expertId)
      .single();

    if (error) {
      // If no settings exist yet, return defaults
      if (error.code === "PGRST116") {
        return {
          data: {
            buffer_before_minutes: 15,
            buffer_after_minutes: 15,
            advance_booking_hours: 24,
            max_booking_days_ahead: 30,
          },
          error: null,
        };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching booking rules:", error);
    return { data: null, error: error as Error };
  }
}

// Save booking rules for an expert by auth user ID
export async function saveBookingRulesByAuthUser(
  authUserId: string,
  rules: BookingRulesSettings
) {
  try {
    // Validate the rules
    const validatedRules = BookingRulesSchema.parse(rules);

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
          buffer_before_minutes: validatedRules.buffer_before_minutes,
          buffer_after_minutes: validatedRules.buffer_after_minutes,
          advance_booking_hours: validatedRules.advance_booking_hours,
          max_booking_days_ahead: validatedRules.max_booking_days_ahead,
          updated_at: new Date().toISOString(),
        })
        .eq("expert_id", expertId)
        .select(
          "buffer_before_minutes, buffer_after_minutes, advance_booking_hours, max_booking_days_ahead"
        )
        .single();

      if (error) throw error;
      savedSettings = data;
    } else {
      // Create new settings with defaults for other required fields
      const { data, error } = await supabase
        .from("expert_session_settings")
        .insert({
          expert_id: expertId,
          buffer_before_minutes: validatedRules.buffer_before_minutes,
          buffer_after_minutes: validatedRules.buffer_after_minutes,
          advance_booking_hours: validatedRules.advance_booking_hours,
          max_booking_days_ahead: validatedRules.max_booking_days_ahead,
          // Include defaults for other required fields
          session_duration_minutes: 15,
          session_price: 30.0,
        })
        .select(
          "buffer_before_minutes, buffer_after_minutes, advance_booking_hours, max_booking_days_ahead"
        )
        .single();

      if (error) throw error;
      savedSettings = data;
    }

    return { data: savedSettings, error: null };
  } catch (error) {
    console.error("Error saving booking rules:", error);
    return { data: null, error: error as Error };
  }
}

// Get booking rules for an expert by expert ID (for internal use)
export async function getBookingRules(expertId: string) {
  try {
    const { data, error } = await supabase
      .from("expert_session_settings")
      .select(
        "buffer_before_minutes, buffer_after_minutes, advance_booking_hours, max_booking_days_ahead"
      )
      .eq("expert_id", expertId)
      .single();

    if (error) {
      // If no settings exist yet, return defaults
      if (error.code === "PGRST116") {
        return {
          data: {
            buffer_before_minutes: 15,
            buffer_after_minutes: 15,
            advance_booking_hours: 24,
            max_booking_days_ahead: 30,
          },
          error: null,
        };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching booking rules:", error);
    return { data: null, error: error as Error };
  }
}

// Save booking rules for an expert by expert ID (for internal use)
export async function saveBookingRules(
  expertId: string,
  rules: BookingRulesSettings
) {
  try {
    // Validate the rules
    const validatedRules = BookingRulesSchema.parse(rules);

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
          buffer_before_minutes: validatedRules.buffer_before_minutes,
          buffer_after_minutes: validatedRules.buffer_after_minutes,
          advance_booking_hours: validatedRules.advance_booking_hours,
          max_booking_days_ahead: validatedRules.max_booking_days_ahead,
          updated_at: new Date().toISOString(),
        })
        .eq("expert_id", expertId)
        .select(
          "buffer_before_minutes, buffer_after_minutes, advance_booking_hours, max_booking_days_ahead"
        )
        .single();

      if (error) throw error;
      savedSettings = data;
    } else {
      // Create new settings with defaults for other required fields
      const { data, error } = await supabase
        .from("expert_session_settings")
        .insert({
          expert_id: expertId,
          buffer_before_minutes: validatedRules.buffer_before_minutes,
          buffer_after_minutes: validatedRules.buffer_after_minutes,
          advance_booking_hours: validatedRules.advance_booking_hours,
          max_booking_days_ahead: validatedRules.max_booking_days_ahead,
          // Include defaults for other required fields
          session_duration_minutes: 15,
          session_price: 30.0,
        })
        .select(
          "buffer_before_minutes, buffer_after_minutes, advance_booking_hours, max_booking_days_ahead"
        )
        .single();

      if (error) throw error;
      savedSettings = data;
    }

    return { data: savedSettings, error: null };
  } catch (error) {
    console.error("Error saving booking rules:", error);
    return { data: null, error: error as Error };
  }
}
