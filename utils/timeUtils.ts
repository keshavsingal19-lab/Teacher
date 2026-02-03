import { ClassSession } from '../types';

export const parseTimeStringToMinutes = (timeString: string): number => {
  // Expected format "9:30 AM" or "12:30 PM"
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (hours === 12 && modifier === 'AM') {
    hours = 0;
  }
  if (hours !== 12 && modifier === 'PM') {
    hours += 12;
  }

  return hours * 60 + minutes;
};

export const getCurrentDayName = (): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

export const getCurrentMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const getFormattedDate = (): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date().toLocaleDateString('en-US', options);
};

export const getFormattedTime = (): string => {
    return new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

export const getClassStatus = (cls: ClassSession, currentMinutes: number) => {
  if (currentMinutes >= cls.rawTimeStart && currentMinutes < cls.rawTimeEnd) {
    return 'active';
  }
  if (currentMinutes < cls.rawTimeStart) {
    return 'upcoming';
  }
  return 'completed';
};

export const getUpcomingDates = (dayName: string, count: number = 8): Date[] => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const targetDayIndex = days.indexOf(dayName);
  
  if (targetDayIndex === -1) return [];

  const dates: Date[] = [];
  const date = new Date();
  // Normalize to noon to avoid DST/Timezone midnight issues causing date shifts
  date.setHours(12, 0, 0, 0); 
  
  // Find next occurrence (or today if match)
  while (date.getDay() !== targetDayIndex) {
    date.setDate(date.getDate() + 1);
  }

  // Generate count dates
  for (let i = 0; i < count; i++) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 7);
  }

  return dates;
};

// Returns YYYY-MM-DD for storage/comparison
export const toISODate = (date: Date): string => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset*60*1000));
    return localDate.toISOString().split('T')[0];
};

// Returns readable string like "12 Feb 2025"
export const toReadableDate = (date: Date): string => {
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};