// app/api/payments/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  confirmConsultation,
  getConsultationById,
} from "@/lib/booking/consultation-service";
import { confirmPaymentAndStoreRecord } from "@/lib/booking/payment-service";
import { createMeetingRoom } from "@/lib/booking/meeting-service";
import {
  sendClientConfirmationEmail,
  sendExpertNotificationEmail,
} from "@/lib/booking/email-service";
import supabase from "@/lib/supabase/supabase-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { paymentIntentId, paymentMethodId, consultationId } = body;

    if (!paymentIntentId || !paymentMethodId || !consultationId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step 1: Confirm payment with Stripe and store payment record
    console.log("Step 1: Confirming payment with Stripe...");
    const paymentResult = await confirmPaymentAndStoreRecord(
      paymentIntentId,
      paymentMethodId
    );

    if (!paymentResult.success) {
      return NextResponse.json(
        { success: false, error: paymentResult.error },
        { status: 400 }
      );
    }

    // Step 2: Update consultation status to confirmed
    console.log("Step 2: Confirming consultation...");
    const consultationResult = await confirmConsultation(
      consultationId,
      paymentIntentId
    );

    if (!consultationResult.success) {
      // Payment was successful but consultation update failed
      // This is a critical error that needs manual intervention
      console.error(
        "CRITICAL: Payment succeeded but consultation update failed",
        {
          consultationId,
          paymentIntentId,
          error: consultationResult.error,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Payment processed but booking confirmation failed. Please contact support.",
          criticalError: true,
          paymentIntentId,
          consultationId,
        },
        { status: 500 }
      );
    }

    // Step 3: Get full consultation details with expert info
    console.log("Step 3: Fetching consultation details...");
    const fullConsultationResult = await getConsultationById(consultationId);

    if (!fullConsultationResult.success || !fullConsultationResult.data) {
      console.error(
        "Failed to fetch consultation details:",
        fullConsultationResult.error
      );
      // Continue with flow but log error
    }

    const consultation = fullConsultationResult.data;
    const expert = consultation?.expert;

    // Step 4: Create 100ms meeting room
    console.log("Step 4: Creating meeting room...");
    let meetingUrl = "";
    let meetingRoomCreated = false;

    try {
      const meetingResult = await createMeetingRoom({
        consultationId: consultationId,
        expertName: expert
          ? `${expert.first_name} ${expert.last_name}`
          : "Expert",
        clientName: consultation?.client_full_name || "Client",
        sessionDateTime: consultation?.consultation_datetime || "",
        duration: consultation?.duration_minutes || 30,
      });

      if (meetingResult.success && meetingResult.data) {
        meetingUrl = meetingResult.data.meeting_url;
        meetingRoomCreated = true;

        // Update consultation with meeting link
        await supabase
          .from("consultations")
          .update({
            meeting_link: meetingUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", consultationId);

        console.log(
          "✅ Meeting room created successfully:",
          meetingResult.data.hms_room_id
        );
      } else {
        console.error("❌ Failed to create meeting room:", meetingResult.error);
        // Set fallback meeting URL
        meetingUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/meeting/${consultationId}`;
      }
    } catch (meetingError) {
      console.error("❌ Error creating meeting room:", meetingError);
      // Set fallback meeting URL
      meetingUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/meeting/${consultationId}`;
    }

    // Step 5: Send confirmation email to client
    console.log("Step 5: Sending client confirmation email...");
    let clientEmailSent = false;

    try {
      const clientEmailResult = await sendClientConfirmationEmail({
        consultationId: consultationId,
        expertName: expert
          ? `${expert.first_name} ${expert.last_name}`
          : "Expert",
        clientName: consultation?.client_full_name || "Client",
        clientEmail: consultation?.client_email || "",
        sessionDateTime: consultation?.consultation_datetime || "",
        duration: consultation?.duration_minutes || 30,
        meetingUrl: meetingUrl,
        sessionPrice: consultation?.price_amount || 0,
        questionnaire: consultation?.client_questionnaire || {},
      });

      if (clientEmailResult.success) {
        clientEmailSent = true;
        console.log("✅ Client confirmation email sent successfully");
      } else {
        console.error(
          "❌ Failed to send client confirmation email:",
          clientEmailResult.error
        );
      }
    } catch (emailError) {
      console.error("❌ Error sending client email:", emailError);
    }

    // Step 6: Send notification email to expert
    console.log("Step 6: Sending expert notification email...");
    let expertEmailSent = false;

    try {
      // Get expert email from experts table
      let expertEmail = "";
      if (expert?.id) {
        const { data: expertData } = await supabase
          .from("experts")
          .select("email")
          .eq("id", expert.id)
          .single();

        expertEmail = expertData?.email || "";
      }

      if (expertEmail) {
        const expertEmailResult = await sendExpertNotificationEmail({
          consultationId: consultationId,
          expertName: expert
            ? `${expert.first_name} ${expert.last_name}`
            : "Expert",
          expertEmail: expertEmail,
          clientName: consultation?.client_full_name || "Client",
          clientEmail: consultation?.client_email || "",
          sessionDateTime: consultation?.consultation_datetime || "",
          duration: consultation?.duration_minutes || 30,
          meetingUrl: meetingUrl,
          sessionPrice: consultation?.price_amount || 0,
          questionnaire: consultation?.client_questionnaire || {},
        });

        if (expertEmailResult.success) {
          expertEmailSent = true;
          console.log("✅ Expert notification email sent successfully");
        } else {
          console.error(
            "❌ Failed to send expert notification email:",
            expertEmailResult.error
          );
        }
      } else {
        console.error(
          "❌ Expert email not found, skipping expert notification"
        );
      }
    } catch (emailError) {
      console.error("❌ Error sending expert email:", emailError);
    }

    // Success - return consultation details with status of each step
    console.log("🎉 Booking flow completed!");

    return NextResponse.json({
      success: true,
      data: {
        consultationId: consultationResult.data?.id,
        consultation: consultation,
        payment: paymentResult.data,
        meetingUrl: meetingUrl,
        message: "Payment confirmed and consultation booked successfully",
        // Status of optional steps (for debugging/monitoring)
        status: {
          paymentConfirmed: true,
          consultationConfirmed: true,
          meetingRoomCreated: meetingRoomCreated,
          clientEmailSent: clientEmailSent,
          expertEmailSent: expertEmailSent,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error in confirm-payment API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
