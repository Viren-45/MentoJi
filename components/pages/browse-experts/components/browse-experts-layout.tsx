// components/pages/browse-experts/components/browse-experts-layout.tsx
"use client";

import React, { useMemo, useState } from 'react';
import HeroSection from './hero-section';
import SortFiltersBar from './sort-filters-bar';
import FiltersPanel from './filters-panel';
import ExpertCardsGrid from './expert-cards-grid';
import { useExperts } from '@/hooks/browse-experts/use-experts';
import { ExpertWithSettings } from '@/lib/browse-experts/expert-service';

// Interface for frontend expert display
export interface BrowseExpert {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  bio: string;
  skills: string[];
  profilePictureUrl: string;
  rating: number;
  reviewCount: number;
  rate: number;
  sessionLength: number;
  isFree: boolean;
  availableToday: boolean;
  category?: string;
  company?: string;
  location?: string;
  mentojiChoice: boolean;
}

// Transform backend expert data to frontend BrowseExpert interface
const transformExpertData = (expert: ExpertWithSettings): BrowseExpert => {
  const sessionPrice = expert.session_price || 0;
  const sessionDuration = expert.session_duration_minutes || 30;
  
  return {
    id: expert.id,
    username: expert.username,
    firstName: expert.first_name,
    lastName: expert.last_name,
    jobTitle: `${expert.job_title || 'Professional Consultant'}${expert.company ? ` @ ${expert.company}` : ''}`,
    bio: expert.bio || 'Experienced professional ready to help with your challenges.',
    skills: expert.skills || [],
    profilePictureUrl: expert.profile_picture_url || '/placeholder-avatar.png',
    rating: 4.8, // TODO: Calculate from reviews when review system is implemented
    reviewCount: Math.floor(Math.random() * 200) + 50, // TODO: Get actual review count
    rate: sessionPrice,
    sessionLength: sessionDuration,
    isFree: sessionPrice === 0,
    availableToday: expert.calendar_connected,
    company: expert.company || undefined,
    mentojiChoice: expert.mentoji_choice,
  };
};

const BrowseExpertsLayout = () => {
  const { experts: backendExperts, loading, error } = useExperts();
  const [sortValue, setSortValue] = useState('relevance');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Transform backend data to frontend format
  const experts: BrowseExpert[] = useMemo(() => {
    return backendExperts.map(transformExpertData);
  }, [backendExperts]);

  const handleSortChange = (value: string) => {
    setSortValue(value);
    // TODO: Implement sorting
  };

  const handleToggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeroSection 
          onAIMatch={() => console.log('AI Match clicked')} 
          onSearch={() => console.log('Search clicked')} 
        />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Experts
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection 
        onAIMatch={() => console.log('AI Match clicked')} 
        onSearch={() => console.log('Search clicked')} 
      />

      {/* Sort & Filters Bar */}
      <SortFiltersBar
        sortValue={sortValue}
        onSortChange={handleSortChange}
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={handleToggleFilters}
        resultsCount={experts.length}
      />

      {/* Collapsible Filters Panel */}
      <FiltersPanel
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />

      {/* Expert Cards Grid */}
      <ExpertCardsGrid
        experts={experts}
        loading={loading}
        error={error}
        onRetry={() => window.location.reload()}
      />
    </div>
  );
};

export default BrowseExpertsLayout;