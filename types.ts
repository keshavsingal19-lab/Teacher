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

export enum AppState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}