// components/expert/profile/similar-experts.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface SimilarExpert {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  jobTitle: string;
  company: string;
  profilePicture: string;
  rating: number;
  reviewCount: number;
  price: number;
  duration: number; // in minutes
  skills: string[];
  isMentojiChoice?: boolean;
}

interface SimilarExpertsProps {
  currentExpertId: string;
}

const SimilarExperts: React.FC<SimilarExpertsProps> = ({ currentExpertId }) => {
  // Mock data for similar experts
  const similarExperts: SimilarExpert[] = [
    {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Chen',
      username: 'sarah-chen',
      jobTitle: 'Senior UX Researcher',
      company: 'Google',
      profilePicture: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=face',
      rating: 4.9,
      reviewCount: 15,
      price: 75,
      duration: 45,
      skills: ['UX Research', 'User Testing', 'Design Strategy', 'Figma', 'Analytics'],
      isMentojiChoice: true
    },
    {
      id: '2',
      firstName: 'Marcus',
      lastName: 'Johnson',
      username: 'marcus-johnson',
      jobTitle: 'Lead Software Engineer',
      company: 'Netflix',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      rating: 4.8,
      reviewCount: 23,
      price: 60,
      duration: 30,
      skills: ['React', 'Node.js', 'System Design', 'AWS', 'Leadership'],
      isMentojiChoice: false
    },
    {
      id: '3',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      username: 'emily-rodriguez',
      jobTitle: 'Product Manager',
      company: 'Stripe',
      profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      rating: 5.0,
      reviewCount: 31,
      price: 90,
      duration: 60,
      skills: ['Product Strategy', 'Analytics', 'Roadmapping', 'Stakeholder Management'],
      isMentojiChoice: false
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar mentors</h2>
      
      <div className="space-y-6">
        {similarExperts.map((expert) => (
          <Link
            key={expert.id}
            href={`/expert/${expert.username}`}
            className="block group"
          >
            <div className="flex items-start gap-6 p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group-hover:bg-blue-50/30">
              {/* Profile Picture */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-white shadow-md">
                  <Image
                    src={expert.profilePicture}
                    alt={`${expert.firstName} ${expert.lastName}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                {expert.isMentojiChoice && (
                  <div className="absolute -top-1 -right-1">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-2 py-1 text-xs rounded-full shadow-md border-0">
                      ⭐
                    </Badge>
                  </div>
                )}
              </div>

              {/* Expert Info */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {expert.firstName} {expert.lastName}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">
                          {expert.rating}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({expert.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-700 mb-3">
                      {expert.jobTitle} @ {expert.company}
                    </p>
                  </div>
                  
                  {/* Pricing */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-gray-900">
                      ${expert.price}
                      <span className="text-sm font-medium text-gray-600">
                        /{expert.duration} mins
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {expert.skills.slice(0, 4).map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 px-3 py-1 text-sm font-medium border-0 rounded-md"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {expert.skills.length > 4 && (
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-600 px-3 py-1 text-sm font-medium border-0 rounded-md"
                    >
                      +{expert.skills.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarExperts;