// lib/browse-experts/expert-service.ts
import supabase from "@/lib/supabase/supabase-client";

export interface ExpertWithSettings {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  job_title: string | null;
  company: string | null;
  bio: string | null;
  skills: string[];
  profile_picture_url: string;
  mentoji_choice: boolean;
  calendar_connected: boolean;
  session_duration_minutes: number | null;
  session_price: number | null;
}

export async function getExperts(): Promise<ExpertWithSettings[]> {
  const { data, error } = await supabase
    .from("experts_with_settings")
    .select("*");

  if (error) {
    console.error("Error fetching experts:", error);
    throw error;
  }

  return (data || []).map((expert: any) => ({
    ...expert,
    skills: Array.isArray(expert.skills) ? expert.skills : [],
  }));
}
