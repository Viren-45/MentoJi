// app/api/nylas/calendar/events/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { grant_id, calendar_id, start_date, end_date } =
      await request.json();

    // Validate required parameters
    if (!grant_id || !calendar_id || !start_date || !end_date) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Convert dates to Unix timestamps for Nylas API
    // Nylas v3 uses: start (equivalent to ends_after) and end (equivalent to starts_before)
    // For a date range 2025-06-24, we want events that overlap with that day
    const startOfDay = new Date(start_date + "T00:00:00.000Z");
    const endOfDay = new Date(end_date + "T23:59:59.999Z");

    const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
    const endTimestamp = Math.floor(endOfDay.getTime() / 1000);

    console.log("Date conversion:", {
      input_start_date: start_date,
      input_end_date: end_date,
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString(),
      startTimestamp,
      endTimestamp,
    });

    // Nylas API configuration
    const nylasApiUrl = `https://api.us.nylas.com/v3/grants/${grant_id}/events`;
    const nylasApiKey = process.env.NYLAS_CLIENT_SECRET;

    if (!nylasApiKey) {
      console.error("NYLAS_API_KEY is not configured");
      return NextResponse.json(
        { error: "Nylas API not configured" },
        { status: 500 }
      );
    }

    // Prepare query parameters for Nylas API
    const queryParams = new URLSearchParams({
      calendar_id: calendar_id,
      start: startTimestamp.toString(),
      end: endTimestamp.toString(),
      expand_recurring: "true", // Include recurring events
      limit: "100", // Adjust as needed
    });

    // Call Nylas API
    const nylasResponse = await fetch(`${nylasApiUrl}?${queryParams}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${nylasApiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!nylasResponse.ok) {
      const errorText = await nylasResponse.text();
      console.error("Nylas API error:", nylasResponse.status, errorText);

      return NextResponse.json(
        { error: "Failed to fetch calendar events from Nylas" },
        { status: nylasResponse.status }
      );
    }

    const nylasData = await nylasResponse.json();

    // Transform Nylas events to our format
    const events =
      nylasData.data?.map((event: any) => ({
        id: event.id,
        title: event.title || "(No title)",
        start_time: event.when?.start_time
          ? new Date(event.when.start_time * 1000).toISOString()
          : null,
        end_time: event.when?.end_time
          ? new Date(event.when.end_time * 1000).toISOString()
          : null,
        busy: event.busy !== false, // Default to busy unless explicitly false
        status: event.status,
        description: event.description,
        location: event.location,
      })) || [];

    console.log(
      `Fetched ${events.length} events for date range ${start_date} to ${end_date}`
    );

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error in Nylas calendar events API:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for debugging
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: "Nylas Calendar Events API",
      usage: "POST with { grant_id, calendar_id, start_date, end_date }",
    },
    { status: 200 }
  );
}
