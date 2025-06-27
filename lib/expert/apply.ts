// lib/expert/apply.ts
import supabase from "@/lib/supabase/supabase-server";
import { CompleteApplicationFormData } from "@/lib/validations/expert/expert-application";

export interface ExpertApplicationResult {
  success: boolean;
  error?: string;
  applicationId?: string;
}

export async function submitExpertApplication(
  data: CompleteApplicationFormData
): Promise<ExpertApplicationResult> {
  try {
    // First, upload profile picture if provided
    let profilePictureUrl = null;
    if (data.profilePhoto) {
      const uploadResult = await uploadProfilePicture(
        data.profilePhoto,
        data.username
      );
      if (!uploadResult.success) {
        return {
          success: false,
          error: uploadResult.error || "Failed to upload profile picture",
        };
      }
      profilePictureUrl = uploadResult.url;
    }

    // Prepare expert data for database insertion (NO PASSWORD)
    const expertData = {
      // Basic info (No password field)
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      username: data.username,
      user_type: "expert",

      // Professional info
      job_title: data.jobTitle,
      company: data.company || null,
      location: data.location,
      category: data.category === "Other" ? data.customCategory : data.category,
      skills: data.skills,
      bio: data.bio,

      // Social links
      linkedin_url: data.linkedinUrl || null,
      personal_website: data.personalWebsite || null,
      twitter_handle: data.twitterHandle || null,

      // Additional details
      intro_video_link: data.introVideoLink || null,
      featured_article_link: data.featuredArticleLink || null,
      motivation_text: data.motivation,
      greatest_achievement_text: data.greatestAchievement,

      // System fields
      profile_picture_url:
        profilePictureUrl || "https://via.placeholder.com/150",
      status: "pending",
      mentoji_choice: false,
      auth_user_id: null, // Will be set when approved
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert into experts table
    const { data: insertedData, error } = await supabase
      .from("experts")
      .insert([expertData])
      .select("id")
      .single();

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }

    return {
      success: true,
      applicationId: insertedData.id,
    };
  } catch (error: any) {
    console.error("Expert application submission error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Helper function to upload profile picture
async function uploadProfilePicture(
  file: File,
  username: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${username}-${Date.now()}.${fileExt}`;
    const filePath = `expert-profiles/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, file);

    if (uploadError) {
      return {
        success: false,
        error: `Upload failed: ${uploadError.message}`,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      error: `File upload error: ${error.message}`,
    };
  }
}

// Helper function to format error messages
function getErrorMessage(error: any): string {
  if (error.code === "23505") {
    if (error.constraint?.includes("username")) {
      return "This username is already taken. Please choose a different one.";
    }
    if (error.constraint?.includes("email")) {
      return "An account with this email already exists.";
    }
    return "Some information you provided is already in use. Please check and try again.";
  }

  if (error.code === "23514") {
    return "Invalid data provided. Please check your information and try again.";
  }

  return error.message || "An unexpected error occurred. Please try again.";
}

// Function to check username availability
export async function checkUsernameAvailability(
  username: string
): Promise<{ available: boolean; error?: string }> {
  try {
    if (username.length < 3) {
      return {
        available: false,
        error: "Username must be at least 3 characters",
      };
    }

    const { data, error } = await supabase
      .from("experts")
      .select("username")
      .eq("username", username)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows found
      return {
        available: false,
        error: "Error checking username availability",
      };
    }

    return { available: !data }; // Available if no data found
  } catch (error: any) {
    return { available: false, error: "Error checking username availability" };
  }
}

// Function to check email availability
export async function checkEmailAvailability(
  email: string
): Promise<{ available: boolean; error?: string }> {
  try {
    if (!email) {
      return { available: false, error: "Email is required" };
    }

    // Check experts table
    const { data: expertData, error: expertError } = await supabase
      .from("experts")
      .select("email, status")
      .eq("email", email)
      .single();

    if (expertError && expertError.code !== "PGRST116") {
      return { available: false, error: "Error checking email availability" };
    }

    if (expertData) {
      if (expertData.status === "approved") {
        return {
          available: false,
          error: "Email already registered as an expert. Try to login instead.",
        };
      } else {
        return {
          available: false,
          error:
            "Expert application already submitted with this email. Please wait for approval or contact support.",
        };
      }
    }

    // Check clients table
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("email")
      .eq("email", email)
      .single();

    if (clientError && clientError.code !== "PGRST116") {
      return { available: false, error: "Error checking email availability" };
    }

    if (clientData) {
      return {
        available: false,
        error: "Email already registered as a client. Try different email.",
      };
    }

    return { available: true };
  } catch (error: any) {
    return { available: false, error: "Error checking email availability" };
  }
}
