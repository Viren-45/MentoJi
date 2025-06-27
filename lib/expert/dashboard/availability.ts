// lib/expert/dashboard/availability.ts
import supabase from "@/lib/supabase/supabase-client";
import {
  availabilityRuleSchema,
  weeklyScheduleSchema,
  type AvailabilityRule,
  type WeeklySchedule,
} from "@/lib/validations/expert/dashboard/availability";

// Get expert ID from auth user ID
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

// Get all availability rules for an expert by auth user ID
export async function getExpertAvailabilityRulesByAuthUser(authUserId: string) {
  try {
    // First get expert ID
    const { expertId, error: expertError } = await getExpertIdFromAuthUser(
      authUserId
    );
    if (expertError || !expertId) {
      throw expertError || new Error("Expert not found");
    }

    // Then get availability rules
    return await getExpertAvailabilityRules(expertId);
  } catch (error) {
    console.error("Error fetching availability rules by auth user:", error);
    return { data: null, error: error as Error };
  }
}

export async function getExpertAvailabilityRules(expertId: string) {
  try {
    const { data, error } = await supabase
      .from("expert_availability_rules")
      .select("*")
      .eq("expert_id", expertId)
      .eq("is_active", true)
      .order("day_of_week", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching availability rules:", error);
    return { data: null, error: error as Error };
  }
}

// Create a new availability rule
export async function createAvailabilityRule(
  rule: Omit<AvailabilityRule, "id">
) {
  try {
    // Validate the rule (without is_active since it's not in schema)
    const validatedRule = availabilityRuleSchema.parse(rule);

    const { data, error } = await supabase
      .from("expert_availability_rules")
      .insert([
        {
          expert_id: validatedRule.expert_id,
          day_of_week: validatedRule.day_of_week,
          start_time: `${validatedRule.start_time}:00`, // Add seconds
          end_time: `${validatedRule.end_time}:00`, // Add seconds
          timezone: validatedRule.timezone,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error creating availability rule:", error);
    return { data: null, error: error as Error };
  }
}

// Update an existing availability rule
export async function updateAvailabilityRule(
  ruleId: string,
  updates: Partial<
    Pick<AvailabilityRule, "start_time" | "end_time" | "timezone">
  >
) {
  try {
    const updateData: any = {};

    if (updates.start_time) updateData.start_time = `${updates.start_time}:00`;
    if (updates.end_time) updateData.end_time = `${updates.end_time}:00`;
    if (updates.timezone) updateData.timezone = updates.timezone;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("expert_availability_rules")
      .update(updateData)
      .eq("id", ruleId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error updating availability rule:", error);
    return { data: null, error: error as Error };
  }
}

// Delete an availability rule (soft delete by setting is_active = false)
export async function deleteAvailabilityRule(ruleId: string) {
  try {
    const { data, error } = await supabase
      .from("expert_availability_rules")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", ruleId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error deleting availability rule:", error);
    return { data: null, error: error as Error };
  }
}

// Bulk save weekly schedule (replaces all existing rules)
export async function saveWeeklySchedule(weeklySchedule: WeeklySchedule) {
  try {
    // Validate the weekly schedule
    const validatedSchedule = weeklyScheduleSchema.parse(weeklySchedule);

    // First, hard delete all existing rules for this expert to avoid constraint issues
    const { error: deleteError } = await supabase
      .from("expert_availability_rules")
      .delete()
      .eq("expert_id", validatedSchedule.expert_id);

    if (deleteError) throw deleteError;

    // If no rules to create, return success
    if (validatedSchedule.rules.length === 0) {
      return { data: [], error: null };
    }

    // Insert new rules
    const newRules = validatedSchedule.rules.map((rule) => ({
      expert_id: validatedSchedule.expert_id,
      day_of_week: rule.day_of_week,
      start_time: `${rule.start_time}:00`,
      end_time: `${rule.end_time}:00`,
      timezone: validatedSchedule.timezone,
      is_active: true,
    }));

    const { data, error } = await supabase
      .from("expert_availability_rules")
      .insert(newRules)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error saving weekly schedule:", error);
    return { data: null, error: error as Error };
  }
}

// Get availability for a specific day
export async function getAvailabilityForDay(
  expertId: string,
  dayOfWeek: number
) {
  try {
    const { data, error } = await supabase
      .from("expert_availability_rules")
      .select("*")
      .eq("expert_id", expertId)
      .eq("day_of_week", dayOfWeek)
      .eq("is_active", true)
      .maybeSingle(); // Returns null if no record found

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching day availability:", error);
    return { data: null, error: error as Error };
  }
}

// Check if expert has any availability rules
export async function hasAvailabilityRules(expertId: string) {
  try {
    const { count, error } = await supabase
      .from("expert_availability_rules")
      .select("*", { count: "exact", head: true })
      .eq("expert_id", expertId)
      .eq("is_active", true);

    if (error) throw error;
    return { hasRules: (count || 0) > 0, error: null };
  } catch (error) {
    console.error("Error checking availability rules:", error);
    return { hasRules: false, error: error as Error };
  }
}
