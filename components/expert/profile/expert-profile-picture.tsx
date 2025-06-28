// components/expert/profile/expert-profile-picture.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

interface ExpertProfilePictureProps {
  profilePictureUrl: string;
  firstName: string;
  lastName: string;
  isMentojiChoice?: boolean;
}

export const ExpertProfilePicture: React.FC<ExpertProfilePictureProps> = ({
  profilePictureUrl,
  firstName,
  lastName,
  isMentojiChoice = false,
}) => {
  return (
    <div className="absolute left-85 transform bottom-72">
      <div className="relative">
        <Image
          src={profilePictureUrl}
          alt={`${firstName} ${lastName}`}
          width={200}
          height={200}
          className="rounded-full object-cover border-4 border-white shadow-lg"
        />
        {isMentojiChoice && (
          <div className="absolute top-16 left-60 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg whitespace-nowrap">
            <Sparkles className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            MentoJi's Choice
          </div>
        )}
      </div>
    </div>
  );
};