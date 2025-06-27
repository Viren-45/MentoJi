// lib/expert/dashboard/availability/nylas-calendar.ts
import supabase from "@/lib/supabase/supabase-client";

export interface CalendarEvent {
  id: string;
  title: string;
  start_time: string; // ISO string
  end_time: string; // ISO string
  busy: boolean;
}

export interface AvailableTimeSlot {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

// Get expert's calendar connection
export async function getExpertCalendarConnection(authUserId: string) {
  try {
    // First get expert ID
    const { data: expertData, error: expertError } = await supabase
      .from("experts")
      .select("id")
      .eq("auth_user_id", authUserId)
      .eq("status", "approved")
      .single();

    if (expertError || !expertData) {
      throw expertError || new Error("Expert not found");
    }

    // Get calendar connection
    const { data, error } = await supabase
      .from("expert_calendar_connections")
      .select("nylas_grant_id, calendar_id, connection_status")
      .eq("expert_id", expertData.id)
      .eq("connection_status", "active")
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error getting calendar connection:", error);
    return { data: null, error: error as Error };
  }
}

// Fetch calendar events for a specific date range from Nylas
export async function fetchCalendarEvents(
  nylasGrantId: string,
  calendarId: string,
  startDate: string, // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
): Promise<{ data: CalendarEvent[] | null; error: Error | null }> {
  try {
    const response = await fetch("/api/nylas/calendar/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_id: nylasGrantId,
        calendar_id: calendarId,
        start_date: startDate,
        end_date: endDate,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch calendar events: ${response.status} ${errorText}`
      );
    }

    const events = await response.json();

    // Transform to our CalendarEvent format if needed
    const transformedEvents = events.map((event: any) => ({
      id: event.id,
      title: event.title || "(No title)",
      start_time: event.start_time,
      end_time: event.end_time,
      busy: event.busy,
    }));

    return { data: transformedEvents, error: null };
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return { data: null, error: error as Error };
  }
}

// Calculate available time slots by subtracting busy times from availability
export function calculateAvailableSlots(
  availabilityStart: string, // "09:00"
  availabilityEnd: string, // "17:00"
  busyEvents: CalendarEvent[],
  targetDate: string // "2025-06-25"
): AvailableTimeSlot[] {
  const availableSlots: AvailableTimeSlot[] = [];

  // Convert availability times to minutes since midnight
  const [startHour, startMin] = availabilityStart.split(":").map(Number);
  const [endHour, endMin] = availabilityEnd.split(":").map(Number);

  let availabilityStartMinutes = startHour * 60 + startMin;
  let availabilityEndMinutes = endHour * 60 + endMin;

  // Convert busy events to minutes since midnight on target date
  const busyPeriods: { start: number; end: number }[] = [];

  busyEvents.forEach((event) => {
    if (!event.busy) return; // Skip non-busy events

    const eventStart = new Date(event.start_time);
    const eventEnd = new Date(event.end_time);

    // Create target date objects for comparison (in local timezone)
    const targetDateStart = new Date(targetDate + "T00:00:00");
    const targetDateEnd = new Date(targetDate + "T23:59:59");

    // Check if event overlaps with the target date
    // Event must start before end of day AND end after start of day
    if (eventStart <= targetDateEnd && eventEnd >= targetDateStart) {
      // Calculate the overlap with the target date
      const overlapStart =
        eventStart > targetDateStart ? eventStart : targetDateStart;
      const overlapEnd = eventEnd < targetDateEnd ? eventEnd : targetDateEnd;

      // Convert to minutes since start of target date
      const startMinutes = Math.max(
        0,
        overlapStart.getHours() * 60 + overlapStart.getMinutes()
      );
      const endMinutes = Math.min(
        24 * 60,
        overlapEnd.getHours() * 60 + overlapEnd.getMinutes()
      );

      // Only include conflicts that overlap with availability window
      if (
        startMinutes < availabilityEndMinutes &&
        endMinutes > availabilityStartMinutes
      ) {
        busyPeriods.push({
          start: Math.max(startMinutes, availabilityStartMinutes),
          end: Math.min(endMinutes, availabilityEndMinutes),
        });

        console.log(`Event "${event.title}" on ${targetDate}:`, {
          eventStart: eventStart.toISOString(),
          eventEnd: eventEnd.toISOString(),
          overlapStart: overlapStart.toISOString(),
          overlapEnd: overlapEnd.toISOString(),
          busyPeriod: { start: startMinutes, end: endMinutes },
        });
      }
    }
  });

  // Sort busy periods by start time
  busyPeriods.sort((a, b) => a.start - b.start);

  // Merge overlapping busy periods
  const mergedBusyPeriods: { start: number; end: number }[] = [];
  busyPeriods.forEach((period) => {
    if (mergedBusyPeriods.length === 0) {
      mergedBusyPeriods.push(period);
    } else {
      const lastPeriod = mergedBusyPeriods[mergedBusyPeriods.length - 1];
      if (period.start <= lastPeriod.end) {
        // Overlapping periods - merge them
        lastPeriod.end = Math.max(lastPeriod.end, period.end);
      } else {
        // Non-overlapping period
        mergedBusyPeriods.push(period);
      }
    }
  });

  // Calculate available slots between busy periods
  let currentStart = availabilityStartMinutes;

  mergedBusyPeriods.forEach((busyPeriod) => {
    if (currentStart < busyPeriod.start) {
      // Available slot before this busy period
      availableSlots.push({
        startTime: minutesToTimeString(currentStart),
        endTime: minutesToTimeString(busyPeriod.start),
      });
    }
    currentStart = Math.max(currentStart, busyPeriod.end);
  });

  // Check if there's availability after the last busy period
  if (currentStart < availabilityEndMinutes) {
    availableSlots.push({
      startTime: minutesToTimeString(currentStart),
      endTime: minutesToTimeString(availabilityEndMinutes),
    });
  }

  console.log(`Available slots for ${targetDate}:`, availableSlots);
  return availableSlots;
}

// Helper function to convert minutes since midnight to HH:MM format
function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

// Get calculated availability for a specific date
export async function getCalculatedAvailability(
  authUserId: string,
  date: string, // "2025-06-25"
  availabilityRules: { startTime: string; endTime: string } | null
): Promise<{ data: AvailableTimeSlot[] | null; error: Error | null }> {
  try {
    if (!availabilityRules) {
      // No availability rules for this day
      return { data: [], error: null };
    }

    // Get calendar connection
    const { data: connection } = await getExpertCalendarConnection(authUserId);

    if (!connection) {
      // No calendar connected - just return the availability rules
      return {
        data: [
          {
            startTime: availabilityRules.startTime,
            endTime: availabilityRules.endTime,
          },
        ],
        error: null,
      };
    }

    // Fetch calendar events for this date
    const { data: events, error: eventsError } = await fetchCalendarEvents(
      connection.nylas_grant_id,
      connection.calendar_id,
      date,
      date
    );

    if (eventsError || !events) {
      // Error fetching events - fallback to availability rules
      console.warn(
        "Could not fetch calendar events, using availability rules only"
      );
      return {
        data: [
          {
            startTime: availabilityRules.startTime,
            endTime: availabilityRules.endTime,
          },
        ],
        error: null,
      };
    }

    // Calculate available slots
    const availableSlots = calculateAvailableSlots(
      availabilityRules.startTime,
      availabilityRules.endTime,
      events,
      date
    );

    return { data: availableSlots, error: null };
  } catch (error) {
    console.error("Error calculating availability:", error);
    return { data: null, error: error as Error };
  }
}
