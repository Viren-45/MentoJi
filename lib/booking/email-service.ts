// lib/booking/email-service.ts
"use server";

import { Resend } from "resend";

// Initialize Resend (you'll need to install 'resend' package)
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  consultationId: string;
  expertName: string;
  expertEmail?: string;
  clientName: string;
  clientEmail: string;
  sessionDateTime: string;
  duration: number;
  meetingUrl: string;
  sessionPrice: number;
  questionnaire?: any;
}

/**
 * Generates calendar invite (.ics) content
 */
function generateCalendarInvite(data: EmailData): string {
  const startDate = new Date(data.sessionDateTime);
  const endDate = new Date(startDate.getTime() + data.duration * 60000);

  // Format dates for ICS (YYYYMMDDTHHMMSSZ)
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MentoJi//Consultation Booking//EN
BEGIN:VEVENT
UID:consultation-${data.consultationId}@mentoji.com
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Consultation with ${data.expertName}
DESCRIPTION:You have a consultation session with ${
    data.expertName
  }.\\n\\nJoin the meeting: ${data.meetingUrl}\\n\\nDuration: ${
    data.duration
  } minutes\\nPrice: $${data.sessionPrice}
LOCATION:${data.meetingUrl}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:Reminder: Consultation with ${data.expertName} starts in 15 minutes
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}

/**
 * Sends confirmation email to client
 */
export async function sendClientConfirmationEmail(
  data: EmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    const sessionDate = new Date(data.sessionDateTime).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const sessionTime = new Date(data.sessionDateTime).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );

    // Generate calendar invite
    const calendarInvite = generateCalendarInvite(data);

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Your Consultation is Confirmed</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
            .session-details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .meeting-button { 
                display: inline-block; 
                background: #2563eb; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 6px; 
                font-weight: bold;
                margin: 15px 0;
            }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Your Consultation is Confirmed!</h1>
            </div>
            <div class="content">
                <p>Hi ${data.clientName},</p>
                
                <p>Great news! Your consultation with <strong>${
                  data.expertName
                }</strong> has been confirmed and paid for.</p>
                
                <div class="session-details">
                    <h3>📅 Session Details</h3>
                    <p><strong>Date:</strong> ${sessionDate}</p>
                    <p><strong>Time:</strong> ${sessionTime}</p>
                    <p><strong>Duration:</strong> ${data.duration} minutes</p>
                    <p><strong>Price:</strong> $${data.sessionPrice}</p>
                </div>

                <div style="text-align: center;">
                    <a href="${data.meetingUrl}" class="meeting-button">
                        🎥 Join Meeting
                    </a>
                </div>

                <div class="session-details">
                    <h3>📝 What's Next?</h3>
                    <ul>
                        <li>A calendar invite has been attached to this email</li>
                        <li>You'll receive a reminder 15 minutes before the session</li>
                        <li>Use the "Join Meeting" button above when it's time</li>
                        <li>The expert has your preparation notes and is ready to help</li>
                    </ul>
                </div>

                ${
                  data.questionnaire &&
                  Object.values(data.questionnaire).some((v: any) => v?.trim())
                    ? `
                <div class="session-details">
                    <h3>📋 Your Preparation Notes</h3>
                    <p>These have been shared with ${
                      data.expertName
                    } to help them prepare:</p>
                    ${Object.entries(data.questionnaire)
                      .map(([key, value]: [string, any]) =>
                        value?.trim()
                          ? `<p><strong>•</strong> ${value}</p>`
                          : ""
                      )
                      .join("")}
                </div>
                `
                    : ""
                }

                <div class="session-details">
                    <h3>❓ Need Help?</h3>
                    <p>If you need to reschedule or have any questions, please contact our support team or reply to this email.</p>
                    <p><strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before your session.</p>
                </div>

                <p>We're excited for your session with ${data.expertName}!</p>
                
                <p>Best regards,<br>The MentoJi Team</p>
            </div>
            <div class="footer">
                <p>© 2025 MentoJi. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Send email with calendar attachment
    const { data: emailResult, error } = await resend.emails.send({
      from: "MentoJi <bookings@mentoji.com>",
      to: [data.clientEmail],
      subject: `✅ Consultation Confirmed - ${data.expertName} on ${sessionDate}`,
      html: emailHtml,
      attachments: [
        {
          filename: "consultation.ics",
          content: Buffer.from(calendarInvite),
          contentType: "text/calendar",
        },
      ],
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log("Client confirmation email sent:", emailResult?.id);
    return { success: true };
  } catch (error) {
    console.error("Error sending client confirmation email:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to send confirmation email",
    };
  }
}

/**
 * Sends notification email to expert
 */
