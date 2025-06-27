// lib/validations/expert/dashboard/availability.ts
import { z } from "zod";

// Time format validation (HH:MM)
const timeSchema = z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format");

// Validate time range - handles overnight schedules
const validateTimeRange = (startTime: string, endTime: string) => {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // If end time is smaller, it means overnight (e.g., 21:00 to 01:00)
  if (endMinutes < startMinutes) {
    // For consultation platform, overnight shifts are not recommended
    // Add 24 hours to end time for validation, but warn about overnight
    return false; // Reject overnight schedules
  }

  return endMinutes > startMinutes;
};

// Main availability rule schema
export const availabilityRuleSchema = z
  .object({
    expert_id: z.string().uuid(),
    day_of_week: z.number().min(0).max(6),
    start_time: timeSchema,
    end_time: timeSchema,
    timezone: z.string().min(1),
  })
  .refine((data) => validateTimeRange(data.start_time, data.end_time), {
    message:
      "End time must be after start time. Overnight schedules are not supported.",
    path: ["end_time"],
  });

// Frontend time slot schema
export const timeSlotSchema = z
  .object({
    id: z.string(),
    startTime: timeSchema,
    endTime: timeSchema,
  })
  .refine((data) => validateTimeRange(data.startTime, data.endTime), {
    message:
      "End time must be after start time. Overnight schedules are not supported.",
    path: ["endTime"],
  });

// Weekly schedule for saving
export const weeklyScheduleSchema = z.object({
  expert_id: z.string().uuid(),
  timezone: z.string().min(1),
  rules: z.array(
    z.object({
      day_of_week: z.number().min(0).max(6),
      start_time: timeSchema,
      end_time: timeSchema,
    })
  ),
});

// Export types
export type AvailabilityRule = z.infer<typeof availabilityRuleSchema>;
export type TimeSlot = z.infer<typeof timeSlotSchema>;
export type WeeklySchedule = z.infer<typeof weeklyScheduleSchema>;
