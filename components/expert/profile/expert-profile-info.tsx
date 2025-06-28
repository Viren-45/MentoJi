// components/expert/profile/expert-profile-info.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Twitter, MapPin, Star, Home } from 'lucide-react';

interface ExpertProfileInfoProps {
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

export const ExpertProfileInfo: React.FC<ExpertProfileInfoProps> = ({
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
    <div className="flex-1">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Image
              src={profilePictureUrl}
              alt={`${firstName} ${lastName}`}
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-white shadow-lg"
            />
            {isMentojiChoice && (
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                Choice
              </div>
            )}
          </div>
        </div>

        {/* Expert Info */}
        <div className="flex-1 space-y-3">
          {/* Name and Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {firstName} {lastName}
            </h1>
            <p className="text-xl text-gray-600 mt-1">
              {jobTitle} at {company}
            </p>
          </div>

          {/* Location */}
          {location && (
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{location}</span>
            </div>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
              <Home className="w-5 h-5" />
            </Link>
            
            {linkedinUrl && (
              <Link 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            )}
            
            {twitterHandle && (
              <Link 
                href={`https://twitter.com/${twitterHandle}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 6).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  {skill}
                </Badge>
              ))}
              {skills.length > 6 && (
                <Badge variant="outline" className="text-gray-500">
                  +{skills.length - 6} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};