// components/booking/step-one/date-picker.tsx
"use client";

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { AvailableDate } from '@/hooks/booking/use-expert-availability';

interface DatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  availableDates: AvailableDate[];
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateSelect,
  availableDates,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper function to get local date string without timezone conversion
  const getLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Generate calendar days for the current month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of the month and how many days to show from previous month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
    
    const days = [];
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      // Use local date string to avoid timezone issues
      const dateString = getLocalDateString(date);
      
      // Find availability from the hook data - compare using local date strings
      const availableDate = availableDates.find(ad => {
        const adDateString = getLocalDateString(ad.date);
        return adDateString === dateString;
      });
      
      const available = availableDate?.hasAvailability || false;
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      
      days.push({
        date: dateString,
        day: date.getDate(),
        isCurrentMonth,
        available: available && !isPast,
        isPast,
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Check if we can go to previous month (don't go before current month)
  const canGoPrevious = currentDate.getMonth() > new Date().getMonth() || 
                       currentDate.getFullYear() > new Date().getFullYear();

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Select Date</h3>
      </div>
      
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious}
          className={`
            p-2 rounded-lg transition-colors
            ${canGoPrevious 
              ? 'hover:bg-gray-100 text-gray-600' 
              : 'text-gray-300 cursor-not-allowed'
            }
          `}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h4 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Week Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => day.available && onDateSelect(day.date)}
            disabled={!day.available}
            className={`
              relative h-12 w-full rounded-lg text-center transition-all duration-200 flex items-center justify-center
              ${!day.isCurrentMonth 
                ? 'text-gray-300 cursor-default' 
                : day.isPast
                ? 'text-gray-300 cursor-not-allowed'
                : day.available 
                  ? 'text-gray-900 hover:bg-blue-50 cursor-pointer border border-transparent hover:border-blue-200' 
                  : 'text-gray-400 cursor-not-allowed'
              }
              ${selectedDate === day.date ? 'bg-blue-600 text-white border-blue-600' : ''}
            `}
          >
            <span className="text-sm font-medium">{day.day}</span>
            
            {/* Available indicator */}
            {day.available && selectedDate !== day.date && day.isCurrentMonth && !day.isPast && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            )}
            
            {/* Today indicator */}
            {day.date === getLocalDateString(new Date()) && selectedDate !== day.date && (
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;