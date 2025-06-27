// components/expert/dashboard/availability/schedules/calendar-view/calendar-view.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import CalendarHeader from "./calendar-header";
import CalendarGrid from "./calendar-grid";
import { useAvailabilityRules } from "@/hooks/expert/dashboard/availability/use-availability-rules";
import { useAuth } from "@/hooks/auth/use-auth";
import { getExpertCalendarConnection, fetchCalendarEvents, calculateAvailableSlots } from "@/lib/expert/dashboard/availability/nylas-calendar";

interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  timeSlots: TimeSlot[];
  isUnavailable?: boolean;
  unavailableReason?: string;
}

const CalendarView = () => {
  const { user } = useAuth();
  const authUserId = user?.id || null;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [isGeneratingCalendar, setIsGeneratingCalendar] = useState(false);
  const [monthlyEvents, setMonthlyEvents] = useState<any[]>([]);
  
  const {
    schedule,
    timezone,
    isLoading,
    setTimezone
  } = useAvailabilityRules(authUserId);

  // Convert day names to day numbers (0 = Sunday, 1 = Monday, etc.)
  const DAY_MAPPING: Record<string, number> = {
    "Sunday": 0,
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6
  };

  // Fetch all events for the entire month in one API call
  const fetchMonthlyEvents = useCallback(async () => {
    if (!authUserId) return [];

    try {
      // Get calendar connection
      const { data: connection } = await getExpertCalendarConnection(authUserId);
      if (!connection) {
        console.log('No calendar connection found');
        return [];
      }

      // Get start and end of current month view (includes prev/next month days)
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
      
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 41); // 42 days total

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      console.log(`Fetching events for month range: ${startDateStr} to ${endDateStr}`);

      // Single API call for entire month
      const { data: events } = await fetchCalendarEvents(
        connection.nylas_grant_id,
        connection.calendar_id,
        startDateStr,
        endDateStr
      );

      return events || [];
    } catch (error) {
      console.error('Error fetching monthly events:', error);
      return [];
    }
  }, [authUserId, currentDate.getFullYear(), currentDate.getMonth()]);

  // Generate calendar data using cached monthly events
  const generateCalendarData = useCallback((): CalendarDay[] => {
    if (!authUserId || schedule.length === 0) return [];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of the month and calculate calendar grid
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const calendarDays: CalendarDay[] = [];
    const today = new Date();

    // Generate 42 days (6 weeks × 7 days)
    for (let i = 0; i < 42; i++) {
      const currentCalendarDate = new Date(startDate);
      currentCalendarDate.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = currentCalendarDate.getMonth() === month;
      const isToday = 
        currentCalendarDate.toDateString() === today.toDateString();

      // Get day of week for this date
      const dayOfWeek = currentCalendarDate.getDay();
      
      // Find matching schedule for this day of week
      const daySchedule = schedule.find(s => DAY_MAPPING[s.day] === dayOfWeek);
      
      let timeSlots: TimeSlot[] = [];
      let isUnavailable = false;
      let unavailableReason = "";

      if (!daySchedule || !daySchedule.isAvailable || daySchedule.timeSlots.length === 0) {
        // Day is not available in the schedule
        isUnavailable = true;
      } else {
        // Day is available - calculate with cached events
        const dateString = currentCalendarDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const availabilityRules = daySchedule.timeSlots[0];

        if (availabilityRules) {
          try {
            // Calculate available slots using cached monthly events
            const availableSlots = calculateAvailableSlots(
              availabilityRules.startTime,
              availabilityRules.endTime,
              monthlyEvents,
              dateString
            );
            
            if (availableSlots && availableSlots.length > 0) {
              timeSlots = availableSlots.map(slot => ({
                startTime: slot.startTime,
                endTime: slot.endTime,
                isAvailable: true
              }));
            } else {
              // No available slots after removing conflicts
              isUnavailable = true;
              unavailableReason = "Busy";
            }
          } catch (error) {
            console.warn('Error calculating availability for', dateString, error);
            // Fallback to showing availability rules
            timeSlots = [{
              startTime: availabilityRules.startTime,
              endTime: availabilityRules.endTime,
              isAvailable: true
            }];
          }
        }
      }

      calendarDays.push({
        date: currentCalendarDate,
        dayNumber: currentCalendarDate.getDate(),
        isCurrentMonth,
        isToday,
        timeSlots,
        isUnavailable,
        unavailableReason
      });
    }

    return calendarDays;
  }, [authUserId, schedule, currentDate.getFullYear(), currentDate.getMonth(), monthlyEvents]);

  // Load monthly events when month changes
  useEffect(() => {
    const loadMonthlyEvents = async () => {
      if (isLoading || !authUserId || schedule.length === 0) return;

      setIsGeneratingCalendar(true);
      try {
        const events = await fetchMonthlyEvents();
        setMonthlyEvents(events);
        console.log(`Loaded ${events.length} events for the month`);
      } catch (error) {
        console.error('Error loading monthly events:', error);
        setMonthlyEvents([]);
      } finally {
        setIsGeneratingCalendar(false);
      }
    };

    loadMonthlyEvents();
  }, [fetchMonthlyEvents, isLoading]);

  // Generate calendar data when events or schedule change
  useEffect(() => {
    if (!isGeneratingCalendar && monthlyEvents !== null) {
      const data = generateCalendarData();
      setCalendarData(data);
    }
  }, [generateCalendarData, isGeneratingCalendar, monthlyEvents]);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleTimezoneChange = (newTimezone: string) => {
    setTimezone(newTimezone);
  };

  if (isLoading || isGeneratingCalendar) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            {isLoading ? "Loading schedule..." : "Loading calendar events..."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header with Navigation */}
      <CalendarHeader
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        timezone={timezone}
        onTimezoneChange={handleTimezoneChange}
      />

      {/* Calendar Grid */}
      <CalendarGrid calendarDays={calendarData} />
    </div>
  );
};

export default CalendarView;