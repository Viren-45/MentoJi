import { NextRequest, NextResponse } from "next/server";
import { checkEmailAvailability } from "@/lib/expert/apply";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const result = await checkEmailAvailability(email);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { available: false, error: "Error checking email" },
      { status: 500 }
    );
  }
}
