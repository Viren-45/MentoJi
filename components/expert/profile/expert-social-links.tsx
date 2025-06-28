// components/expert/profile/expert-social-links.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Linkedin, Twitter } from 'lucide-react';

interface ExpertSocialLinksProps {
  linkedinUrl?: string | null;
  twitterHandle?: string | null;
}

export const ExpertSocialLinks: React.FC<ExpertSocialLinksProps> = ({
  linkedinUrl,
  twitterHandle,
}) => {
  if (!linkedinUrl && !twitterHandle) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      {linkedinUrl && (
        <Link 
          href={linkedinUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
        >
          <Linkedin className="w-5 h-5 text-blue-600" />
        </Link>
      )}
      {twitterHandle && (
        <Link 
          href={`https://twitter.com/${twitterHandle}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
        >
          <Twitter className="w-5 h-5 text-blue-400" />
        </Link>
      )}
    </div>
  );
};