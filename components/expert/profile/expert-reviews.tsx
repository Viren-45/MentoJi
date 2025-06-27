// components/expert/profile/expert-reviews.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  clientName: string;
  rating: number;
  date: string;
  sessionType: string;
  comment: string;
  avatar?: string;
}

interface ExpertReviewsProps {
  expertFirstName: string;
}

const ExpertReviews: React.FC<ExpertReviewsProps> = ({ expertFirstName }) => {
  const [showAll, setShowAll] = useState(false);

  // Hardcoded review data
  const reviews: Review[] = [
    {
      id: '1',
      clientName: 'Sahan',
      rating: 5,
      date: 'July 14, 2024',
      sessionType: 'Career Strategy',
      comment: `Seeking mentorship from ${expertFirstName} was driven by my desire to improve my interviewing skills for a position at Microsoft. ${expertFirstName} provided clear guidance and actionable feedback that directly addressed my concerns. What I appreciated most was his candidness and the structured approach he used to tackle each challenge. This mentorship significantly boosted my confidence and equipped me with strategies that have already proven beneficial in my professional development.`,
      avatar: '/placeholder-avatar.png'
    },
    {
      id: '2',
      clientName: 'Roy',
      rating: 5,
      date: 'September 14, 2024',
      sessionType: 'Mock Interview',
      comment: `${expertFirstName} was super helpful in identifying my key strengths and weaknesses! Highly recommended!`,
      avatar: '/placeholder-avatar.png'
    },
    {
      id: '3',
      clientName: 'Alexander',
      rating: 5,
      date: 'May 6, 2024',
      sessionType: 'Standard Plan • 2 months',
      comment: `${expertFirstName} is awesome. Highly recommended. During every call he provided multiple insights and areas for improvement. He also is an easygoing, polite, and generally positive person. Looking forward to working with ${expertFirstName} again in the future.`,
      avatar: '/placeholder-avatar.png'
    },
    {
      id: '4',
      clientName: 'Sarah',
      rating: 5,
      date: 'March 22, 2024',
      sessionType: 'Technical Interview Prep',
      comment: `Amazing session with ${expertFirstName}! He helped me understand complex algorithms in a way that finally clicked. His patience and teaching style are exceptional.`,
      avatar: '/placeholder-avatar.png'
    },
    {
      id: '5',
      clientName: 'Michael',
      rating: 5,
      date: 'February 8, 2024',
      sessionType: 'Career Transition',
      comment: `${expertFirstName} provided invaluable guidance during my career transition from finance to tech. His insights into the industry and practical advice made all the difference.`,
      avatar: '/placeholder-avatar.png'
    }
  ];

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);
  const hasMoreReviews = reviews.length > 3;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'fill-green-500 text-green-500'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What clients say</h2>
        <div className="text-gray-500 text-center py-8">
          <p>No reviews yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">What clients say</h2>
      
      <div className="space-y-8">
        {visibleReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-8 last:pb-0">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-semibold text-sm">
                  {getInitials(review.clientName)}
                </span>
              </div>
              
              {/* Review Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 text-xl">
                      {review.clientName}
                    </h3>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-gray-500 text-base">
                      {review.date}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-base text-gray-600">
                      Session: <span className="text-blue-600 font-medium">{review.sessionType}</span>
                    </p>
                  </div>
                </div>
                
                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed text-lg">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      {hasMoreReviews && !showAll && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
            className="px-6 py-2 text-gray-700 text-lg border-gray-300 hover:bg-gray-50 font-medium cursor-pointer"
          >
            Load more reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExpertReviews;