// app/booking/[username]/page.tsx
import { notFound } from 'next/navigation';
import supabase from '@/lib/supabase/supabase-client';
import BookingLayout from '@/components/booking/booking-layout';

// Updated interface for Next.js 15 - params is now a Promise
interface BookingPageProps {
  params: Promise<{
    username: string;
  }>;
}

// Get expert data by username
async function getExpertByUsername(username: string) {
  const { data: expert, error } = await supabase
    .from('experts')
    .select(`
      id,
      first_name,
      last_name,
      username,
      job_title,
      company,
      profile_picture_url,
      status
    `)
    .eq('username', username)
    .eq('status', 'approved')
    .single();

  if (error || !expert) {
    return null;
  }

  return expert;
}

export default async function BookingPage({ params }: BookingPageProps) {
  // Await the params Promise in Next.js 15
  const { username } = await params;
  
  const expert = await getExpertByUsername(username);

  if (!expert) {
    notFound();
  }

  return (
    <BookingLayout
      expertId={expert.id}
      expertName={`${expert.first_name} ${expert.last_name}`}
      expertUsername={expert.username}
      expertJobTitle={expert.job_title}
      expertCompany={expert.company}
      expertProfilePicture={expert.profile_picture_url}
    />
  );
}