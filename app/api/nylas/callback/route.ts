// app/api/nylas/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForGrant } from "@/lib/nylas/nylas-client";
import supabaseServer from "@/lib/supabase/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { code, provider, expertId } = await request.json();

    // Validate required parameters
    if (!code || !provider || !expertId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters: code, provider, or expertId",
        },
        { status: 400 }
      );
    }

    // Validate provider
    if (!["google", "apple"].includes(provider)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid provider. Only Google and Apple are supported.",
        },
        { status: 400 }
      );
    }

    // Exchange authorization code for access token
    const exchangeResult = await exchangeCodeForGrant(code, provider);

    if (
      !exchangeResult.success ||
      !exchangeResult.grantId ||
      !exchangeResult.email
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            exchangeResult.error || "Failed to exchange authorization code",
        },
        { status: 400 }
      );
    }

    // Save connection details to database using service role (bypasses RLS)
    const { data: connectionData, error: connectionError } =
      await supabaseServer
        .from("expert_calendar_connections")
        .insert({
          expert_id: expertId,
          nylas_grant_id: exchangeResult.grantId,
          nylas_email: exchangeResult.email,
          provider: provider,
          calendar_id: "primary", // Default calendar
          connection_status: "active",
          last_sync_at: new Date().toISOString(),
          sync_errors: [],
        })
        .select()
        .single();

    if (connectionError) {
      console.error("Error saving connection:", connectionError);
      // Try to revoke the grant if saving failed
      await exchangeCodeForGrant(exchangeResult.grantId, provider);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save calendar connection",
        },
        { status: 500 }
      );
    }

    // Update expert's calendar_connected flag using service role
    const { error: updateError } = await supabaseServer
      .from("experts")
      .update({
        calendar_connected: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", expertId);

    if (updateError) {
      console.error("Error updating expert status:", updateError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      message: "Calendar connected successfully",
      connection: {
        provider,
        email: exchangeResult.email,
        status: "active",
      },
    });
  } catch (error) {
    console.error("Callback processing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
