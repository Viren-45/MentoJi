// components/expert/profile/expert-profile-card.tsx
"use client";

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Star, ChevronDown, X } from 'lucide-react';
import { useAuth } from '@/hooks/auth/use-auth';
import { useRouter } from 'next/navigation';

interface ExpertProfileCardProps {
  expertId: string;
  firstName: string;
  lastName: string;
  username: string;
  jobTitle: string;
  company: string;
  location?: string | null;
  skills?: string[];
}

export const ExpertProfileCard: React.FC<ExpertProfileCardProps> = ({
  expertId,
  firstName,
  lastName,
  username,
  jobTitle,
  company,
  location,
  skills = [],
}) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut, isAuthenticated, isClient, isExpert } = useAuth();
  const router = useRouter();

  const openBookingModal = () => {
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleSave = () => {
    console.log('Save expert clicked');
  };

  const handleBookSession = () => {
    console.log('Book Session clicked for expert:', expertId);
  
    // Check authentication and user type
    if (!isAuthenticated) {
      // Not logged in - show auth modal
      openAuthModal();
      return;
    }
  
    if (isExpert) {
      // Expert trying to book - show auth modal with expert message
      openAuthModal();
      return;
    }
  
    if (isClient) {
      // Client logged in - redirect to booking page
      router.push(`/booking/${username}`);
      return;
    }
  
    // Fallback - show auth modal
    openAuthModal();
  };

  const scrollToSkills = () => {
    const skillsSection = document.getElementById('skills-section');
    if (skillsSection) {
      skillsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Hardcoded review data for now
  const reviewData = {
    rating: 5.0,
    reviewCount: 28
  };

  // Skills display logic - always show first 5 in header
  const visibleSkills = skills.slice(0, 5);
  const hiddenCount = skills.length - 5;

  return (
    <>
      {/* Expert Profile Card */}
      <div className="bg-white pt-28 pb-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Expert Info */}
            <div className="lg:col-span-1">
              <div className="space-y-2">
                {/* Name */}
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  {firstName} {lastName}
                </h1>
                
                {/* Job Title and Company */}
                <p className="text-xl font-semibold text-gray-700 leading-relaxed">
                  {jobTitle} @ {company}
                </p>
                
                {/* Location */}
                {location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-lg font-medium">{location}</span>
                  </div>
                )}
                
                {/* Reviews */}
                <div className="flex items-center gap-2 py-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-blue-600" />
                    <span className="text-lg text-gray-600">{reviewData.rating}</span>
                  </div>
                  <span className="text-lg text-gray-600 font-medium">
                    ({reviewData.reviewCount} reviews)
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-base cursor-pointer"
                  >
                    <Heart className="w-4 h-4" />
                    Save
                  </Button>
                  
                  {/* Direct button - no Dialog wrapper */}
                  <Button 
                    onClick={handleBookSession}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 font-medium text-base"
                  >
                    Book Session
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Skills Preview */}
            <div className="lg:col-span-1">
              {skills.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-5">Skills</h3>
                  
                  <div className="space-y-4">
                    {/* Skills Grid - Show first 5 */}
                    <div className="flex flex-wrap gap-2.5">
                      {visibleSkills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 text-sm font-semibold border-0 rounded-md"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Scroll to Skills Button */}
                    {skills.length > 5 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={scrollToSkills}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer p-0 h-auto font-semibold text-sm transition-colors"
                      >
                        <span className="flex items-center gap-1">
                          <ChevronDown className="w-4 h-4" />
                          + {hiddenCount} more
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {!isAuthenticated ? 'Sign in to book' : 'Account Required'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {!isAuthenticated 
                    ? 'Please sign in or create an account to book a session'
                    : isExpert 
                      ? 'You need a client account to book sessions'
                      : 'Client account required'
                  }
                </p>
              </div>
              
              <button
                onClick={closeAuthModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!isAuthenticated ? (
                // Not logged in - show login/signup options
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    To book a session with <strong>{firstName} {lastName}</strong>, 
                    you'll need to sign in or create a client account.
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        // Navigate to login page
                        window.location.href = '/auth/sign-in?redirect=' + encodeURIComponent(window.location.pathname);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                    >
                      Sign In
                    </button>
                    
                    <button
                      onClick={() => {
                        // Navigate to signup page
                        window.location.href = '/auth/sign-up?redirect=' + encodeURIComponent(window.location.pathname);
                      }}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              ) : isExpert ? (
                // Expert logged in - show switch account message
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    You're currently logged in as an expert. To book a session, 
                    you need to log out and sign in with a client account.
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={async () => {
                        // Sign out current expert account
                        await signOut();
                        // Redirect to login
                        window.location.href = '/auth/sign-in?redirect=' + encodeURIComponent(window.location.pathname);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                    >
                      Sign Out & Sign In as Client
                    </button>
                    
                    <button
                      onClick={closeAuthModal}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Fallback - shouldn't happen but handle gracefully
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Please sign in with a client account to book sessions.
                  </p>
                  
                  <button
                    onClick={closeAuthModal}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};