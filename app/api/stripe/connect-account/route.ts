// app/api/stripe/connect-account/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import supabaseServer from "@/lib/supabase/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { email, expertId } = await request.json();

    // Check if expert already has a Stripe account
    const { data: existingExpert, error: fetchError } = await supabaseServer
      .from("experts")
      .select("stripe_account_id, stripe_account_status")
      .eq("id", expertId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: "Expert not found" },
        { status: 404 }
      );
    }

    // If expert already has a Stripe account, return existing account info
    if (existingExpert.stripe_account_id) {
      const account = await stripe.accounts.retrieve(
        existingExpert.stripe_account_id
      );

      const accountLink = await stripe.accountLinks.create({
        account: existingExpert.stripe_account_id,
        refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/expert/dashboard/payment-setup?refresh=true`,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/expert/dashboard/payment-setup?success=true`,
        type: "account_onboarding",
      });

      return NextResponse.json({
        success: true,
        accountId: existingExpert.stripe_account_id,
        onboardingUrl: accountLink.url,
        isExisting: true,
      });
    }

    // Create new Express account for the expert
    const account = await stripe.accounts.create({
      type: "express",
      country: "CA", // Change to expert's country if you store it
      email: email,
    });

    // Save account ID to database
    const { error: updateError } = await supabaseServer
      .from("experts")
      .update({
        stripe_account_id: account.id,
        stripe_account_status: "pending",
      })
      .eq("id", expertId);

    if (updateError) {
      console.error("Database update error:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to save account information" },
        { status: 500 }
      );
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/expert/dashboard/payment-setup?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/expert/dashboard/payment-setup?success=true`,
      type: "account_onboarding",
    });

    return NextResponse.json({
      success: true,
      accountId: account.id,
      onboardingUrl: accountLink.url,
      isExisting: false,
    });
  } catch (error) {
    console.error("Stripe Connect error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const expertId = searchParams.get("expertId");

    if (!expertId) {
      return NextResponse.json(
        { success: false, error: "Expert ID required" },
        { status: 400 }
      );
    }

    // Get expert's Stripe account ID from database
    const { data: expert, error: fetchError } = await supabaseServer
      .from("experts")
      .select("stripe_account_id, stripe_account_status, email")
      .eq("id", expertId)
      .single();

    if (fetchError || !expert) {
      return NextResponse.json(
        { success: false, error: "Expert not found" },
        { status: 404 }
      );
    }

    // If no Stripe account connected
    if (!expert.stripe_account_id) {
      return NextResponse.json({
        success: true,
        isConnected: false,
        status: "not_connected",
      });
    }

    // Get account status from Stripe
    const account = await stripe.accounts.retrieve(expert.stripe_account_id);

    // Determine status
    let status = "pending";
    if (
      account.charges_enabled &&
      account.payouts_enabled &&
      account.details_submitted
    ) {
      status = "verified";
    } else if (account.requirements?.disabled_reason) {
      status = "restricted";
    }

    // Update status in database if it changed
    if (status !== expert.stripe_account_status) {
      await supabaseServer
        .from("experts")
        .update({ stripe_account_status: status })
        .eq("id", expertId);
    }

    return NextResponse.json({
      success: true,
      isConnected: true,
      account: {
        id: account.id,
        email: account.email || expert.email,
        country: account.country,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        detailsSubmitted: account.details_submitted,
        status: status,
      },
    });
  } catch (error) {
    console.error("Stripe account retrieve error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
