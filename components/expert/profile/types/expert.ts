// components/expert/profile/types/expert.ts

export interface Expert {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  job_title: string;
  company: string;
  location: string | null;
  bio: string | null;
  profile_picture_url: string;
  mentoji_choice: boolean;
  linkedin_url: string | null;
  twitter_handle: string | null;
  personal_website: string | null;
  intro_video_link: string | null;
  featured_article_link: string | null;
  status: string;
  skills: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface ExpertProfileHookResult {
  expert: Expert | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface ExpertMetadata {
  title: string;
  description: string;
  openGraph?: {
    title: string;
    description: string;
    images: string[];
  };
}
