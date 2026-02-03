export interface ClassSession {
  id: string;
  day: string;
  startTime: string; // Format "HH:MM AM/PM"
  endTime: string;   // Format "HH:MM AM/PM"
  type: 'Lecture' | 'Tutorial' | 'Lab';
  subject: string;
  batch: string;
  room: string;
  rawTimeStart: number; // Minutes from midnight for easy calculation
  rawTimeEnd: number;   // Minutes from midnight
}

export type WeeklySchedule = {
  [key: string]: ClassSession[];
};

export interface TeacherProfile {
  id: string; // Passcode
  name: string;
  department?: string;
  schedule: WeeklySchedule;
}

export interface ClassNote {
  id: string;
  sessionId: string; // Links to the class slot
  targetDate: string; // ISO Date string YYYY-MM-DD
  targetDateDisplay: string; // Readable date
  day: string;
  timeSlot: string;
  batch: string;
  text: string;
  link?: string;
  createdAt: number;
}

export enum AppState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}