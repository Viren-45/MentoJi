// hooks/booking/use-time-slot-calculator.tsx
"use client";

import { useCallback } from 'react';
import { 
  parse, 
  addMinutes, 
  format, 
  isAfter, 
  isBefore, 
  isSameDay,
  startOfDay,
  endOfDay
} from 'date-fns';
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
    
    console.log('🔍 Starting time slot calculation for:', {
      date: format(date, 'yyyy-MM-dd (EEEE)'),
      dayOfWeek: date.getDay(),
      rulesCount: rules.length,
      sessionSettings: {
        duration: sessionSettings.session_duration_minutes,
        bufferAfter: sessionSettings.buffer_after_minutes,
        bufferBefore: sessionSettings.buffer_before_minutes
      }
    });
    
    const dayOfWeek = date.getDay();
    
    // Find availability rules for this day
    const dayRules = rules.filter(rule => rule.day_of_week === dayOfWeek);
    
    console.log('📅 Day rules found:', {
      dayOfWeek,
      rulesFound: dayRules.length,
      rules: dayRules.map(r => ({
        start: r.start_time,
        end: r.end_time,
        day: r.day_of_week
      }))
    });
    
    if (dayRules.length === 0) {
      console.log('❌ No rules for this day');
      return [];
    }

    const sessionDuration = sessionSettings.session_duration_minutes;
    const bufferAfter = sessionSettings.buffer_after_minutes;
    const slotInterval = sessionDuration + bufferAfter;

    console.log('📊 Slot calculation parameters:', {
      sessionDuration,
      bufferAfter,
      slotInterval,
      totalSlotTime: `${sessionDuration}min session + ${bufferAfter}min buffer = ${slotInterval}min interval`
    });

    const allSlots: string[] = [];

    // Generate slots for each availability rule
    dayRules.forEach((rule, ruleIndex) => {
      console.log(`🔄 Processing rule ${ruleIndex + 1}:`, {
        startTime: rule.start_time,
        endTime: rule.end_time,
        timezone: rule.timezone
      });
      
      console.log('🔧 About to parse times:', {
        startTimeString: rule.start_time,
        endTimeString: rule.end_time,
        date: format(date, 'yyyy-MM-dd')
      });
      
      const [startHour, startMin] = rule.start_time.split(':').map(Number);
      const [endHour, endMin] = rule.end_time.split(':').map(Number);
      
      const startTime = new Date(date);
      startTime.setHours(startHour, startMin, 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(endHour, endMin, 0, 0);
      
      console.log('⏰ Manual parsed times:', {
        startTime: format(startTime, 'HH:mm'),
        endTime: format(endTime, 'HH:mm'),
        startTimeValid: !isNaN(startTime.getTime()),
        endTimeValid: !isNaN(endTime.getTime())
      });
      
      console.log('✅ Times parsed successfully, setting up loop');
      let currentSlot = startTime;
      let slotCount = 0;
      
      // Fixed loop condition - simple time comparison
      console.log('🎬 About to start loop:', {
        currentSlot: format(currentSlot, 'HH:mm'),
        endTime: format(endTime, 'HH:mm'),
        firstSlotEnd: format(addMinutes(currentSlot, sessionDuration), 'HH:mm'),
        willEnterLoop: addMinutes(currentSlot, sessionDuration) <= endTime
      });
      while (slotCount < 100) { // Safety limit
        console.log(`🚀 Entering loop iteration ${slotCount}, currentSlot: ${format(currentSlot, 'HH:mm')}`);
        const slotEndTime = addMinutes(currentSlot, sessionDuration);
        const slotTime = format(currentSlot, 'HH:mm');
        
        console.log(`📍 Slot ${slotCount + 1}:`, {
          slotTime,
          slotStart: format(currentSlot, 'HH:mm'),
          slotEnd: format(slotEndTime, 'HH:mm'),
          withinBounds: slotEndTime <= endTime,
          currentSlotTime: currentSlot.getTime(),
          endTimeTime: endTime.getTime(),
          timeDifference: endTime.getTime() - slotEndTime.getTime()
        });
        
        // Check if slot end time is within the availability window
        if (slotEndTime <= endTime) {
          
          // Check if this slot conflicts with time blocks
          const isBlocked = timeBlocks.some(block => {
            const blockStart = new Date(block.start_datetime);
            const blockEnd = new Date(block.end_datetime);
            const slotStart = currentSlot;
            const slotEnd = addMinutes(currentSlot, sessionDuration);
            
            const conflicts = (slotEnd > blockStart && slotStart < blockEnd);
            
            if (conflicts) {
              console.log('🚫 Slot blocked by time block:', {
                slot: slotTime,
                blockStart: format(blockStart, 'yyyy-MM-dd HH:mm'),
                blockEnd: format(blockEnd, 'yyyy-MM-dd HH:mm')
              });
            }
            
            return conflicts;
          });

          // Check if this slot conflicts with existing consultations
          const isBooked = existingConsultations.some(consultation => {
            const consultationStart = new Date(consultation.consultation_datetime);
            const consultationEnd = addMinutes(consultationStart, consultation.duration_minutes);
            const slotStart = currentSlot;
            const slotEnd = addMinutes(currentSlot, sessionDuration);
            
            const conflicts = (slotEnd > consultationStart && slotStart < consultationEnd);
            
            if (conflicts) {
              console.log('🚫 Slot conflicts with existing consultation:', {
                slot: slotTime,
                consultationStart: format(consultationStart, 'yyyy-MM-dd HH:mm'),
                consultationEnd: format(consultationEnd, 'yyyy-MM-dd HH:mm')
              });
            }
            
            return conflicts;
          });

          // Add slot if it's not blocked or booked
          if (!isBlocked && !isBooked && !allSlots.includes(slotTime)) {
            allSlots.push(slotTime);
            console.log('✅ Added slot:', slotTime);
          } else {
            console.log('❌ Slot rejected:', {
              slotTime,
              isBlocked,
              isBooked,
              alreadyExists: allSlots.includes(slotTime)
            });
          }
        } else {
          console.log('⏭️ Slot end time exceeds availability window, stopping');
          break;
        }
        
        currentSlot = addMinutes(currentSlot, slotInterval);
        slotCount++;
      }
      
      console.log(`📋 Rule ${ruleIndex + 1} generated ${allSlots.length} slots so far`);
    });

    // Sort slots chronologically
    const sortedSlots = allSlots.sort((a, b) => {
      const timeA = parse(a, 'HH:mm', date);
      const timeB = parse(b, 'HH:mm', date);
      return timeA.getTime() - timeB.getTime();
    });

    console.log('🎯 Final result:', {
      totalSlots: sortedSlots.length,
      slots: sortedSlots,
      firstSlot: sortedSlots[0],
      lastSlot: sortedSlots[sortedSlots.length - 1]
    });

    return sortedSlots;
  }, []);

  return {
    calculateTimeSlotsForDate,
  };
};