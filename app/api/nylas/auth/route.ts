// app/api/nylas/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAuthUrl } from "@/lib/nylas/nylas-client";
import supabaseServer from "@/lib/supabase/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { provider } = await request.json();

    // Validate provider
    if (!provider || !["google", "apple"].includes(provider)) {
      return NextResponse.json({
        success: false,
        error: "Invalid provider. Only Google and Apple are supported.",
      });
    }

    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing authorization header",
        },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Get user from access token using service role client
    const {
      data: { user },
      error: userError,
    } = await supabaseServer.auth.getUser(accessToken);

    if (userError || !user) {
      console.error("User lookup error:", userError);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid session. Please log in again.",
        },
        { status: 401 }
      );
    }

    // Check if user is an expert
    const userType = user.user_metadata?.user_type;

    if (userType !== "expert") {
      return NextResponse.json(
        {
          success: false,
          error: "Only experts can connect calendars.",
        },
        { status: 403 }
      );
    }

    // Get expert ID from the database using service role (bypasses RLS)
    const { data: expertData, error: expertError } = await supabaseServer
      .from("experts")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (expertError || !expertData) {
      console.error("Expert lookup error:", expertError);
      return NextResponse.json(
        {
          success: false,
          error: "Expert profile not found. Please contact support.",
        },
        { status: 404 }
      );
    }

    // Create the authorization URL
    const authUrl = createAuthUrl(provider, expertData.id);

    console.log("Generated auth URL for expert:", expertData.id);

    return NextResponse.json({
      success: true,
      authUrl,
      provider,
    });
  } catch (error) {
    console.error("Error creating auth URL:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
