// lib/validations/expert/dashboard/session-settings.ts
import { z } from "zod";

export const SessionDurationPricingSchema = z.object({
  session_duration_minutes: z
    .number()
    .min(15, "Session duration must be at least 15 minutes")
    .max(120, "Session duration cannot exceed 120 minutes"),
  session_price: z
    .number()
    .min(0, "Session price cannot be negative")
    .max(10000, "Session price cannot exceed $10,000"),
});

export const BookingRulesSchema = z.object({
  buffer_before_minutes: z
    .number()
    .min(0, "Buffer before cannot be negative")
    .max(60, "Buffer before cannot exceed 60 minutes"),
  buffer_after_minutes: z
    .number()
    .min(0, "Buffer after cannot be negative")
    .max(60, "Buffer after cannot exceed 60 minutes"),
  advance_booking_hours: z
    .number()
    .min(1, "Advance booking must be at least 1 hour")
    .max(720, "Advance booking cannot exceed 30 days"), // 30 days * 24 hours
  max_booking_days_ahead: z
    .number()
    .min(1, "Booking window must be at least 1 day")
    .max(365, "Booking window cannot exceed 1 year"),
});

export const BookingPreferencesSchema = z.object({
  auto_confirm_bookings: z.boolean(),
  send_booking_reminders: z.boolean(),
});

export const MeetingSettingsSchema = z.object({
  use_waiting_room: z.boolean(),
  meeting_instructions: z
    .string()
    .max(1000, "Meeting instructions cannot exceed 1000 characters"),
});

export type SessionDurationPricingInput = z.infer<
  typeof SessionDurationPricingSchema
>;
export type BookingRulesInput = z.infer<typeof BookingRulesSchema>;
export type BookingPreferencesInput = z.infer<typeof BookingPreferencesSchema>;
export type MeetingSettingsInput = z.infer<typeof MeetingSettingsSchema>;
