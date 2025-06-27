// hooks/expert/calendar-connections/use-calendar-connections.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import supabase from "@/lib/supabase/supabase-client";
import { useAuth } from "@/hooks/auth/use-auth";

interface CalendarConnection {
  id: string;
  provider: string;
  nylas_email: string;
  connection_status: string;
  last_sync_at: string;
}

export const useCalendarConnections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [expertId, setExpertId] = useState<string | null>(null);

  // Fetch expert ID once and cache it
  const fetchExpertId = useCallback(async () => {
    if (!user?.id || expertId) return expertId;

    try {
      const { data: expertData, error } = await supabase
        .from('experts')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (error || !expertData) {
        console.error('Error fetching expert:', error);
        return null;
      }

      setExpertId(expertData.id);
      return expertData.id;
    } catch (error) {
      console.error('Error in fetchExpertId:', error);
      return null;
    }
  }, [user?.id, expertId]);

  // Fetch connections with optimized query
  const fetchConnections = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const currentExpertId = await fetchExpertId();
      
      if (!currentExpertId) {
        setIsLoading(false);
        return;
      }

      const { data: connectionsData, error } = await supabase
        .from('expert_calendar_connections')
        .select('*')
        .eq('expert_id', currentExpertId);

      if (error) {
        console.error('Error fetching connections:', error);
      } else {
        setConnections(connectionsData || []);
      }
    } catch (error) {
      console.error('Error in fetchConnections:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, fetchExpertId]);

  // Initial load
  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  // Connect calendar
  const handleConnect = useCallback(async (providerId: string) => {
    if (!user || isConnecting) return false;

    setIsConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error('Please log in again');
        return false;
      }

      const response = await fetch('/api/nylas/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ provider: providerId }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = data.authUrl;
        return true;
      } else {
        toast.error(data.error || 'Failed to start connection');
        return false;
      }
    } catch (error) {
      console.error('Error connecting calendar:', error);
      toast.error('Failed to connect calendar');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [user, isConnecting]);

  // Disconnect calendar
  const handleDisconnect = useCallback(async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('expert_calendar_connections')
        .delete()
        .eq('id', connectionId);

      if (error) {
        toast.error('Failed to disconnect calendar');
        return false;
      }

      // Update state immediately for better UX
      const updatedConnections = connections.filter(c => c.id !== connectionId);
      setConnections(updatedConnections);

      // Update expert's calendar_connected flag if no connections left
      if (updatedConnections.length === 0 && expertId) {
        await supabase
          .from('experts')
          .update({ calendar_connected: false })
          .eq('id', expertId);
      }

      toast.success('Calendar disconnected successfully');
      return true;
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      toast.error('Failed to disconnect calendar');
      return false;
    }
  }, [connections, expertId]);

  // Refresh connections
  const refreshConnections = useCallback(() => {
    setIsLoading(true);
    fetchConnections();
  }, [fetchConnections]);

  return {
    connections,
    isLoading,
    isConnecting,
    handleConnect,
    handleDisconnect,
    refreshConnections,
  };
};