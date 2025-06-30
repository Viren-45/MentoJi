// hooks/booking/use-expert-session-settings.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/supabase/supabase-client';

export interface ExpertSessionSettings {
  id: string;
  expert_id: string;
  session_duration_minutes: number;
  session_price: number;
  buffer_before_minutes: number;
  buffer_after_minutes: number;
  advance_booking_hours: number;
  max_booking_days_ahead: number;
  auto_confirm_bookings: boolean;
  send_booking_reminders: boolean;
  use_waiting_room: boolean;
  meeting_instructions: string;
}

interface UseExpertSessionSettingsReturn {
  sessionSettings: ExpertSessionSettings | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useExpertSessionSettings = (expertId: string | null): UseExpertSessionSettingsReturn => {
  const [sessionSettings, setSessionSettings] = useState<ExpertSessionSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessionSettings = useCallback(async () => {
    if (!expertId) {
      setSessionSettings(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: settingsError } = await supabase
        .from('expert_session_settings')
        .select('*')
        .eq('expert_id', expertId)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      // Default settings if none exist
      const defaultSettings: ExpertSessionSettings = {
        id: '',
        expert_id: expertId,
        session_duration_minutes: 30,
        session_price: 75,
        buffer_before_minutes: 15,
        buffer_after_minutes: 15,
        advance_booking_hours: 24,
        max_booking_days_ahead: 30,
        auto_confirm_bookings: true,
        send_booking_reminders: true,
        use_waiting_room: true,
        meeting_instructions: '',
      };

      setSessionSettings(data || defaultSettings);
    } catch (err) {
      console.error('Error fetching session settings:', err);
      setError('Failed to load session settings');
      setSessionSettings(null);
    } finally {
      setLoading(false);
    }
  }, [expertId]);

  const refetch = useCallback(async () => {
    await fetchSessionSettings();
  }, [fetchSessionSettings]);

  useEffect(() => {
    fetchSessionSettings();
  }, [fetchSessionSettings]);

  return {
    sessionSettings,
    loading,
    error,
    refetch,
  };
};