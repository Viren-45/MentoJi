// hooks/booking/use-expert-availability.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { format, startOfDay, endOfDay, addDays, isSameDay } from 'date-fns';
import supabase from '@/lib/supabase/supabase-client';

export interface AvailabilityRule {
  id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string;
  end_time: string;
  timezone: string;
  is_active: boolean;
}

export interface TimeBlock {
  id: string;
  start_datetime: string;
  end_datetime: string;
  block_type: 'vacation' | 'personal' | 'break' | 'buffer';
  title?: string;
}

export interface ExistingConsultation {
  id: string;
  consultation_datetime: string;
  duration_minutes: number;
  status: string;
}

export interface AvailableDate {
  date: Date;
  hasAvailability: boolean;
  availableSlots?: string[];
}

interface UseExpertAvailabilityReturn {
  availableDates: AvailableDate[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getTimeSlotsForDate: (date: Date, duration: number) => Promise<string[]>;
}

export const useExpertAvailability = (expertId: string | null): UseExpertAvailabilityReturn => {
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailabilityData = useCallback(async () => {
    if (!expertId) {
      setAvailableDates([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch availability rules
      const { data: rules, error: rulesError } = await supabase
        .from('expert_availability_rules')
        .select('*')
        .eq('expert_id', expertId)
        .eq('is_active', true);

      if (rulesError) throw rulesError;

      // Fetch time blocks (blocked periods)
      const startDate = startOfDay(new Date());
      const endDate = endOfDay(addDays(new Date(), 60)); // Look ahead 60 days

      const { data: timeBlocks, error: blocksError } = await supabase
        .from('expert_time_blocks')
        .select('*')
        .eq('expert_id', expertId)
        .gte('start_datetime', startDate.toISOString())
        .lte('end_datetime', endDate.toISOString());

      if (blocksError) throw blocksError;

      // Fetch existing consultations
      const { data: consultations, error: consultationsError } = await supabase
        .from('consultations')
        .select('consultation_datetime, duration_minutes, status')
        .eq('expert_id', expertId)
        .in('status', ['pending', 'confirmed', 'in_progress'])
        .gte('consultation_datetime', startDate.toISOString())
        .lte('consultation_datetime', endDate.toISOString());

      if (consultationsError) throw consultationsError;

      // Calculate available dates
      const dates = calculateAvailableDates(
        rules || [],
        timeBlocks || [],
        consultations || [],
        startDate,
        endDate
      );

      setAvailableDates(dates);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError('Failed to load availability data');
    } finally {
      setLoading(false);
    }
  }, [expertId]);

  const calculateAvailableDates = (
    rules: AvailabilityRule[],
    timeBlocks: TimeBlock[],
    consultations: ExistingConsultation[],
    startDate: Date,
    endDate: Date
  ): AvailableDate[] => {
    const dates: AvailableDate[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      
      // Check if expert has availability rules for this day
      const dayRules = rules.filter(rule => rule.day_of_week === dayOfWeek);
      
      if (dayRules.length === 0) {
        // No availability rules for this day
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

        if (isBlocked) {
          dates.push({
            date: new Date(currentDate),
            hasAvailability: false,
          });
        } else {
          // Day has potential availability
          // For now, just mark as available - detailed slot calculation happens in getTimeSlotsForDate
          dates.push({
            date: new Date(currentDate),
            hasAvailability: true,
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const getTimeSlotsForDate = useCallback(async (date: Date, duration: number): Promise<string[]> => {
    if (!expertId) return [];

    try {
      // This is a simplified version - you'll need to implement detailed slot calculation
      // based on availability rules, existing bookings, and duration
      
      // For now, return mock time slots
      const mockSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
      ];

      return mockSlots;
    } catch (err) {
      console.error('Error calculating time slots:', err);
      return [];
    }
  }, [expertId]);

  const refetch = useCallback(async () => {
    await fetchAvailabilityData();
  }, [fetchAvailabilityData]);

  useEffect(() => {
    fetchAvailabilityData();
  }, [fetchAvailabilityData]);

  return {
    availableDates,
    loading,
    error,
    refetch,
    getTimeSlotsForDate,
  };
};