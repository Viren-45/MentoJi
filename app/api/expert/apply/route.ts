// app/api/expert/apply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { submitExpertApplication } from "@/lib/expert/apply";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Convert FormData to your expected format (NO PASSWORD)
    const data = {
      profilePhoto: formData.get("profilePhoto") as File,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      jobTitle: formData.get("jobTitle") as string,
      company: (formData.get("company") as string) || "",
      location: formData.get("location") as string,
      category: formData.get("category") as string,
      customCategory: (formData.get("customCategory") as string) || "",
      skills: JSON.parse((formData.get("skills") as string) || "[]"),
      bio: formData.get("bio") as string,
      linkedinUrl: (formData.get("linkedinUrl") as string) || "",
      personalWebsite: (formData.get("personalWebsite") as string) || "",
      twitterHandle: (formData.get("twitterHandle") as string) || "",
      introVideoLink: (formData.get("introVideoLink") as string) || "",
      featuredArticleLink:
        (formData.get("featuredArticleLink") as string) || "",
      motivation: formData.get("motivation") as string,
      greatestAchievement: formData.get("greatestAchievement") as string,
    };

    // Validate required fields (NO PASSWORD)
    if (
      !data.profilePhoto ||
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.username ||
      !data.jobTitle ||
      !data.location
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await submitExpertApplication(data);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error: " + error.message },
      { status: 500 }
    );
  }
}
