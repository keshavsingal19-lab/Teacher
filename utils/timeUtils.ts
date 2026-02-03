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
