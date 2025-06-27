// lib/auth/signin.ts
import supabase from "@/lib/supabase/supabase-client";
import { SignInFormData } from "@/lib/validations/auth/auth";

export interface SignInResult {
  success: boolean;
  error?: string;
  user?: any;
  calendarConnected?: boolean; // Add this for expert calendar status
}

/**
 * Simple check if expert has calendar connected
 */
export async function checkExpertCalendarStatus(
  userId: string
): Promise<boolean> {
  try {
    const { data: expertData, error } = await supabase
      .from("experts")
      .select("calendar_connected")
      .eq("auth_user_id", userId)
      .single();

    if (error || !expertData) {
      return false;
    }

    return expertData.calendar_connected || false;
  } catch (error) {
    console.error("Error checking calendar status:", error);
    return false;
  }
}

export async function signInClient(
  data: SignInFormData
): Promise<SignInResult> {
  try {
    const { email, password } = data;

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Verify user is a client
    const userType = authData.user.user_metadata?.user_type;
    if (userType && userType !== "client") {
      // If user is not a client, sign them out
      await supabase.auth.signOut();
      return {
        success: false,
        error: "Please use the expert login portal.",
      };
    }

    return {
      success: true,
      user: authData.user,
    };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function signInExpert(
  data: SignInFormData
): Promise<SignInResult> {
  try {
    const { email, password } = data;

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Verify user is an expert
    const userType = authData.user.user_metadata?.user_type;
    if (userType !== "expert") {
      // If user is not an expert, sign them out
      await supabase.auth.signOut();
      return {
        success: false,
        error: "Invalid credentials or account not approved yet.",
      };
    }

    // Check calendar status using the utility function
    const calendarConnected = await checkExpertCalendarStatus(authData.user.id);

    return {
      success: true,
      user: authData.user,
      calendarConnected,
    };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
