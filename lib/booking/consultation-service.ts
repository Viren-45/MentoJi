// lib/booking/consultation-service.ts
"use server";

import supabase from "@/lib/supabase/supabase-client";
import supabaseServer from "@/lib/supabase/supabase-server";
import { QuestionnaireAnswers } from "@/components/booking/step-two/questionnaire";

export interface CreateConsultationData {
  expertId: string;
  clientId: string; // Always required (authenticated users only)
  selectedDate: string; // YYYY-MM-DD format
  selectedTime: string; // HH:MM format
  duration: number; // minutes
  price: number; // session price (without platform fee)
  questionnaire: QuestionnaireAnswers;
  customerEmail: string; // From payment form (can be different from account email)
  customerName: string; // From payment form (can be different from account name)
}

export interface ConsultationRecord {
  id: string;
  expert_id: string;
  client_id: string;
  consultation_datetime: string;
  duration_minutes: number;
  end_datetime: string;
  price_amount: number;
  currency: string;
  consultation_type: string;
  client_questionnaire: any;
  status: string;
  client_email: string;
  client_full_name: string;
  meeting_link?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Creates a pending consultation record in the database
 * This reserves the time slot and creates the booking
 */
export async function createPendingConsultation(
  data: CreateConsultationData
): Promise<{ success: boolean; data?: ConsultationRecord; error?: string }> {
  try {
    // Parse date and time to create consultation_datetime
    const consultationDate = new Date(
      `${data.selectedDate}T${data.selectedTime}:00`
    );
    const endDate = new Date(
      consultationDate.getTime() + data.duration * 60000
    );

    // Check for time slot conflicts
    const { data: existingConsultations, error: conflictError } = await supabase
      .from("consultations")
      .select("id")
      .eq("expert_id", data.expertId)
      .in("status", ["pending", "confirmed", "in_progress"])
      .gte("consultation_datetime", consultationDate.toISOString())
      .lt("consultation_datetime", endDate.toISOString());

    if (conflictError) {
      throw new Error(`Conflict check failed: ${conflictError.message}`);
    }

    if (existingConsultations && existingConsultations.length > 0) {
      return {
        success: false,
        error:
          "This time slot is no longer available. Please select a different time.",
      };
    }

    // Prepare consultation data (removed payment_status - now handled in consultation_payments)
    const consultationData = {
      expert_id: data.expertId,
      client_id: data.clientId,
      consultation_datetime: consultationDate.toISOString(),
      duration_minutes: data.duration,
      end_datetime: endDate.toISOString(),
      price_amount: data.price,
      currency: "USD",
      consultation_type: "mentoring",
      client_questionnaire: data.questionnaire,
      status: "pending", // Only consultation status, payment status is separate
      client_email: data.customerEmail,
      client_full_name: data.customerName,
    };

    // Insert consultation
    const { data: consultation, error: insertError } = await supabaseServer
      .from("consultations")
      .insert(consultationData)
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create consultation: ${insertError.message}`);
    }

    return {
      success: true,
      data: consultation,
    };
  } catch (error) {
    console.error("Error creating pending consultation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Confirms a consultation after successful payment
 * Updates status but payment info is now tracked separately
 */
export async function confirmConsultation(
  consultationId: string,
  paymentIntentId?: string // Optional - payment info is in consultation_payments table
): Promise<{ success: boolean; data?: ConsultationRecord; error?: string }> {
  try {
    const updateData = {
      status: "confirmed",
      updated_at: new Date().toISOString(),
    };

    const { data: consultation, error: updateError } = await supabaseServer
      .from("consultations")
      .update(updateData)
      .eq("id", consultationId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to confirm consultation: ${updateError.message}`);
    }

    return {
      success: true,
      data: consultation,
    };
  } catch (error) {
    console.error("Error confirming consultation:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to confirm consultation",
    };
  }
}

/**
 * Gets consultation by ID with expert details
 */
export async function getConsultationById(
  consultationId: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data: consultation, error: fetchError } = await supabase
      .from("consultations")
      .select(
        `
        *,
        expert:experts (
          id,
          first_name,
          last_name,
          username,
          job_title,
          company,
          profile_picture_url
        )
      `
      )
      .eq("id", consultationId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch consultation: ${fetchError.message}`);
    }

    return {
      success: true,
      data: consultation,
    };
  } catch (error) {
    console.error("Error fetching consultation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch consultation",
    };
  }
}

/**
 * Cancels a consultation (updates status)
 */
export async function cancelConsultation(
  consultationId: string,
  cancelledBy: "client" | "expert" | "admin",
  cancellationReason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error: updateError } = await supabase
      .from("consultations")
      .update({
        status: "cancelled",
        cancelled_by: cancelledBy,
        cancelled_at: new Date().toISOString(),
        cancellation_reason: cancellationReason || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", consultationId);

    if (updateError) {
      throw new Error(`Failed to cancel consultation: ${updateError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error cancelling consultation:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to cancel consultation",
    };
  }
}

/**
 * Gets client data for pre-filling payment form
 */
export async function getClientData(clientId: string): Promise<{
  success: boolean;
  data?: { email: string; fullName: string };
  error?: string;
}> {
  try {
    const { data: client, error: fetchError } = await supabase
      .from("clients")
      .select("email, first_name, last_name")
      .eq("id", clientId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch client data: ${fetchError.message}`);
    }

    return {
      success: true,
      data: {
        email: client.email,
        fullName: `${client.first_name} ${client.last_name}`,
      },
    };
  } catch (error) {
    console.error("Error fetching client data:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch client data",
    };
  }
}

/**
 * Updates consultation with meeting link after room creation
 */
export async function updateConsultationMeetingLink(
  consultationId: string,
  meetingLink: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error: updateError } = await supabase
      .from("consultations")
      .update({
        meeting_link: meetingLink,
        updated_at: new Date().toISOString(),
      })
      .eq("id", consultationId);

    if (updateError) {
      throw new Error(`Failed to update meeting link: ${updateError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating meeting link:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update meeting link",
    };
  }
}
