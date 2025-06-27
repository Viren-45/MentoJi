// components/expert/profile/expert-profile-layout.tsx
"use client";

import React from 'react';
import { Expert } from './types/expert';
import ExpertHeader from './expert-header';
import ExpertAbout from './expert-about';
import ExpertReviews from './expert-reviews';
import ExpertShowcase from './expert-showcase';
import ExpertSkills from './expert-skills';
import SimilarExperts from './similar-experts';

interface ExpertProfileLayoutProps {
  expert: Expert;
}

const ExpertProfileLayout: React.FC<ExpertProfileLayoutProps> = ({ expert }) => {
  // Parse skills from JSONB format or provide fallback
  const expertSkills = expert.skills || [];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Expert Header - Contains blue background, profile, and info */}
      <ExpertHeader
        expertId={expert.id}
        profilePictureUrl={expert.profile_picture_url}
        firstName={expert.first_name}
        lastName={expert.last_name}
        jobTitle={expert.job_title || 'Professional Consultant'}
        company={expert.company || 'Independent'}
        location={expert.location}
        skills={expertSkills}
        isMentojiChoice={expert.mentoji_choice}
        linkedinUrl={expert.linkedin_url}
        twitterHandle={expert.twitter_handle}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* About Section */}
          <ExpertAbout 
            bio={expert.bio}
            firstName={expert.first_name}
          />
          
          {/* Reviews Section */}
          <ExpertReviews 
            expertFirstName={expert.first_name}
          />
          
          {/* Showcase Section */}
          <ExpertShowcase 
            firstName={expert.first_name}
            personalWebsite={expert.personal_website}
            introVideoLink={expert.intro_video_link}
            featuredArticleLink={expert.featured_article_link}
          />
          
          {/* Skills Section - Full skills display with scroll target */}
          <ExpertSkills 
            skills={expertSkills}
            isFullSection={true}
          />
          
          {/* Similar Experts Section */}
          <SimilarExperts 
            currentExpertId={expert.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpertProfileLayout;