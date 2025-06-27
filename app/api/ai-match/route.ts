// app/api/ai-match/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, isInitial } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // If it's the initial message, just return the first AI response
    if (isInitial) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 150,
        temperature: 0.5,
      });

      const aiMessage =
        response.choices[0]?.message?.content ||
        "Hey there! I'd love to help you find the right expert. Can I ask you a few quick questions to get a better idea of what you need help with?";

      return NextResponse.json({
        message: aiMessage,
        usage: response.usage,
      });
    }

    // For regular conversation
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiMessage =
      response.choices[0]?.message?.content ||
      "I'm sorry, I didn't understand that. Could you please rephrase?";

    return NextResponse.json({
      message: aiMessage,
      usage: response.usage,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);

    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          error: "AI service error",
          details: error.message,
        },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
