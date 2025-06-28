// components/expert/profile/expert-action-buttons.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Heart } from 'lucide-react';
import BookingModal from "./booking/booking-modal";

interface ExpertActionButtonsProps {
  expertId: string;
  expertName: string;
  expertJobTitle: string;
  expertCompany: string;
  expertProfilePicture: string;
}

export const ExpertActionButtons: React.FC<ExpertActionButtonsProps> = ({
  expertId,
  expertName,
  expertJobTitle,
  expertCompany,
  expertProfilePicture,
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
    // Reset booking state
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
    // TODO: Implement save functionality
    console.log('Save expert clicked');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:justify-start lg:items-end lg:min-w-[180px]">
      {/* Save Button */}
      <Button
        onClick={handleSave}
        variant="outline"
        className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 font-medium text-base cursor-pointer"
      >
        <Heart className="w-4 h-4" />
        Save
      </Button>
      
      {/* Book Session Button with Dialog */}
      <Dialog 
        open={isBookingOpen} 
        onOpenChange={(open) => {
          if (open) {
            openBookingModal();
          } else {
            closeBookingModal();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Book Session
          </Button>
        </DialogTrigger>
        
        <DialogContent 
          className="sm:max-w-md p-0" 
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">
            Book a session with {expertName}
          </DialogTitle>
          
          <BookingModal 
            expertId={expertId}
            expertName={expertName}
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
  );
};