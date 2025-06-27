// components/expert/profile/expert-skills.tsx
"use client";

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpertSkillsProps {
  skills: string[];
  showHeader?: boolean;
  isFullSection?: boolean;
}

const ExpertSkills: React.FC<ExpertSkillsProps> = ({ 
  skills, 
  showHeader = true,
  isFullSection = false 
}) => {
  const [showAll, setShowAll] = useState(false);
  
  // Show first 5 skills, rest behind "more" toggle
  const visibleSkills = showAll || isFullSection ? skills : skills.slice(0, 5);
  const hiddenCount = skills.length - 5;
  
  if (skills.length === 0) {
    return (
      <div className={isFullSection ? "bg-white rounded-lg shadow-sm p-8" : ""}>
        {showHeader && (
          <h3 className={isFullSection ? "text-2xl font-bold text-gray-900 mb-8" : "text-xl font-bold text-gray-900 mb-4"}>
            Skills
          </h3>
        )}
        <p className="text-gray-500 text-sm">No skills listed yet.</p>
      </div>
    );
  }

  const content = (
    <>
      {showHeader && (
        <h3 className={isFullSection ? "text-2xl font-bold text-gray-900 mb-8" : "text-xl font-bold text-gray-900 mb-5"}>
          Skills
        </h3>
      )}
      
      <div className="space-y-4">
        {/* Skills Grid */}
        <div className="flex flex-wrap gap-3">
          {visibleSkills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className={
                isFullSection 
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 px-4 py-2.5 text-base font-semibold rounded-lg transition-all duration-200 hover:shadow-sm"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 text-base font-semibold border-0 rounded-md"
              }
            >
              {skill}
            </Badge>
          ))}
        </div>
        
        {/* Show More/Less Button - only for non-full sections */}
        {!isFullSection && skills.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-semibold text-sm"
          >
            {showAll ? (
              <span className="flex items-center gap-1">
                <ChevronUp className="w-4 h-4" />
                Show less
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <ChevronDown className="w-4 h-4" />
                + {hiddenCount} more
              </span>
            )}
          </Button>
        )}
      </div>
    </>
  );

  // Wrap in section container if it's a full section
  if (isFullSection) {
    return (
      <div id="skills-section" className="bg-white rounded-lg shadow-sm p-8 scroll-mt-8 border border-blue-100">
        <div className="border-l-4 border-blue-500 pl-6">
          {content}
        </div>
      </div>
    );
  }

  // Return unwrapped content for header usage
  return <div>{content}</div>;
};

export default ExpertSkills;