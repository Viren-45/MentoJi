// hooks/booking/use-time-slot-calculator.tsx
"use client";

import { useCallback } from 'react';
import { addMinutes } from 'date-fns';
import { AvailabilityRule, TimeBlock, ExistingConsultation } from './use-availability-rules';
import { ExpertSessionSettings } from './use-expert-session-settings';

interface UseTimeSlotCalculatorReturn {
  calculateTimeSlotsForDate: (
    date: Date,
    rules: AvailabilityRule[],
    sessionSettings: ExpertSessionSettings,
    timeBlocks: TimeBlock[],
    existingConsultations: ExistingConsultation[]
  ) => string[];
}

export const useTimeSlotCalculator = (): UseTimeSlotCalculatorReturn => {
  
  const calculateTimeSlotsForDate = useCallback((
    date: Date,
    rules: AvailabilityRule[],
    sessionSettings: ExpertSessionSettings,
    timeBlocks: TimeBlock[] = [],
    existingConsultations: ExistingConsultation[] = []
  ): string[] => {
    
    const dayOfWeek = date.getDay();
    const dayRules = rules.filter(rule => rule.day_of_week === dayOfWeek);
    
    if (dayRules.length === 0) {
      return [];
    }

    const sessionDuration = sessionSettings.session_duration_minutes;
    const bufferAfter = sessionSettings.buffer_after_minutes;
    const slotInterval = sessionDuration + bufferAfter;

    const allSlots: string[] = [];

    // Generate slots for each availability rule
    dayRules.forEach((rule) => {
      const [startHour, startMin] = rule.start_time.split(':').map(Number);
      const [endHour, endMin] = rule.end_time.split(':').map(Number);
      
      const startTime = new Date(date);
      startTime.setHours(startHour, startMin, 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(endHour, endMin, 0, 0);
      
      let currentSlot = startTime;
      let slotCount = 0;
      
      // Generate time slots
      while (slotCount < 50 && currentSlot < endTime) { // Safety limit
        const slotEndTime = addMinutes(currentSlot, sessionDuration);
        
        // Check if slot fits within availability window
        if (slotEndTime <= endTime) {
          const slotTime = currentSlot.toTimeString().slice(0, 5); // HH:MM format
          
          // Check conflicts with time blocks
          const isBlocked = timeBlocks.some(block => {
            const blockStart = new Date(block.start_datetime);
            const blockEnd = new Date(block.end_datetime);
            return (slotEndTime > blockStart && currentSlot < blockEnd);
          });

          // Check conflicts with existing consultations
          const isBooked = existingConsultations.some(consultation => {
            const consultationStart = new Date(consultation.consultation_datetime);
            const consultationEnd = addMinutes(consultationStart, consultation.duration_minutes);
            return (slotEndTime > consultationStart && currentSlot < consultationEnd);
          });

          // Add slot if available
          if (!isBlocked && !isBooked && !allSlots.includes(slotTime)) {
            allSlots.push(slotTime);
          }
        } else {
          break;
        }
        
        currentSlot = addMinutes(currentSlot, slotInterval);
        slotCount++;
      }
    });

    // Sort slots chronologically
    return allSlots.sort((a, b) => {
      const [aHour, aMin] = a.split(':').map(Number);
      const [bHour, bMin] = b.split(':').map(Number);
      return (aHour * 60 + aMin) - (bHour * 60 + bMin);
    });
  }, []);

  return {
    calculateTimeSlotsForDate,
  };
};