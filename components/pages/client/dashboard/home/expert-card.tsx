// components/pages/client/dashboard/home/expert-card.tsx
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { MockExpert } from './mock-data';

interface ExpertCardProps {
  expert: MockExpert;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  const renderStars = () => {
    const fullStars = Math.floor(expert.rating);
    const hasHalfStar = expert.rating % 1 !== 0;
    const stars = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    // Half star if needed
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-200" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    // Empty stars to make 5 total
    const remainingStars = 5 - Math.ceil(expert.rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-200" />
      );
    }

    return stars;
  };

  return (
    <Card className="w-full h-full border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <CardContent className="p-6 h-full flex flex-col">
        {/* Header with Avatar and Name */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <Image
              src={expert.profilePictureUrl}
              alt={`${expert.firstName} ${expert.lastName}`}
              width={56}
              height={56}
              className="rounded-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {expert.firstName} {expert.lastName}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              {expert.jobTitle}
            </p>
            
            {/* Rating */}
            <div className="flex items-center space-x-1">
              <div className="flex items-center space-x-0.5">
                {renderStars()}
              </div>
              <span className="text-sm text-gray-600 ml-1">
                ({expert.reviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
            {expert.bio}
          </p>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {expert.skills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 text-xs font-medium rounded-full border-0"
            >
              {skill}
            </Badge>
          ))}
        </div>

        {/* View Profile Button */}
        <div className="mt-auto">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 cursor-pointer"
            onClick={() => {
              // Navigate to expert profile page
              window.location.href = `/expert/${expert.id}`;
            }}
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;