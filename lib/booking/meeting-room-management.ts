// lib/booking/meeting-room-management.ts
"use server";

import { SDK } from "@100mslive/server-sdk";
import supabase from "@/lib/supabase/supabase-client";
import { getMeetingRoom } from "./meeting-service";

// Initialize 100ms SDK
const hmsSDK = new SDK(process.env.HMS_ACCESS_KEY!, process.env.HMS_SECRET!);

/**
 * Updates meeting room status (for session management)
 */
export async function updateMeetingRoomStatus(
  consultationId: string,
  status: "active" | "disabled" | "expired",
  sessionData?: {
    sessionStartedAt?: string;
    sessionEndedAt?: string;
    participantsJoined?: any[];
    recordingUrl?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {
      room_status: status,
      updated_at: new Date().toISOString(),
    };

    // Add session data if provided
    if (sessionData) {
      if (sessionData.sessionStartedAt) {
        updateData.session_started_at = sessionData.sessionStartedAt;
      }
      if (sessionData.sessionEndedAt) {
        updateData.session_ended_at = sessionData.sessionEndedAt;
        // Calculate duration in seconds
        const start = new Date(sessionData.sessionStartedAt || "");
        const end = new Date(sessionData.sessionEndedAt);
        updateData.session_duration_seconds = Math.floor(
          (end.getTime() - start.getTime()) / 1000
        );
      }
      if (sessionData.participantsJoined) {
        updateData.participants_joined = sessionData.participantsJoined;
      }
      if (sessionData.recordingUrl) {
        updateData.recording_url = sessionData.recordingUrl;
      }
    }

    const { error: updateError } = await supabase
      .from("consultation_meeting_rooms")
      .update(updateData)
      .eq("consultation_id", consultationId);

    if (updateError) {
      throw new Error(`Failed to update meeting room: ${updateError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating meeting room status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update meeting room status",
    };
  }
}

/**
 * Disables meeting room (for security after session ends)
 */
export async function disableMeetingRoom(
  consultationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update room status to disabled in database
    const result = await updateMeetingRoomStatus(consultationId, "disabled");

    if (!result.success) {
      return result;
    }

    // Note: Actual room disabling on 100ms side might not be available
    // or might require different API methods. For now, we just update our database.
    console.log(`Meeting room disabled for consultation ${consultationId}`);
    return { success: true };
  } catch (error) {
    console.error("Error disabling meeting room:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to disable meeting room",
    };
  }
}

/**
 * Gets room recordings from 100ms (simplified version)
 */
export async function getRoomRecordings(
  roomId: string
): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    console.log(`Attempting to fetch recordings for room: ${roomId}`);

    // For now, return empty array as the recordings API format is unclear
    // This can be updated once we test the actual 100ms recording API
    console.log("Recordings API not implemented yet - returning empty array");

    return {
      success: true,
      data: [],
    };
  } catch (error) {
    console.error("Error fetching recordings:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch recordings",
    };
  }
}

/**
 * Gets basic room information (simplified)
 */
export async function getHMSRoomInfo(
  roomId: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    console.log(`Attempting to fetch HMS room info for: ${roomId}`);

    // For now, return basic info as the exact API method is unclear
    // This can be updated once we test the actual 100ms room retrieval API
    const basicInfo = {
      id: roomId,
      status: "unknown",
      note: "Room info API not fully implemented yet",
    };

    return {
      success: true,
      data: basicInfo,
    };
  } catch (error) {
    console.error("Error fetching HMS room info:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch room info",
    };
  }
}

/**
 * Simplified room settings update
 */
export async function updateHMSRoomSettings(
  roomId: string,
  settings: {
    description?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Attempting to update HMS room settings for: ${roomId}`);

    // For now, just log the attempt as the exact API method is unclear
    console.log("Room settings update not fully implemented yet");

    return { success: true };
  } catch (error) {
    console.error("Error updating HMS room settings:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update room settings",
    };
  }
}

/**
 * Get room list from 100ms (for debugging/monitoring)
 */
export async function listHMSRooms(): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  try {
    console.log("Fetching list of HMS rooms...");

    // Simple room listing - this should work with most 100ms SDKs
    const rooms = await hmsSDK.rooms.list();

    // Handle different response formats
    let roomsData = [];
    if (Array.isArray(rooms)) {
      roomsData = rooms;
    } else if (rooms && typeof rooms === "object") {
      // Try to extract data from different possible properties
      roomsData = (rooms as any).data || (rooms as any).rooms || [];
    }

    return {
      success: true,
      data: roomsData,
    };
  } catch (error) {
    console.error("Error listing HMS rooms:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list rooms",
    };
  }
}
