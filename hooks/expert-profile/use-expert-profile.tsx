// hooks/expert-profile/use-expert-profile.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/supabase/supabase-client';
import { Expert, ExpertProfileHookResult } from '@/components/expert/profile/types/expert';

export const useExpertProfile = (username: string): ExpertProfileHookResult => {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpert = useCallback(async () => {
    if (!username) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('experts')
        .select(`
          id,
          first_name,
          last_name,
          username,
          job_title,
          company,
          location,
          bio,
          profile_picture_url,
          mentoji_choice,
          linkedin_url,
          twitter_handle,
          personal_website,
          intro_video_link,
          featured_article_link,
          status,
          skills,
          created_at,
          updated_at
        `)
        .eq('username', username)
        .eq('status', 'approved')
        .single();

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          setError('Expert not found');
        } else {
          console.error('Supabase error:', supabaseError);
          setError('Failed to load expert profile');
        }
        setExpert(null);
        return;
      }

      if (!data) {
        setError('Expert not found');
        setExpert(null);
        return;
      }

      // Transform and validate the data
      const transformedExpert: Expert = {
        ...data,
        skills: Array.isArray(data.skills) ? data.skills : [],
        job_title: data.job_title || 'Professional Consultant',
        company: data.company || 'Independent',
      };

      setExpert(transformedExpert);
      setError(null);
    } catch (err) {
      console.error('Error fetching expert:', err);
      setError('An unexpected error occurred');
      setExpert(null);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const refetch = useCallback(async () => {
    await fetchExpert();
  }, [fetchExpert]);

  useEffect(() => {
    fetchExpert();
  }, [fetchExpert]);

  return {
    expert,
    loading,
    error,
    refetch,
  };
};

// Utility function for generating metadata
export const generateExpertMetadata = (expert: Expert | null) => {
  if (!expert) {
    return {
      title: 'Expert Not Found',
      description: 'The requested expert profile could not be found.',
    };
  }

  const displayJobTitle = expert.job_title || 'Professional Consultant';
  const displayCompany = expert.company || 'Independent';

  return {
    title: `${expert.first_name} ${expert.last_name} - MentoJi Expert`,
    description: expert.bio 
      ? `${expert.bio.slice(0, 155)}...`
      : `Connect with ${expert.first_name} ${expert.last_name}, ${displayJobTitle} at ${displayCompany}, for professional consultation on MentoJi.`,
    openGraph: {
      title: `${expert.first_name} ${expert.last_name} - MentoJi Expert`,
      description: expert.bio 
        ? `${expert.bio.slice(0, 155)}...`
        : `Professional consultation with ${expert.first_name} ${expert.last_name}`,
      images: [expert.profile_picture_url],
    },
  };
};