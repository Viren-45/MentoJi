// app/api/expert/check-username/route.ts
import { NextRequest, NextResponse } from "next/server";
import { checkUsernameAvailability } from "@/lib/expert/apply";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    const result = await checkUsernameAvailability(username);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { available: false, error: "Error checking username" },
      { status: 500 }
    );
  }
}
