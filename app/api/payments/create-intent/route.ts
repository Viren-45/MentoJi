// app/api/payments/create-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createPendingConsultation } from "@/lib/booking/consultation-service";
import { createPaymentIntent } from "@/lib/booking/payment-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      expertId,
      clientId,
      selectedDate,
      selectedTime,
      duration,
      sessionPrice,
      platformFeeRate = 0.1, // 10%
      questionnaire,
      customerEmail,
      customerName,
    } = body;

    // Validation
    if (
      !expertId ||
      !clientId ||
      !selectedDate ||
      !selectedTime ||
      !duration ||
      !sessionPrice ||
      !customerEmail ||
      !customerName
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total amount
    const platformFee = Math.round(sessionPrice * platformFeeRate * 100) / 100;
    const totalAmount = sessionPrice + platformFee;

    // Step 1: Create pending consultation in database
    const consultationResult = await createPendingConsultation({
      expertId,
      clientId,
      selectedDate,
      selectedTime,
      duration,
      price: sessionPrice,
      questionnaire: questionnaire || {},
      customerEmail,
      customerName,
    });

    if (!consultationResult.success || !consultationResult.data) {
      return NextResponse.json(
        { success: false, error: consultationResult.error },
        { status: 400 }
      );
    }

    const consultation = consultationResult.data;

    // Step 2: Create Stripe payment intent
    const paymentResult = await createPaymentIntent({
      consultationId: consultation.id,
      amount: totalAmount,
      customerEmail,
      customerName,
      expertId,
    });

    if (!paymentResult.success) {
      // If payment intent creation fails, we should clean up the consultation
      // For now, we'll leave it as pending and let cleanup jobs handle it
      return NextResponse.json(
        { success: false, error: paymentResult.error },
        { status: 500 }
      );
    }

    // Return success with client secret and consultation details
    return NextResponse.json({
      success: true,
      data: {
        consultationId: consultation.id,
        clientSecret: paymentResult.clientSecret,
        paymentIntentId: paymentResult.paymentIntentId,
        amount: {
          sessionPrice,
          platformFee,
          totalAmount,
        },
      },
    });
  } catch (error) {
    console.error("Error in create-intent API:", error);
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
