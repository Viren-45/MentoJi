// components/expert/profile/expert-header.tsx
"use client";

import React from 'react';
import { ExpertBreadcrumbs } from './expert-breadcrumbs';
import { ExpertSocialLinks } from './expert-social-links';
import { ExpertProfileCard } from './expert-profile-card';
import { ExpertProfilePicture } from './expert-profile-picture';

interface ExpertHeaderProps {
  expertId: string;
  username: string;
  profilePictureUrl: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  location?: string | null;
  skills?: string[];
  isMentojiChoice?: boolean;
  linkedinUrl?: string | null;
  twitterHandle?: string | null;
}

const ExpertHeader: React.FC<ExpertHeaderProps> = ({
  expertId,
  username,
  profilePictureUrl,
  firstName,
  lastName,
  jobTitle,
  company,
  location,
  skills = [],
  isMentojiChoice = false,
  linkedinUrl,
  twitterHandle,
}) => {
  return (
    <>
      <div className="relative">
        {/* Blue Gradient Background */}
        <div className="bg-blue-900 px-6 py-16" style={{ height: '300px' }}>
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <ExpertBreadcrumbs 
              firstName={firstName} 
              lastName={lastName} 
            />

            {/* Social Links - Top Right */}
            <div className="py-28">
              <div className="max-w-7xl mx-auto flex justify-end">
                <ExpertSocialLinks 
                  linkedinUrl={linkedinUrl}
                  twitterHandle={twitterHandle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Picture positioned in blue section */}
        <ExpertProfilePicture
          profilePictureUrl={profilePictureUrl}
          firstName={firstName}
          lastName={lastName}
          isMentojiChoice={isMentojiChoice}
        />

        {/* Expert Profile Card */}
        <ExpertProfileCard
          username={username}
          expertId={expertId}
          firstName={firstName}
          lastName={lastName}
          jobTitle={jobTitle}
          company={company}
          location={location}
          skills={skills}
        />
      </div>
    </>
  );
};

export default ExpertHeader;