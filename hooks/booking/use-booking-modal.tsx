// hooks/booking/use-booking-modal.tsx
"use client";

import { useState, useCallback } from 'react';

export type BookingStep = 'calendar' | 'time-slots' | 'confirmation';

interface BookingModalState {
  isOpen: boolean;
  currentStep: BookingStep;
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  selectedDuration: number; // in minutes
  expertId: string | null;
}

interface UseBookingModalReturn {
  // State
  isOpen: boolean;
  currentStep: BookingStep;
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  selectedDuration: number;
  expertId: string | null;
  
  // Actions
  openModal: (expertId: string) => void;
  closeModal: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: BookingStep) => void;
  selectDate: (date: Date) => void;
  selectTimeSlot: (timeSlot: string) => void;
  selectDuration: (duration: number) => void;
  resetBooking: () => void;
}

export const useBookingModal = (): UseBookingModalReturn => {
  const [state, setState] = useState<BookingModalState>({
    isOpen: false,
    currentStep: 'calendar',
    selectedDate: null,
    selectedTimeSlot: null,
    selectedDuration: 30, // Default to 30 minutes
    expertId: null,
  });

  const openModal = useCallback((expertId: string) => {
    setState(prev => ({
      ...prev,
      isOpen: true,
      expertId,
      currentStep: 'calendar',
    }));
  }, []);

  const closeModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const resetBooking = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: 'calendar',
      selectedDate: null,
      selectedTimeSlot: null,
      selectedDuration: 30,
    }));
  }, []);

  const goToNextStep = useCallback(() => {
    setState(prev => {
      const stepOrder: BookingStep[] = ['calendar', 'time-slots', 'confirmation'];
      const currentIndex = stepOrder.indexOf(prev.currentStep);
      const nextIndex = Math.min(currentIndex + 1, stepOrder.length - 1);
      
      return {
        ...prev,
        currentStep: stepOrder[nextIndex],
      };
    });
  }, []);

  const goToPreviousStep = useCallback(() => {
    setState(prev => {
      const stepOrder: BookingStep[] = ['calendar', 'time-slots', 'confirmation'];
      const currentIndex = stepOrder.indexOf(prev.currentStep);
      const previousIndex = Math.max(currentIndex - 1, 0);
      
      return {
        ...prev,
        currentStep: stepOrder[previousIndex],
      };
    });
  }, []);

  const goToStep = useCallback((step: BookingStep) => {
    setState(prev => ({
      ...prev,
      currentStep: step,
    }));
  }, []);

  const selectDate = useCallback((date: Date) => {
    setState(prev => ({
      ...prev,
      selectedDate: date,
      selectedTimeSlot: null, // Reset time slot when date changes
    }));
  }, []);

  const selectTimeSlot = useCallback((timeSlot: string) => {
    setState(prev => ({
      ...prev,
      selectedTimeSlot: timeSlot,
    }));
  }, []);

  const selectDuration = useCallback((duration: number) => {
    setState(prev => ({
      ...prev,
      selectedDuration: duration,
      selectedTimeSlot: null, // Reset time slot when duration changes
    }));
  }, []);

  return {
    // State
    isOpen: state.isOpen,
    currentStep: state.currentStep,
    selectedDate: state.selectedDate,
    selectedTimeSlot: state.selectedTimeSlot,
    selectedDuration: state.selectedDuration,
    expertId: state.expertId,
    
    // Actions
    openModal,
    closeModal,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    selectDate,
    selectTimeSlot,
    selectDuration,
    resetBooking,
  };
};