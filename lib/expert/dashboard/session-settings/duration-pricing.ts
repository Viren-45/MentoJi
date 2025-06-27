// lib/expert/dashboard/session-settings/duration-pricing.ts
import supabase from "@/lib/supabase/supabase-client";
import { SessionDurationPricingSchema } from "@/lib/validations/expert/dashboard/session-settings";

export interface DurationPricing {
  session_duration_minutes: number;
  session_price: number;
}

// Get expert ID from auth user ID (reuse from availability)
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

// Get duration pricing for an expert by auth user ID
export async function getDurationPricingByAuthUser(authUserId: string) {
  try {
    // First get expert ID
    const { expertId, error: expertError } = await getExpertIdFromAuthUser(
      authUserId
    );
    if (expertError || !expertId) {
      throw expertError || new Error("Expert not found");
    }

    // Get session settings
    const { data, error } = await supabase
      .from("expert_session_settings")
      .select("session_duration_minutes, session_price")
      .eq("expert_id", expertId)
      .single();

    if (error) {
      // If no settings exist yet, return defaults
      if (error.code === "PGRST116") {
        return {
          data: {
            session_duration_minutes: 15,
            session_price: 30.0,
          },
          error: null,
        };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching session settings:", error);
    return { data: null, error: error as Error };
  }
}

// Save duration pricing for an expert by auth user ID
export async function saveDurationPricingByAuthUser(
  authUserId: string,
  settings: DurationPricing
) {
  try {
    // Validate the settings
    const validatedSettings = SessionDurationPricingSchema.parse(settings);

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
          session_duration_minutes: validatedSettings.session_duration_minutes,
          session_price: validatedSettings.session_price,
          updated_at: new Date().toISOString(),
        })
        .eq("expert_id", expertId)
        .select("session_duration_minutes, session_price")
        .single();

      if (error) throw error;
      savedSettings = data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from("expert_session_settings")
        .insert({
          expert_id: expertId,
          session_duration_minutes: validatedSettings.session_duration_minutes,
          session_price: validatedSettings.session_price,
        })
        .select("session_duration_minutes, session_price")
        .single();

      if (error) throw error;
      savedSettings = data;
    }

    return { data: savedSettings, error: null };
  } catch (error) {
    console.error("Error saving session settings:", error);
    return { data: null, error: error as Error };
  }
}

// Get session settings for an expert by expert ID (for internal use)
export async function getDurationPricing(expertId: string) {
  try {
    const { data, error } = await supabase
      .from("expert_session_settings")
      .select("session_duration_minutes, session_price")
      .eq("expert_id", expertId)
      .single();

    if (error) {
      // If no settings exist yet, return defaults
      if (error.code === "PGRST116") {
        return {
          data: {
            session_duration_minutes: 15,
            session_price: 30.0,
          },
          error: null,
        };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching session settings:", error);
    return { data: null, error: error as Error };
  }
}

// Save session settings for an expert by expert ID (for internal use)
export async function saveDurationPricing(
  expertId: string,
  settings: DurationPricing
) {
  try {
    // Validate the settings
    const validatedSettings = SessionDurationPricingSchema.parse(settings);

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
          session_duration_minutes: validatedSettings.session_duration_minutes,
          session_price: validatedSettings.session_price,
          updated_at: new Date().toISOString(),
        })
        .eq("expert_id", expertId)
        .select("session_duration_minutes, session_price")
        .single();

      if (error) throw error;
      savedSettings = data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from("expert_session_settings")
        .insert({
          expert_id: expertId,
          session_duration_minutes: validatedSettings.session_duration_minutes,
          session_price: validatedSettings.session_price,
        })
        .select("session_duration_minutes, session_price")
        .single();

      if (error) throw error;
      savedSettings = data;
    }

    return { data: savedSettings, error: null };
  } catch (error) {
    console.error("Error saving session settings:", error);
    return { data: null, error: error as Error };
  }
}
