// components/pages/browse-experts/components/expert-card.tsx
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { BrowseExpert } from './browse-experts-layout';
import { useRouter } from 'next/navigation';

interface ExpertCardProps {
  expert: BrowseExpert;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
    const router = useRouter();
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

  const formatRate = () => {
    if (expert.isFree) {
      return 'Free';
    }
    return `$${expert.rate} /${expert.sessionLength} mins`;
  };

  const handleViewProfile = () => {
    // Navigate to expert profile page
    router.push(`/expert/${expert.username}`);
  };

  return (
    <Card className="w-full h-full border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white relative">
      {/* MentoJi's Choice Badge */}
      {expert.mentojiChoice && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-3 py-1 text-xs rounded-full shadow-lg border-0">
            ⭐ MentoJi's Choice
          </Badge>
        </div>
      )}
      
      <CardContent className="pl-6 pr-6 h-full flex flex-col">
        {/* Header with Avatar and Name */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative w-[180px] h-[250px] flex-shrink-0">
            <Image
              src={expert.profilePictureUrl}
              alt={`${expert.firstName} ${expert.lastName}`}
              fill
              className="rounded-lg object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-avatar.png';
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {expert.firstName} {expert.lastName}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
              {expert.jobTitle}
            </p>

            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
              {expert.bio}
            </p>
            
            {/* Rating */}
            <div className="flex items-center space-x-1 mt-4">
              <div className="flex items-center space-x-0.5">
                {renderStars()}
              </div>
              <span className="text-sm text-gray-600 ml-1">
                ({expert.reviewCount})
              </span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {expert.skills.slice(0, 3).map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 text-xs font-medium rounded-full border-0"
                >
                  {skill}
                </Badge>
              ))}
              {expert.skills.length > 3 && (
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-600 px-3 py-1 text-xs font-medium rounded-full border-0"
                >
                  +{expert.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Button and Price */}
        <div className="mt-auto flex items-center justify-between">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-14 rounded-lg transition-colors duration-200"
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
          
          {/* Price */}
          <span className="text-black font-bold text-lg">
            {formatRate()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;