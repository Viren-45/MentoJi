// components/expert/profile/expert-header.tsx
"use client";

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Home, Linkedin, Twitter, MapPin, Star, ChevronDown, X, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import BookingModal from "./booking/booking-modal";

interface ExpertHeaderProps {
  expertId: string;
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

const ExpertHeader: React.FC<ExpertHeaderProps> = ({
  expertId,
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
  // Local state for modal 
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<'calendar' | 'time-slots' | 'confirmation'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(30); // Default 30 minutes

  // Expert ID is already available from props

  // Handle booking modal open/close
  const openBookingModal = () => {
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    // Reset booking state
    setBookingStep('calendar');
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setSelectedDuration(30);
  };

  // Booking step navigation
  const goToNextStep = () => {
    if (bookingStep === 'calendar' && selectedDate) {
      setBookingStep('time-slots');
    } else if (bookingStep === 'time-slots' && selectedTimeSlot) {
      setBookingStep('confirmation');
    }
  };

  const goToPreviousStep = () => {
    if (bookingStep === 'time-slots') {
      setBookingStep('calendar');
    } else if (bookingStep === 'confirmation') {
      setBookingStep('time-slots');
    }
  };

  const goToStep = (step: 'calendar' | 'time-slots' | 'confirmation') => {
    setBookingStep(step);
  };

  // Booking selection handlers
  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const selectTimeSlot = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const selectDuration = (duration: number) => {
    setSelectedDuration(duration);
  };

  // Other handlers
  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save expert clicked');
  };

  const handleBookSession = () => {
    console.log('Book Session clicked!', { expertId });
    openBookingModal();
  };

  // Smooth scroll to skills section
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
      <div className="relative">
        {/* Blue Gradient Background */}
        <div className="bg-blue-900 px-6 py-16" style={{ height: '300px' }}>
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-white text-xl font-semibold mb-8">
              <Home className="w-5 h-5" />
              <span className="mx-2 text-2xl">›</span>
              <span className="text-xl">Browse Experts</span>
              <span className="mx-2 text-2xl">›</span>
              <span className="text-xl">{firstName} {lastName}</span>
            </nav>

            {/* Social Links - Top Right */}
            <div className="py-28">
              <div className="max-w-7xl mx-auto flex justify-end">
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
                      href={`https://twitter.com/${twitterHandle.replace('@', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                    >
                      <Twitter className="w-5 h-5 text-blue-600" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Picture - Positioned to be 50/50 */}
            <div className="absolute left-0 right-0" style={{ top: '160px' }}>
              <div className="max-w-7xl mx-auto px-2">
                <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                  <Image
                    src={profilePictureUrl || '/placeholder-avatar.png'}
                    alt={`${firstName} ${lastName}`}
                    width={224}
                    height={224}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-avatar.png';
                    }}
                  />
                </div>

                {/* MentoJi's Choice Badge */}
                {isMentojiChoice && (
                  <div className="absolute left-170 top-20">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-4 py-2 text-base rounded-full shadow-lg border-0">
                      ⭐ MentoJi's Choice
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* White Content Area */}
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
                    
                    <Dialog open={isBookingOpen} onOpenChange={(open) => {
                      if (open) {
                        openBookingModal();
                      } else {
                        closeBookingModal();
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Book Session
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md p-0" onInteractOutside={(e) => e.preventDefault()}>
                        <DialogTitle className="sr-only">
                          Book a session with {firstName} {lastName}
                        </DialogTitle>
                        <BookingModal 
                          expertId={expertId}
                          expertName={`${firstName} ${lastName}`}
                          expertJobTitle={jobTitle}
                          expertCompany={company}
                          expertProfilePicture={profilePictureUrl}
                          isOpen={isBookingOpen} 
                          selectedDate={selectedDate}
                          selectedTimeSlot={selectedTimeSlot}
                          selectedDuration={selectedDuration}
                          closeModal={closeBookingModal}
                          selectDate={selectDate}
                          selectTimeSlot={selectTimeSlot}
                          selectDuration={selectDuration}
                        />
                      </DialogContent>
                    </Dialog>
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
      </div>
    </>
  );
};

export default ExpertHeader;