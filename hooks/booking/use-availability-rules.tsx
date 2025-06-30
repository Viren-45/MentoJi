// hooks/booking/use-availability-rules.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/supabase/supabase-client';

export interface AvailabilityRule {
  id: string;
  expert_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string;
  end_time: string;
  timezone: string;
  is_active: boolean;
}

export interface TimeBlock {
  id: string;
  expert_id: string;
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

interface UseAvailabilityRulesReturn {
  availabilityRules: AvailabilityRule[];
  timeBlocks: TimeBlock[];
  existingConsultations: ExistingConsultation[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAvailabilityRules = (
  expertId: string | null,
  startDate?: Date,
  endDate?: Date
): UseAvailabilityRulesReturn => {
  const [availabilityRules, setAvailabilityRules] = useState<AvailabilityRule[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [existingConsultations, setExistingConsultations] = useState<ExistingConsultation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailabilityRules = useCallback(async () => {
    if (!expertId) {
      setAvailabilityRules([]);
      setTimeBlocks([]);
      setExistingConsultations([]);
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
      setAvailabilityRules(rules || []);

      // Fetch time blocks and consultations only if date range provided
      if (startDate && endDate) {
        // Fetch time blocks
        const { data: blocks, error: blocksError } = await supabase
          .from('expert_time_blocks')
          .select('*')
          .eq('expert_id', expertId)
          .gte('start_datetime', startDate.toISOString())
          .lte('end_datetime', endDate.toISOString());

        if (blocksError) throw blocksError;
        setTimeBlocks(blocks || []);

        // Fetch existing consultations
        const { data: consultations, error: consultationsError } = await supabase
          .from('consultations')
          .select('id, consultation_datetime, duration_minutes, status')
          .eq('expert_id', expertId)
          .in('status', ['pending', 'confirmed', 'in_progress'])
          .gte('consultation_datetime', startDate.toISOString())
          .lte('consultation_datetime', endDate.toISOString());

        if (consultationsError) throw consultationsError;
        setExistingConsultations(consultations || []);
      }

    } catch (err) {
      console.error('Error fetching availability rules:', err);
      setError('Failed to load availability data');
      setAvailabilityRules([]);
      setTimeBlocks([]);
      setExistingConsultations([]);
    } finally {
      setLoading(false);
    }
  }, [expertId, startDate?.toISOString(), endDate?.toISOString()]);

  const refetch = useCallback(async () => {
    await fetchAvailabilityRules();
  }, [fetchAvailabilityRules]);

  useEffect(() => {
    fetchAvailabilityRules();
  }, [fetchAvailabilityRules]);

  return {
    availabilityRules,
    timeBlocks,
    existingConsultations,
    loading,
    error,
    refetch,
  };
};