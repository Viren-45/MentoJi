// components/expert/profile/booking/types/booking-types.ts

export interface BookingModalProps {
  expertId: string;
  expertName: string;
  isOpen: boolean;
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  selectedDuration: number;
  closeModal: () => void;
  selectDate: (date: Date) => void;
  selectTimeSlot: (timeSlot: string) => void;
  selectDuration: (duration: number) => void;
}

export interface BookingCalendarProps {
  expertId: string;
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  onSelectDate: (date: Date) => void;
  onSelectTimeSlot: (timeSlot: string) => void;
}

export interface TimeSlotGridProps {
  selectedDate: Date;
  selectedTimeSlot: string | null;
  timeSlots: string[];
  loading: boolean;
  onSelectTimeSlot: (timeSlot: string) => void;
}

export interface AvailableDate {
  date: Date;
  hasAvailability: boolean;
}
