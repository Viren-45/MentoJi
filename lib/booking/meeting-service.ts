// lib/booking/meeting-service.ts
"use server";

import { SDK } from "@100mslive/server-sdk";
import supabase from "@/lib/supabase/supabase-client";

// Initialize 100ms SDK
const hmsSDK = new SDK(process.env.HMS_ACCESS_KEY!, process.env.HMS_SECRET!);

export interface MeetingRoomData {
  consultationId: string;
  expertName: string;
  clientName: string;
  sessionDateTime: string;
  duration: number;
}

export interface MeetingRoomRecord {
  id: string;
  consultation_id: string;
  hms_room_id: string;
  hms_room_name: string;
  meeting_url: string;
  expert_join_token: string;
  client_join_token: string;
  room_status: string;
  recording_enabled: boolean;
  created_at: string;
}

/**
 * Creates a 100ms room and generates join tokens
 * Called after successful payment
 */
export async function createMeetingRoom(
  data: MeetingRoomData
): Promise<{ success: boolean; data?: MeetingRoomRecord; error?: string }> {
  try {
    // Generate unique room name
    const roomName = `consultation-${data.consultationId}-${Date.now()}`;
    const roomDescription = `Consultation between ${data.expertName} and ${data.clientName}`;

    // Create 100ms room
    const hmsRoom = await createHMSRoom(roomName, roomDescription);

    if (!hmsRoom.success) {
      throw new Error(hmsRoom.error || "Failed to create 100ms room");
    }

    const hmsRoomId = hmsRoom.data!.id;

    // Generate join tokens for expert and client
    const expertToken = await generateHMSToken(
      hmsRoomId,
      "expert",
      data.expertName
    );
    const clientToken = await generateHMSToken(
      hmsRoomId,
      "client",
      data.clientName
    );

    if (!expertToken.success || !clientToken.success) {
      throw new Error("Failed to generate join tokens");
    }

    // Create meeting URL that points to your app
    const meetingUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/meeting/${data.consultationId}`;

    // Store meeting room details in database
    const meetingRoomData = {
      consultation_id: data.consultationId,
      hms_room_id: hmsRoomId,
      hms_room_name: roomName,
      meeting_url: meetingUrl,
      expert_join_token: expertToken.data!.token,
      client_join_token: clientToken.data!.token,
      room_status: "active",
      recording_enabled: true,
      room_metadata: {
        description: roomDescription,
        session_duration: data.duration,
        created_for: "consultation",
      },
    };

    const { data: meetingRoom, error: insertError } = await supabase
      .from("consultation_meeting_rooms")
      .insert(meetingRoomData)
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to store meeting room: ${insertError.message}`);
    }

    return {
      success: true,
      data: meetingRoom,
    };
  } catch (error) {
    console.error("Error creating meeting room:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create meeting room",
    };
  }
}

/**
 * Creates a real 100ms room using the SDK
 */
async function createHMSRoom(
  name: string,
  description: string
): Promise<{
  success: boolean;
  data?: { id: string; name: string };
  error?: string;
}> {
  try {
    console.log(`Creating 100ms room: ${name}`);

    // Simplified room creation options
    const roomOptions = {
      name: name,
      description: description,
      region: "us",
    };

    const room = await hmsSDK.rooms.create(roomOptions);

    console.log(`✅ Created 100ms room: ${room.id}`);

    return {
      success: true,
      data: {
        id: room.id,
        name: room.name,
      },
    };
  } catch (error) {
    console.error("Error creating HMS room:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create HMS room",
    };
  }
}

/**
 * Generates real 100ms auth tokens using the SDK
 */
async function generateHMSToken(
  roomId: string,
  role: "expert" | "client",
  userName: string
): Promise<{ success: boolean; data?: { token: string }; error?: string }> {
  try {
    console.log(`Generating token for ${role} (${userName}) in room ${roomId}`);

    // Map roles to 100ms roles
    const hmsRole = role === "expert" ? "host" : "guest";

    // Simplified auth token parameters
    const tokenConfig = {
      roomId: roomId,
      userId: userName.replace(/\s+/g, "_").toLowerCase(),
      role: hmsRole,
      // Removed 'type' and 'exp' as they seem to cause issues
    };

    const authToken = await hmsSDK.auth.getAuthToken(tokenConfig);

    console.log(`✅ Generated token for ${role} in room ${roomId}`);

    // Handle different response formats
    let token = "";
    if (typeof authToken === "string") {
      token = authToken;
    } else if (
      authToken &&
      typeof authToken === "object" &&
      "token" in authToken
    ) {
      token = (authToken as any).token;
    } else {
      throw new Error("Invalid token response format");
    }

    return {
      success: true,
      data: { token: token },
    };
  } catch (error) {
    console.error("Error generating HMS token:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate HMS token",
    };
  }
}

/**
 * Gets meeting room details by consultation ID
 */
export async function getMeetingRoom(
  consultationId: string
): Promise<{ success: boolean; data?: MeetingRoomRecord; error?: string }> {
  try {
    const { data: meetingRoom, error: fetchError } = await supabase
      .from("consultation_meeting_rooms")
      .select("*")
      .eq("consultation_id", consultationId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch meeting room: ${fetchError.message}`);
    }

    return {
      success: true,
      data: meetingRoom,
    };
  } catch (error) {
    console.error("Error fetching meeting room:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch meeting room",
    };
  }
}
