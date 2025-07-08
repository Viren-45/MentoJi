// lib/booking/payment-service.ts
"use server";

import Stripe from "stripe";
import supabase from "@/lib/supabase/supabase-client";
import supabaseServer from "@/lib/supabase/supabase-server";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export interface PaymentData {
  consultationId: string;
  amount: number; // Total amount including platform fee (in dollars)
  customerEmail: string;
  customerName: string;
  expertId: string;
}

export interface PaymentRecord {
  id: string;
  consultation_id: string;
  stripe_payment_intent_id: string;
  stripe_payment_method_id: string;
  amount_charged: number;
  currency: string;
  stripe_status: string;
  processing_fee: number;
  platform_fee: number;
  expert_payout: number;
  stripe_fee: number;
  customer_email: string;
  customer_name: string;
  created_at: string;
}

/**
 * Creates a Stripe Payment Intent for the consultation
 * This is called when user clicks "Pay" button
 */
export async function createPaymentIntent(data: PaymentData): Promise<{
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  error?: string;
}> {
  try {
    // Convert amount to cents for Stripe
    const amountInCents = Math.round(data.amount * 100);

    // Create Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        consultationId: data.consultationId,
        expertId: data.expertId,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
      },
      description: `Consultation booking - ${data.customerName}`,
      receipt_email: data.customerEmail,
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create payment intent",
    };
  }
}

/**
 * Confirms the payment and stores payment record
 * This is called after Stripe confirms the payment
 */
export async function confirmPaymentAndStoreRecord(
  paymentIntentId: string,
  paymentMethodId: string
): Promise<{ success: boolean; data?: PaymentRecord; error?: string }> {
  try {
    // Retrieve payment intent from Stripe to get details
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return {
        success: false,
        error: `Payment not successful. Status: ${paymentIntent.status}`,
      };
    }

    // Extract metadata
    const consultationId = paymentIntent.metadata.consultationId;
    const customerEmail = paymentIntent.metadata.customerEmail;
    const customerName = paymentIntent.metadata.customerName;

    // Calculate fees
    const amountCharged = paymentIntent.amount / 100; // Convert from cents
    const stripeApplicationFee = paymentIntent.application_fee_amount
      ? paymentIntent.application_fee_amount / 100
      : 0;

    // Calculate Stripe processing fee (2.9% + $0.30)
    const stripeFee = Math.round((amountCharged * 0.029 + 0.3) * 100) / 100;

    // Get session price to calculate platform fee (using service role)
    const { data: consultation } = await supabaseServer
      .from("consultations")
      .select("price_amount")
      .eq("id", consultationId)
      .single();

    if (!consultation) {
      throw new Error("Consultation not found");
    }

    const sessionPrice = consultation.price_amount;
    const platformFee = Math.round(sessionPrice * 0.1 * 100) / 100; // 10%
    const expertPayout = sessionPrice - stripeFee; // Expert gets session price minus Stripe fee

    // Store payment record (using service role)
    const paymentData = {
      consultation_id: consultationId,
      stripe_payment_intent_id: paymentIntentId,
      stripe_payment_method_id: paymentMethodId,
      amount_charged: amountCharged,
      currency: "USD",
      stripe_status: paymentIntent.status,
      processing_fee: stripeFee,
      platform_fee: platformFee,
      expert_payout: expertPayout,
      stripe_fee: stripeFee,
      customer_email: customerEmail,
      customer_name: customerName,
    };

    const { data: paymentRecord, error: insertError } = await supabaseServer
      .from("consultation_payments")
      .insert(paymentData)
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to store payment record: ${insertError.message}`);
    }

    return {
      success: true,
      data: paymentRecord,
    };
  } catch (error) {
    console.error("Error confirming payment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to confirm payment",
    };
  }
}

/**
 * Processes a refund for a consultation
 */
export async function processRefund(
  consultationId: string,
  refundAmount?: number,
  reason?: string
): Promise<{ success: boolean; refundId?: string; error?: string }> {
  try {
    // Get payment record
    const { data: paymentRecord, error: fetchError } = await supabase
      .from("consultation_payments")
      .select("*")
      .eq("consultation_id", consultationId)
      .single();

    if (fetchError || !paymentRecord) {
      throw new Error("Payment record not found");
    }

    // Calculate refund amount (default to full amount)
    const refundAmountInCents = refundAmount
      ? Math.round(refundAmount * 100)
      : Math.round(paymentRecord.amount_charged * 100);

    // Create refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: paymentRecord.stripe_payment_intent_id,
      amount: refundAmountInCents,
      reason: "requested_by_customer",
      metadata: {
        consultationId: consultationId,
        reason: reason || "Consultation cancellation",
      },
    });

    // Update payment record with refund info
    const { error: updateError } = await supabase
      .from("consultation_payments")
      .update({
        refund_amount: refundAmountInCents / 100,
        refund_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq("consultation_id", consultationId);

    if (updateError) {
      console.error(
        "Failed to update payment record with refund:",
        updateError
      );
    }

    return {
      success: true,
      refundId: refund.id,
    };
  } catch (error) {
    console.error("Error processing refund:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to process refund",
    };
  }
}

/**
 * Gets payment record by consultation ID
 */
export async function getPaymentRecord(
  consultationId: string
): Promise<{ success: boolean; data?: PaymentRecord; error?: string }> {
  try {
    const { data: paymentRecord, error: fetchError } = await supabase
      .from("consultation_payments")
      .select("*")
      .eq("consultation_id", consultationId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch payment record: ${fetchError.message}`);
    }

    return {
      success: true,
      data: paymentRecord,
    };
  } catch (error) {
    console.error("Error fetching payment record:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch payment record",
    };
  }
}
