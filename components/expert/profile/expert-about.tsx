// components/expert/profile/expert-about.tsx
"use client";

import React from 'react';

interface ExpertAboutProps {
  bio: string | null;
  firstName: string;
}

const ExpertAbout: React.FC<ExpertAboutProps> = ({ bio, firstName }) => {
  if (!bio) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>
        <div className="text-gray-500 text-center py-8">
          <p>{firstName} hasn't added their bio yet.</p>
        </div>
      </div>
    );
  }

  // Split bio into paragraphs for better formatting
  const paragraphs = bio.split('\n').filter(paragraph => paragraph.trim() !== '');

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>
      
      <div className="prose prose-gray max-w-none">
        {paragraphs.map((paragraph, index) => (
          <p 
            key={index} 
            className="text-gray-700 leading-tight mb-4 last:mb-0 text-lg"
          >
            {paragraph.trim()}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ExpertAbout;