// app/expert/[username]/page.tsx
"use client";

import { notFound } from 'next/navigation';
import { useExpertProfile } from '@/hooks/expert-profile/use-expert-profile';
import ExpertProfileLayout from '@/components/expert/profile/expert-profile-layout';

interface ExpertProfilePageProps {
  params: {
    username: string;
  };
}

export default function ExpertProfilePage({ params }: ExpertProfilePageProps) {
  const { username } = params;
  const { expert, loading, error, refetch } = useExpertProfile(username);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading expert profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Expert Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={refetch}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
            <a
              href="/browse-experts"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Other Experts
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Expert not found (different from error)
  if (!expert) {
    notFound();
  }

  // Success state
  return <ExpertProfileLayout expert={expert} />;
}