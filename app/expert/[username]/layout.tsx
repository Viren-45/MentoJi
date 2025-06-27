// app/expert/[username]/layout.tsx
import { Metadata } from 'next';
import supabase from '@/lib/supabase/supabase-client';

interface ExpertLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: ExpertLayoutProps): Promise<Metadata> {
  const { username } = await params;

  try {
    const { data: expert } = await supabase
      .from('experts')
      .select('first_name, last_name, job_title, company, bio, profile_picture_url')
      .eq('username', username)
      .eq('status', 'approved')
      .single();

    if (!expert) {
      return {
        title: 'Expert Not Found | MentoJi',
        description: 'Expert profile not found.',
      };
    }

    const fullName = `${expert.first_name} ${expert.last_name}`;
    const jobTitle = expert.job_title || 'Professional Consultant';
    
    return {
      title: `${fullName} - ${jobTitle} | MentoJi`,
      description: expert.bio?.slice(0, 155) || `Book a consultation with ${fullName} on MentoJi.`,
      openGraph: {
        title: `${fullName} - MentoJi Expert`,
        description: expert.bio?.slice(0, 155) || `Professional consultation with ${fullName}`,
        images: [expert.profile_picture_url],
      },
    };
  } catch (error) {
    return {
      title: 'Expert Profile | MentoJi',
      description: 'Expert consultation platform',
    };
  }
}

export default function ExpertLayout({ children }: ExpertLayoutProps) {
  return <>{children}</>;
}