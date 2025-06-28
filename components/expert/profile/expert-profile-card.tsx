// components/expert/profile/expert-profile-card.tsx
"use client";

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Heart, MapPin, Star, ChevronDown } from 'lucide-react';
import BookingModal from "./booking/booking-modal";

interface ExpertProfileCardProps {
  expertId: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  location?: string | null;
  skills?: string[];
}

export const ExpertProfileCard: React.FC<ExpertProfileCardProps> = ({
  expertId,
  firstName,
  lastName,
  jobTitle,
  company,
  location,
  skills = [],
}) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(30);

  const openBookingModal = () => {
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setSelectedDuration(30);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const selectTimeSlot = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const selectDuration = (duration: number) => {
    setSelectedDuration(duration);
  };

  const handleSave = () => {
    console.log('Save expert clicked');
  };

  const handleBookSession = () => {
    console.log('Book Session clicked for expert:', expertId);
    openBookingModal();
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
                  
                  <Dialog open={isBookingOpen} onOpenChange={(open) => {
                    if (open) {
                      openBookingModal();
                    } else {
                      closeBookingModal();
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 font-medium text-base"
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
    </>
  );
};