export async function sendExpertNotificationEmail(
  data: EmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data.expertEmail) {
      return {
        success: false,
        error: "Expert email not provided",
      };
    }

    const sessionDate = new Date(data.sessionDateTime).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const sessionTime = new Date(data.sessionDateTime).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );

    // Generate calendar invite for expert too
    const calendarInvite = generateCalendarInvite(data);

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Consultation Booking</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f0fdf4; padding: 20px; border-radius: 0 0 8px 8px; }
            .session-details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .meeting-button { 
                display: inline-block; 
                background: #059669; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 6px; 
                font-weight: bold;
                margin: 15px 0;
            }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💼 New Consultation Booked!</h1>
            </div>
            <div class="content">
                <p>Hi ${data.expertName},</p>
                
                <p>You have a new consultation booking with <strong>${
                  data.clientName
                }</strong>.</p>
                
                <div class="session-details">
                    <h3>📅 Session Details</h3>
                    <p><strong>Client:</strong> ${data.clientName}</p>
                    <p><strong>Date:</strong> ${sessionDate}</p>
                    <p><strong>Time:</strong> ${sessionTime}</p>
                    <p><strong>Duration:</strong> ${data.duration} minutes</p>
                    <p><strong>Earnings:</strong> $${
                      data.sessionPrice
                    } (after fees)</p>
                </div>

                <div style="text-align: center;">
                    <a href="${data.meetingUrl}" class="meeting-button">
                        🎥 Join Meeting Room
                    </a>
                </div>

                ${
                  data.questionnaire &&
                  Object.values(data.questionnaire).some((v: any) => v?.trim())
                    ? `
                <div class="session-details">
                    <h3>📝 Client's Preparation Notes</h3>
                    <p>The client provided these details to help you prepare:</p>
                    ${Object.entries(data.questionnaire)
                      .map(([key, value]: [string, any]) =>
                        value?.trim()
                          ? `<p><strong>•</strong> ${value}</p>`
                          : ""
                      )
                      .join("")}
                </div>
                `
                    : `
                <div class="session-details">
                    <h3>📝 Client's Preparation Notes</h3>
                    <p>The client didn't provide preparation notes, but you can still have a great session by asking about their goals and challenges.</p>
                </div>
                `
                }

                <div class="session-details">
                    <h3>🎯 Session Tips</h3>
                    <ul>
                        <li>Join the meeting room 2-3 minutes early</li>
                        <li>Review the client's notes beforehand</li>
                        <li>The session will be automatically recorded (if enabled)</li>
                        <li>Focus on providing actionable advice</li>
                    </ul>
                </div>

                <p>Looking forward to a successful session!</p>
                
                <p>Best regards,<br>The MentoJi Team</p>
            </div>
            <div class="footer">
                <p>© 2025 MentoJi. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Send email with calendar attachment
    const { data: emailResult, error } = await resend.emails.send({
      from: "MentoJi <bookings@mentoji.com>",
      to: [data.expertEmail],
      subject: `💼 New Booking - ${data.clientName} on ${sessionDate}`,
      html: emailHtml,
      attachments: [
        {
          filename: "consultation.ics",
          content: Buffer.from(calendarInvite),
          contentType: "text/calendar",
        },
      ],
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log("Expert notification email sent:", emailResult?.id);
    return { success: true };
  } catch (error) {
    console.error("Error sending expert notification email:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to send expert notification email",
    };
  }
}

/**
 * Sends reminder email before session (can be called by cron job)
 */
export async function sendSessionReminderEmail(
  data: EmailData,
  minutesBefore: number = 15
): Promise<{ success: boolean; error?: string }> {
  try {
    const sessionTime = new Date(data.sessionDateTime).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Session Reminder</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #fffbeb; padding: 20px; border-radius: 0 0 8px 8px; }
            .meeting-button { 
                display: inline-block; 
                background: #f59e0b; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 6px; 
                font-weight: bold;
                margin: 15px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⏰ Session Starting Soon!</h1>
            </div>
            <div class="content">
                <p>Hi ${data.clientName},</p>
                
                <p>Your consultation with <strong>${data.expertName}</strong> starts in ${minutesBefore} minutes at ${sessionTime}.</p>

                <div style="text-align: center;">
                    <a href="${data.meetingUrl}" class="meeting-button">
                        🎥 Join Meeting Now
                    </a>
                </div>

                <p><strong>Tips for a great session:</strong></p>
                <ul>
                    <li>Join a few minutes early to test your connection</li>
                    <li>Find a quiet space with good lighting</li>
                    <li>Have any questions or materials ready</li>
                </ul>

                <p>See you soon!</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const { data: emailResult, error } = await resend.emails.send({
      from: "MentoJi <bookings@mentoji.com>",
      to: [data.clientEmail],
      subject: `⏰ Starting Soon - Your session with ${data.expertName}`,
      html: emailHtml,
    });

    if (error) {
      throw new Error(`Failed to send reminder: ${error.message}`);
    }

    console.log("Reminder email sent:", emailResult?.id);
    return { success: true };
  } catch (error) {
    console.error("Error sending reminder email:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to send reminder email",
    };
  }
}
