// components/expert/profile/booking/booking-calendar.tsx
"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, isToday, isBefore } from 'date-fns';
import { useExpertAvailability } from '@/hooks/booking/use-expert-availability';

interface BookingCalendarProps {
  expertId: string;
  selectedDate: Date | null;
  selectDate: (date: Date) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ 
  expertId,
  selectedDate,
  selectDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { availableDates, loading } = useExpertAvailability(expertId);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];

  let days = [];
  let day = startDate;
  let formattedDate = "";

  // Helper function to check if date is available
  const isDateAvailable = (date: Date) => {
    const availableDate = availableDates.find(ad => isSameDay(ad.date, date));
    return availableDate?.hasAvailability || false;
  };

  // Helper function to check if date is selectable
  const isDateSelectable = (date: Date) => {
    return !isBefore(date, new Date()) && isSameMonth(date, monthStart) && isDateAvailable(date);
  };

  // Generate calendar days
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = new Date(day);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isSelected = selectedDate && isSameDay(day, selectedDate);
      const isAvailable = isDateAvailable(day);
      const isSelectable = isDateSelectable(day);
      const isPast = isBefore(day, new Date());
      const todayDate = isToday(day);

      days.push(
        <div
          key={day.toString()}
          className={`
            relative h-12 w-12 flex items-center justify-center cursor-pointer text-sm font-medium transition-all
            ${!isCurrentMonth 
              ? 'text-gray-300 cursor-not-allowed' 
              : isPast 
                ? 'text-gray-400 cursor-not-allowed'
                : isSelectable
                  ? 'text-gray-900 hover:bg-blue-50'
                  : 'text-gray-400 cursor-not-allowed'
            }
            ${isSelected 
              ? 'bg-blue-600 text-white' 
              : todayDate && isCurrentMonth
                ? 'bg-blue-100 text-blue-600'
                : ''
            }
            ${isSelected ? 'rounded-full' : 'rounded-lg'}
          `}
          onClick={() => {
            if (isSelectable) {
              selectDate(cloneDay);
            }
          }}
        >
          <span className="relative z-10">
            {formattedDate}
          </span>
          
          {/* Blue circle for available dates */}
          {isAvailable && !isSelected && !isPast && isCurrentMonth && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-500"></div>
          )}
          
          {/* Today indicator */}
          {todayDate && !isSelected && isCurrentMonth && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-1" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-1">
                {[...Array(7)].map((_, j) => (
                  <div key={j} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1">
        {rows}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-blue-500"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-600"></div>
            <span className="text-gray-600">Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;