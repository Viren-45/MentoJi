// hooks/expert/dashboard/availability/use-availability-rules.ts
import { useState, useEffect, useCallback } from "react";
import {
  getExpertAvailabilityRulesByAuthUser,
  getExpertIdFromAuthUser,
  saveWeeklySchedule,
} from "@/lib/expert/dashboard/availability";
import { type WeeklySchedule } from "@/lib/validations/expert/dashboard/availability";

// Day mapping utilities
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const DAY_CODES = ["S", "M", "T", "W", "T", "F", "S"];

// Frontend state types
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  day: string;
  dayCode: string;
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

interface UseAvailabilityRulesReturn {
  schedule: DaySchedule[];
  timezone: string;
  isLoading: boolean;
  error: string | null;
  setSchedule: (schedule: DaySchedule[]) => void;
  setTimezone: (timezone: string) => void;
  saveSchedule: () => Promise<boolean>;
  loadSchedule: () => Promise<void>;
  refreshSchedule: () => Promise<void>;
  isSaving: boolean;
}

export function useAvailabilityRules(
  authUserId: string | null
): UseAvailabilityRulesReturn {
  // State
  const [schedule, setSchedule] = useState<DaySchedule[]>(getInitialSchedule());
  const [timezone, setTimezone] = useState<string>("America/New_York");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize empty schedule
  function getInitialSchedule(): DaySchedule[] {
    return DAY_NAMES.map((day, index) => ({
      day,
      dayCode: DAY_CODES[index],
      isAvailable: false,
      timeSlots: [],
    }));
  }

  // Convert database time (HH:MM:SS) to frontend time (HH:MM)
  function dbTimeToFrontend(dbTime: string): string {
    return dbTime.substring(0, 5); // "09:00:00" -> "09:00"
  }

  // Convert frontend schedule to database format
  function scheduleToWeeklySchedule(
    schedule: DaySchedule[],
    timezone: string,
    expertId: string
  ): WeeklySchedule {
    const rules = schedule
      .filter((day) => day.isAvailable && day.timeSlots.length > 0)
      .map((day) => ({
        day_of_week: DAY_NAMES.indexOf(day.day),
        start_time: day.timeSlots[0].startTime,
        end_time: day.timeSlots[0].endTime,
      }));

    return {
      expert_id: expertId,
      timezone,
      rules,
    };
  }

  // Convert database rules to frontend schedule
  function dbRulesToSchedule(dbRules: any[]): DaySchedule[] {
    const scheduleMap = new Map<number, any>();

    // Map database rules by day_of_week
    dbRules.forEach((rule) => {
      scheduleMap.set(rule.day_of_week, rule);
    });

    // Create frontend schedule
    return DAY_NAMES.map((day, dayIndex) => {
      const rule = scheduleMap.get(dayIndex);

      if (rule) {
        return {
          day,
          dayCode: DAY_CODES[dayIndex],
          isAvailable: true,
          timeSlots: [
            {
              id: rule.id,
              startTime: dbTimeToFrontend(rule.start_time),
              endTime: dbTimeToFrontend(rule.end_time),
            },
          ],
        };
      } else {
        return {
          day,
          dayCode: DAY_CODES[dayIndex],
          isAvailable: false,
          timeSlots: [],
        };
      }
    });
  }

  // Load schedule from database
  const loadSchedule = async () => {
    if (!authUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } =
        await getExpertAvailabilityRulesByAuthUser(authUserId);

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        const frontendSchedule = dbRulesToSchedule(data);
        setSchedule(frontendSchedule);

        // Set timezone from first rule (all should have same timezone)
        if (data[0]?.timezone) {
          setTimezone(data[0].timezone);
        }
      } else {
        // No rules found, set to default empty schedule
        setSchedule(getInitialSchedule());
      }
    } catch (err) {
      console.error("Error loading schedule:", err);
      setError(err instanceof Error ? err.message : "Failed to load schedule");
    } finally {
      setIsLoading(false);
    }
  };

  // Save schedule to database
  const saveSchedule = async (): Promise<boolean> => {
    if (!authUserId) return false;

    setIsSaving(true);
    setError(null);

    try {
      // First get expert ID
      const { expertId, error: expertError } = await getExpertIdFromAuthUser(
        authUserId
      );
      if (expertError || !expertId) {
        throw expertError || new Error("Expert not found");
      }

      const weeklySchedule = scheduleToWeeklySchedule(
        schedule,
        timezone,
        expertId
      );
      const { data, error: saveError } = await saveWeeklySchedule(
        weeklySchedule
      );

      if (saveError) {
        throw saveError;
      }

      // Reload to get fresh data with IDs
      await loadSchedule();
      return true;
    } catch (err) {
      console.error("Error saving schedule:", err);
      setError(err instanceof Error ? err.message : "Failed to save schedule");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Load schedule on mount and when explicitly requested
  useEffect(() => {
    loadSchedule();
  }, [authUserId]);

  // Add a manual refresh function
  const refreshSchedule = useCallback(async () => {
    await loadSchedule();
  }, [loadSchedule]);

  return {
    schedule,
    timezone,
    isLoading,
    error,
    setSchedule,
    setTimezone,
    saveSchedule,
    loadSchedule,
    refreshSchedule,
    isSaving,
  };
}
