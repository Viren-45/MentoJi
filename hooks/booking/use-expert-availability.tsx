// hooks/booking/use-expert-availability.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { startOfDay, endOfDay, addDays, isSameDay } from 'date-fns';
import { useExpertSessionSettings } from './use-expert-session-settings';
import { useAvailabilityRules } from './use-availability-rules';
import { useTimeSlotCalculator } from './use-time-slot-calculator';

export interface AvailableDate {
  date: Date;
  hasAvailability: boolean;
}

interface UseExpertAvailabilityReturn {
  availableDates: AvailableDate[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getTimeSlotsForDate: (date: Date) => string[];
  sessionSettings: any; // For backward compatibility
}

export const useExpertAvailability = (expertId: string | null): UseExpertAvailabilityReturn => {
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use the separate hooks
  const { sessionSettings, loading: settingsLoading, error: settingsError } = useExpertSessionSettings(expertId);
  
  const { startDate, endDate } = useMemo(() => {
    const start = startOfDay(new Date());
    const end = endOfDay(addDays(new Date(), sessionSettings?.max_booking_days_ahead || 60));
    return { startDate: start, endDate: end };
  }, [sessionSettings?.max_booking_days_ahead]);
  
  const { 
    availabilityRules, 
    timeBlocks, 
    existingConsultations, 
    loading: rulesLoading, 
    error: rulesError 
  } = useAvailabilityRules(expertId, startDate, endDate);

  const { calculateTimeSlotsForDate } = useTimeSlotCalculator();

  const loading = settingsLoading || rulesLoading;

  // Calculate available dates
  useEffect(() => {
    if (!expertId || !sessionSettings || availabilityRules.length === 0) {
      setAvailableDates([]);
      return;
    }

    try {
      setError(null);
      
      const advanceBookingHours = sessionSettings.advance_booking_hours || 48;
      const earliestBookingDate = addDays(new Date(), Math.ceil(advanceBookingHours / 24));
      
      const dates: AvailableDate[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        
        // Skip dates within advance booking period
        if (currentDate < earliestBookingDate) {
          dates.push({
            date: new Date(currentDate),
            hasAvailability: false,
          });
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }
        
        // Check if expert has availability rules for this day
        const dayRules = availabilityRules.filter(rule => rule.day_of_week === dayOfWeek);
        
        if (dayRules.length === 0) {
          dates.push({
            date: new Date(currentDate),
            hasAvailability: false,
          });
        } else {
          // Check if day is blocked by time blocks
          const isBlocked = timeBlocks.some(block => {
            const blockStart = new Date(block.start_datetime);
            const blockEnd = new Date(block.end_datetime);
            return currentDate >= startOfDay(blockStart) && currentDate <= endOfDay(blockEnd);
          });

          dates.push({
            date: new Date(currentDate),
            hasAvailability: !isBlocked,
          });
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      setAvailableDates(dates);
    } catch (err) {
      console.error('Error calculating available dates:', err);
      setError('Failed to calculate availability');
      setAvailableDates([]);
    }
  }, [expertId, sessionSettings, availabilityRules, timeBlocks, startDate, endDate]);

  // Get time slots for a specific date
  const getTimeSlotsForDate = useCallback((date: Date): string[] => {
    if (!sessionSettings || availabilityRules.length === 0) {
      return [];
    }

    return calculateTimeSlotsForDate(
      date,
      availabilityRules,
      sessionSettings,
      timeBlocks,
      existingConsultations
    );
  }, [sessionSettings, availabilityRules, timeBlocks, existingConsultations, calculateTimeSlotsForDate]);

  const refetch = useCallback(async () => {
    // This will trigger re-fetching through the dependency hooks
    setError(null);
  }, []);

  // Combine errors from all hooks
  useEffect(() => {
    if (settingsError || rulesError) {
      setError(settingsError || rulesError);
    }
  }, [settingsError, rulesError]);

  return {
    availableDates,
    loading,
    error,
    refetch,
    getTimeSlotsForDate,
    sessionSettings, // For backward compatibility
  };
};