export enum DayOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday"
}

export const TIME_SLOTS = [
  "08:30 AM - 09:30 AM", // 0
  "09:30 AM - 10:30 AM", // 1
  "10:30 AM - 11:30 AM", // 2
  "11:30 AM - 12:30 PM", // 3
  "12:30 PM - 01:30 PM", // 4
  "02:00 PM - 03:00 PM", // 5
  "03:00 PM - 04:00 PM", // 6
  "04:00 PM - 05:00 PM", // 7
  "05:00 PM - 06:00 PM"  // 8
] as const;

// Helper to map your class start times to the Room Finder indices
export const getTimeSlotIndex = (startTime: string): number => {
  // Normalize string to match start times
  const start = startTime.trim().toUpperCase();
  if (start.startsWith("8:30") || start.startsWith("08:30")) return 0;
  if (start.startsWith("9:30") || start.startsWith("09:30")) return 1;
  if (start.startsWith("10:30")) return 2;
  if (start.startsWith("11:30")) return 3;
  if (start.startsWith("12:30")) return 4;
  // Index 5 starts at 2:00 PM
  if (start.startsWith("2:00") || start.startsWith("02:00") || start.startsWith("14:00")) return 5;
  if (start.startsWith("3:00") || start.startsWith("03:00") || start.startsWith("15:00")) return 6;
  if (start.startsWith("4:00") || start.startsWith("04:00") || start.startsWith("16:00")) return 7;
  if (start.startsWith("5:00") || start.startsWith("05:00") || start.startsWith("17:00")) return 8;
  
  return 0; // Default fallback
};

export interface RoomSchedule {
  [DayOfWeek.Monday]: number[];
  [DayOfWeek.Tuesday]: number[];
  [DayOfWeek.Wednesday]: number[];
  [DayOfWeek.Thursday]: number[];
  [DayOfWeek.Friday]: number[];
  [DayOfWeek.Saturday]: number[];
}

export type RoomType = 'Lab' | 'Lecture Hall' | 'Seminar Room' | 'Tutorial Room';

export interface RoomData {
  id: string;
  name: string;
  type: RoomType;
  emptySlots: RoomSchedule;
}

export const ROOMS_DATA: RoomData[] = [
  // --- LABS (Updated from Doc) ---
  { "id": "CL1", "name": "CL1", "type": "Lab", "emptySlots": { "Monday": [], "Tuesday": [], "Wednesday": [7, 8], "Thursday": [], "Friday": [7, 8], "Saturday": [0, 3, 4, 5, 6, 7, 8] } },
  { "id": "CL2", "name": "CL2", "type": "Lab", "emptySlots": { "Monday": [], "Tuesday": [], "Wednesday": [5, 6, 7, 8], "Thursday": [], "Friday": [7, 8], "Saturday": [0, 3, 4, 5, 6, 7, 8] } },
  { "id": "CLIB", "name": "CLIB", "type": "Lab", "emptySlots": { "Monday": [], "Tuesday": [6, 7], "Wednesday": [5, 6, 7, 8], "Thursday": [4], "Friday": [5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  
  // --- LECTURE HALLS (Updated from Doc) ---
  { "id": "PB2", "name": "PB2", "type": "Lecture Hall", "emptySlots": { "Monday": [1, 5, 6, 7, 8], "Tuesday": [0, 1, 3], "Wednesday": [0, 3, 5, 6, 7, 8], "Thursday": [7, 8], "Friday": [5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "PB3", "name": "PB3", "type": "Lecture Hall", "emptySlots": { "Monday": [8], "Tuesday": [8], "Wednesday": [8], "Thursday": [], "Friday": [6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "PB4", "name": "PB4", "type": "Lecture Hall", "emptySlots": { "Monday": [4], "Tuesday": [8], "Wednesday": [8], "Thursday": [8], "Friday": [7, 8], "Saturday": [4, 5, 6, 7, 8] } },
  { "id": "R1", "name": "R1", "type": "Lecture Hall", "emptySlots": { "Monday": [8], "Tuesday": [8], "Wednesday": [5, 6, 7, 8], "Thursday": [5, 6, 7, 8], "Friday": [5, 6, 7, 8], "Saturday": [3, 4, 5, 6, 7, 8] } },
  { "id": "R2", "name": "R2", "type": "Lecture Hall", "emptySlots": { "Monday": [3, 4], "Tuesday": [6, 7, 8], "Wednesday": [5, 6, 7, 8], "Thursday": [5, 6, 7, 8], "Friday": [5, 6, 7, 8], "Saturday": [4, 5, 6, 7, 8] } },
  { "id": "R3", "name": "R3", "type": "Lecture Hall", "emptySlots": { "Monday": [8], "Tuesday": [8], "Wednesday": [8], "Thursday": [7, 8], "Friday": [8], "Saturday": [3, 4, 5, 6, 7, 8] } },
  { "id": "R4", "name": "R4", "type": "Lecture Hall", "emptySlots": { "Monday": [0, 1, 2, 3, 4], "Tuesday": [], "Wednesday": [8], "Thursday": [7, 8], "Friday": [], "Saturday": [7, 8] } },
  { "id": "R5", "name": "R5", "type": "Lecture Hall", "emptySlots": { "Monday": [4, 7, 8], "Tuesday": [7, 8], "Wednesday": [], "Thursday": [7, 8], "Friday": [5, 6, 7, 8], "Saturday": [5, 6, 7, 8] } },
  { "id": "R6", "name": "R6", "type": "Lecture Hall", "emptySlots": { "Monday": [0, 8], "Tuesday": [7, 8], "Wednesday": [6, 7, 8], "Thursday": [], "Friday": [6, 7, 8], "Saturday": [0, 1, 5, 6, 7, 8] } },
  { "id": "R7", "name": "R7", "type": "Lecture Hall", "emptySlots": { "Monday": [3, 4], "Tuesday": [8], "Wednesday": [8], "Thursday": [8], "Friday": [5, 6, 7, 8], "Saturday": [0, 5, 6, 7, 8] } },
  { "id": "R8", "name": "R8", "type": "Lecture Hall", "emptySlots": { "Monday": [3, 4], "Tuesday": [8], "Wednesday": [5, 6, 7, 8], "Thursday": [5, 6, 7, 8], "Friday": [5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "R10", "name": "R10", "type": "Lecture Hall", "emptySlots": { "Monday": [3, 4], "Tuesday": [], "Wednesday": [5, 6, 7, 8], "Thursday": [], "Friday": [5, 6, 7, 8], "Saturday": [5, 6, 7, 8] } },
  { "id": "R13", "name": "R13", "type": "Lecture Hall", "emptySlots": { "Monday": [], "Tuesday": [8], "Wednesday": [8], "Thursday": [], "Friday": [], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "R14", "name": "R14", "type": "Lecture Hall", "emptySlots": { "Monday": [0, 3, 4, 5, 6, 7, 8], "Tuesday": [8], "Wednesday": [8], "Thursday": [], "Friday": [7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "R15", "name": "R15", "type": "Lecture Hall", "emptySlots": { "Monday": [], "Tuesday": [], "Wednesday": [8], "Thursday": [], "Friday": [5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "R16", "name": "R16", "type": "Lecture Hall", "emptySlots": { "Monday": [0, 1, 2, 3, 4, 8], "Tuesday": [7, 8], "Wednesday": [8], "Thursday": [7, 8], "Friday": [5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "R17", "name": "R17", "type": "Lecture Hall", "emptySlots": { "Monday": [], "Tuesday": [7, 8], "Wednesday": [7, 8], "Thursday": [], "Friday": [7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "R18", "name": "R18", "type": "Lecture Hall", "emptySlots": { "Monday": [3, 4], "Tuesday": [7, 8], "Wednesday": [8], "Thursday": [], "Friday": [6, 7, 8], "Saturday": [5, 6, 7, 8] } },
  { "id": "R19", "name": "R19", "type": "Lecture Hall", "emptySlots": { "Monday": [], "Tuesday": [8], "Wednesday": [7, 8], "Thursday": [], "Friday": [5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "R20", "name": "R20", "type": "Lecture Hall", "emptySlots": { "Monday": [0, 1, 2, 3, 4, 8], "Tuesday": [], "Wednesday": [5, 6, 7, 8], "Thursday": [8], "Friday": [6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "R21", "name": "R21", "type": "Lecture Hall", "emptySlots": { "Monday": [3, 4, 8], "Tuesday": [], "Wednesday": [8], "Thursday": [8], "Friday": [7, 8], "Saturday": [3, 4, 5, 6, 7, 8] } },
  { "id": "R22", "name": "R22", "type": "Lecture Hall", "emptySlots": { "Monday": [3, 4], "Tuesday": [4], "Wednesday": [7, 8], "Thursday": [6, 7, 8], "Friday": [6, 7, 8], "Saturday": [5, 6, 7, 8] } },
  { "id": "R23", "name": "R23", "type": "Lecture Hall", "emptySlots": { "Monday": [4], "Tuesday": [], "Wednesday": [5, 8], "Thursday": [8], "Friday": [8], "Saturday": [5, 6, 7, 8] } },
  { "id": "R24", "name": "R24", "type": "Lecture Hall", "emptySlots": { "Monday": [7, 8], "Tuesday": [], "Wednesday": [5, 6, 7, 8], "Thursday": [7, 8], "Friday": [6, 7, 8], "Saturday": [5, 6, 7, 8] } },
  { "id": "R25", "name": "R25", "type": "Lecture Hall", "emptySlots": { "Monday": [0, 4, 7, 8], "Tuesday": [], "Wednesday": [8], "Thursday": [6, 7, 8], "Friday": [5, 6, 7, 8], "Saturday": [4, 5, 6, 7, 8] } },
  { "id": "R26", "name": "R26", "type": "Lecture Hall", "emptySlots": { "Monday": [5, 6, 7, 8], "Tuesday": [5, 6, 7, 8], "Wednesday": [5, 6, 7, 8], "Thursday": [4, 5, 6, 7, 8], "Friday": [5, 6, 7, 8], "Saturday": [4, 5, 6, 7, 8] } },
  { "id": "R27", "name": "R27", "type": "Lecture Hall", "emptySlots": { "Monday": [5, 6, 7, 8], "Tuesday": [5, 6, 7, 8], "Wednesday": [5, 6, 7, 8], "Thursday": [4, 5, 6, 7, 8], "Friday": [5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "R28", "name": "R28", "type": "Lecture Hall", "emptySlots": { "Monday": [5, 6, 7, 8], "Tuesday": [5, 6, 7, 8], "Wednesday": [5, 6, 7, 8], "Thursday": [5, 6, 7, 8], "Friday": [5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "R29", "name": "R29", "type": "Lecture Hall", "emptySlots": { "Monday": [0], "Tuesday": [], "Wednesday": [7, 8], "Thursday": [], "Friday": [4, 7, 8], "Saturday": [3, 4, 5, 6, 7, 8] } },
  { "id": "R30", "name": "R30", "type": "Lecture Hall", "emptySlots": { "Monday": [], "Tuesday": [], "Wednesday": [5, 6, 7, 8], "Thursday": [], "Friday": [5, 6, 7, 8], "Saturday": [0, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "R31", "name": "R31", "type": "Lecture Hall", "emptySlots": { "Monday": [2, 3], "Tuesday": [6, 7, 8], "Wednesday": [5, 6, 7, 8], "Thursday": [], "Friday": [0, 4, 5, 6, 7, 8], "Saturday": [0, 3, 4, 5, 6, 7, 8] } },
  { "id": "R32", "name": "R32", "type": "Lecture Hall", "emptySlots": { "Monday": [3, 4, 5, 6, 7, 8], "Tuesday": [4, 6, 7, 8], "Wednesday": [5, 6, 7, 8], "Thursday": [6, 7, 8], "Friday": [5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "R33", "name": "R33", "type": "Lecture Hall", "emptySlots": { "Monday": [5, 6, 7, 8], "Tuesday": [8], "Wednesday": [5, 6, 7, 8], "Thursday": [4, 6, 7, 8], "Friday": [5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "R34", "name": "R34", "type": "Lecture Hall", "emptySlots": { "Monday": [5, 6, 7, 8], "Tuesday": [8], "Wednesday": [5, 6, 7, 8], "Thursday": [7, 8], "Friday": [5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "R35", "name": "R35", "type": "Lecture Hall", "emptySlots": { "Monday": [0, 5, 6, 7, 8], "Tuesday": [8], "Wednesday": [8], "Thursday": [7, 8], "Friday": [8], "Saturday": [0, 4, 5, 6, 7, 8] } },
  { "id": "R37", "name": "R37", "type": "Lecture Hall", "emptySlots": { "Monday": [5, 6, 7, 8], "Tuesday": [7, 8], "Wednesday": [7, 8], "Thursday": [7, 8], "Friday": [7, 8], "Saturday": [4, 5, 6, 7, 8] } },
  
  // --- SEMINAR ROOMS (Updated from Doc) ---
  { "id": "SCR1", "name": "SCR1", "type": "Seminar Room", "emptySlots": { "Monday": [3, 7, 8], "Tuesday": [8], "Wednesday": [6, 7, 8], "Thursday": [7, 8], "Friday": [6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "SCR2", "name": "SCR2", "type": "Seminar Room", "emptySlots": { "Monday": [0, 1, 3, 4, 5, 6, 7, 8], "Tuesday": [7, 8], "Wednesday": [6, 7, 8], "Thursday": [0, 1, 7, 8], "Friday": [1, 2, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "SCR3", "name": "SCR3", "type": "Seminar Room", "emptySlots": { "Monday": [0, 1, 2, 3, 4, 5, 8], "Tuesday": [7, 8], "Wednesday": [6, 7, 8], "Thursday": [1], "Friday": [1, 2, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "SCR4", "name": "SCR4", "type": "Seminar Room", "emptySlots": { "Monday": [0, 1, 2, 3, 4, 7, 8], "Tuesday": [], "Wednesday": [7, 8], "Thursday": [1, 3], "Friday": [0, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },

  // --- TUTORIAL ROOMS (Preserved as requested) ---
  { "id": "T1", "name": "T1", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 3, 4, 5, 6, 7, 8], "Tuesday": [4, 5, 6, 7, 8], "Wednesday": [4, 5, 6, 7, 8], "Thursday": [3, 4, 5, 6, 7, 8], "Friday": [4, 5, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T2", "name": "T2", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 3, 4, 5, 6, 7, 8], "Tuesday": [5, 6, 7, 8], "Wednesday": [5, 6, 7, 8], "Thursday": [5, 6, 7, 8], "Friday": [3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 3, 4, 5, 6, 7, 8] } },
  { "id": "T3", "name": "T3", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 5, 6, 7, 8], "Tuesday": [0, 4, 5, 6, 7, 8], "Wednesday": [4, 5, 6, 7, 8], "Thursday": [4, 5, 6, 7, 8], "Friday": [4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T4", "name": "T4", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 2, 3, 5, 6, 7, 8], "Tuesday": [2, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 1, 4, 5, 6, 7, 8], "Thursday": [7, 8], "Friday": [5, 6], "Saturday": [0, 1, 2, 4, 5, 6, 7, 8] } },
  { "id": "T5", "name": "T5", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 3, 4, 5, 6, 7, 8], "Tuesday": [4, 5, 6, 7, 8], "Wednesday": [4, 5, 6, 7, 8], "Thursday": [4, 5, 6, 7, 8], "Friday": [4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T6", "name": "T6", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 2, 4, 5, 6, 7, 8], "Tuesday": [0, 1, 4, 5, 6, 7, 8], "Wednesday": [0, 1, 4, 5, 6, 7, 8], "Thursday": [0, 1, 4, 5, 6, 7, 8], "Friday": [0, 1, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 4, 5, 6, 7, 8] } },
  { "id": "T7", "name": "T7", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 5, 6, 7, 8], "Tuesday": [0, 4, 5, 6, 7, 8], "Wednesday": [0, 4, 5, 6, 7, 8], "Thursday": [0, 3, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T8", "name": "T8", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 4, 5, 6, 7, 8], "Wednesday": [0, 1, 4, 5, 6, 7, 8], "Thursday": [4, 5, 6, 7, 8], "Friday": [4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T9", "name": "T9", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 1, 4, 5, 6, 7, 8], "Thursday": [0, 1, 2, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T11", "name": "T11", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 3, 4, 5, 6, 7, 8], "Thursday": [0, 2, 3, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T12", "name": "T12", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 2, 5, 6, 7, 8], "Tuesday": [0, 1, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 3, 4, 5, 6, 7, 8], "Thursday": [0, 5, 6, 7, 8], "Friday": [0, 5, 6, 7, 8], "Saturday": [0, 1, 3, 4, 5, 6, 7, 8] } },
  { "id": "T13", "name": "T13", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 3, 4, 5, 6, 7, 8], "Thursday": [0, 3, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T14", "name": "T14", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 5, 6, 7, 8], "Tuesday": [0, 5, 6, 7, 8], "Wednesday": [0, 5, 6, 7, 8], "Thursday": [0, 5, 6, 7, 8], "Friday": [0, 5, 6, 7, 8], "Saturday": [0, 5, 6, 7, 8] } },
  { "id": "T15", "name": "T15", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 2, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 1, 2, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 1, 2, 3, 4, 5, 6, 7, 8], "Thursday": [0, 1, 5, 6, 7, 8], "Friday": [0, 1, 2, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T16", "name": "T16", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 5, 6, 7, 8], "Wednesday": [0, 1, 5, 6, 7, 8], "Thursday": [0, 1, 5, 6, 7, 8], "Friday": [0, 1, 4, 5, 6, 7, 8], "Saturday": [0, 1, 4, 5, 6, 7, 8] } },
  { "id": "T17", "name": "T17", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 3, 4, 5, 6, 7, 8], "Thursday": [0, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T18", "name": "T18", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 2, 4, 5, 6, 7, 8], "Wednesday": [0, 2, 4, 5, 6, 7, 8], "Thursday": [0, 2, 4, 5, 6, 7, 8], "Friday": [0, 1, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T23", "name": "T23", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 2, 4, 5, 6, 7, 8], "Tuesday": [0, 2, 4, 5, 6, 7, 8], "Wednesday": [0, 2, 4, 5, 6, 7, 8], "Thursday": [0, 2, 4, 5, 6, 7, 8], "Friday": [0, 1, 4, 5, 6, 7, 8], "Saturday": [0, 1, 4, 5, 6, 7, 8] } },
  { "id": "T24", "name": "T24", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 2, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 1, 4, 5, 6, 7, 8], "Wednesday": [0, 1, 4, 5, 6, 7, 8], "Thursday": [0, 1, 4, 5, 6, 7, 8], "Friday": [0, 1, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T25", "name": "T25", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 2, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 2, 4, 5, 6, 7, 8], "Wednesday": [0, 2, 4, 5, 6, 7, 8], "Thursday": [0, 2, 4, 5, 6, 7, 8], "Friday": [0, 2, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T26", "name": "T26", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 1, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 1, 3, 4, 5, 6, 7, 8], "Thursday": [0, 1, 3, 4, 5, 6, 7, 8], "Friday": [0, 1, 2, 3, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T27", "name": "T27", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 2, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 2, 4, 5, 6, 7, 8], "Wednesday": [0, 2, 4, 5, 6, 7, 8], "Thursday": [0, 2, 4, 5, 6, 7, 8], "Friday": [0, 2, 4, 5, 6, 7, 8], "Saturday": [0, 1, 4, 5, 6, 7, 8] } },
  { "id": "T29", "name": "T29", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 1, 4, 5, 6, 7, 8], "Wednesday": [0, 1, 4, 5, 6, 7, 8], "Thursday": [0, 1, 2, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T31", "name": "T31", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 2, 4, 5, 6, 7, 8], "Wednesday": [0, 2, 4, 5, 6, 7, 8], "Thursday": [0, 2, 5, 6, 7, 8], "Friday": [0, 2, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T32", "name": "T32", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 1, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 1, 3, 4, 5, 6, 7, 8], "Thursday": [0, 1, 3, 4, 5, 6, 7, 8], "Friday": [0, 1, 3, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T33", "name": "T33", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 2, 5, 6, 7, 8], "Tuesday": [0, 2, 4, 5, 6, 7, 8], "Wednesday": [0, 2, 4, 5, 6, 7, 8], "Thursday": [0, 2, 4, 5, 6, 7, 8], "Friday": [0, 2, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T34", "name": "T34", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 2, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 1, 2, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 1, 2, 3, 4, 5, 6, 7, 8], "Thursday": [0, 1, 4, 5, 6, 7, 8], "Friday": [0, 1, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T35", "name": "T35", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 1, 4, 5, 6, 7, 8], "Wednesday": [0, 2, 3, 5, 6, 7, 8], "Thursday": [0, 3, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T36", "name": "T36", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 3, 4, 5, 6, 7, 8], "Thursday": [0, 3, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 4, 5, 6, 7, 8] } },
  { "id": "T37", "name": "T37", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 1, 4, 5, 6, 7, 8], "Wednesday": [0, 3, 4, 5, 6, 7, 8], "Thursday": [0, 3, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 4, 5, 6, 7, 8] } },
  { "id": "T38", "name": "T38", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 2, 4, 5, 6, 7, 8], "Thursday": [0, 2, 4, 5, 6, 7, 8], "Friday": [0, 2, 4, 5, 6, 7, 8], "Saturday": [0, 1, 4, 5, 6, 7, 8] } },
  { "id": "T39", "name": "T39", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 3, 4, 5, 6, 7, 8], "Thursday": [0, 3, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T40", "name": "T40", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 3, 4, 5, 6, 7, 8], "Thursday": [0, 3, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 4, 5, 6, 7, 8] } },
  { "id": "T41", "name": "T41", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 2, 4, 5, 6, 7, 8], "Wednesday": [0, 2, 4, 5, 6, 7, 8], "Thursday": [0, 2, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T42", "name": "T42", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 4, 5, 6, 7, 8], "Tuesday": [0, 4, 5, 6, 7, 8], "Wednesday": [0, 4, 5, 6, 7, 8], "Thursday": [0, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T43", "name": "T43", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 3, 4, 5, 6, 7, 8], "Thursday": [0, 2, 4, 5, 6, 7, 8], "Friday": [0, 2, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T44", "name": "T44", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 3, 4, 5, 6, 7, 8], "Thursday": [0, 3, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T45", "name": "T45", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 1, 2, 4, 5, 6, 7, 8], "Thursday": [0, 1, 2, 4, 5, 6, 7, 8], "Friday": [0, 1, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T46", "name": "T46", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 2, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 3, 4, 5, 6, 7, 8], "Thursday": [0, 3, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T48", "name": "T48", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 2, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 1, 2, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 1, 4, 5, 6, 7, 8], "Thursday": [0, 1, 2, 3, 4, 5, 6, 7, 8], "Friday": [0, 1, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T49", "name": "T49", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 2, 4, 5, 6, 7, 8], "Wednesday": [0, 2, 4, 5, 6, 7, 8], "Thursday": [0, 2, 4, 5, 6, 7, 8], "Friday": [0, 2, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T50", "name": "T50", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 2, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 3, 4, 5, 6, 7, 8], "Thursday": [0, 3, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
  { "id": "T51", "name": "T51", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 2, 4, 5, 6, 7, 8], "Tuesday": [0, 2, 4, 5, 6, 7, 8], "Wednesday": [0, 2, 4, 5, 6, 7, 8], "Thursday": [0, 2, 4, 5, 6, 7, 8], "Friday": [0, 2, 4, 5, 6, 7, 8], "Saturday": [0, 1, 3, 4, 5, 6, 7, 8] } },
  { "id": "T53", "name": "T53", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 2, 3, 4, 5, 6, 7, 8], "Tuesday": [0, 3, 4, 5, 6, 7, 8], "Wednesday": [0, 3, 4, 5, 6, 7, 8], "Thursday": [0, 3, 4, 5, 6, 7, 8], "Friday": [0, 3, 4, 5, 6, 7, 8], "Saturday": [0, 3, 4, 5, 6, 7, 8] } },
  { "id": "T54", "name": "T54", "type": "Tutorial Room", "emptySlots": { "Monday": [0, 1, 4, 5, 6, 7, 8], "Tuesday": [0, 1, 4, 5, 6, 7, 8], "Wednesday": [0, 1, 4, 5, 6, 7, 8], "Thursday": [0, 1, 4, 5, 6, 7, 8], "Friday": [0, 1, 4, 5, 6, 7, 8], "Saturday": [0, 1, 3, 4, 5, 6, 7, 8] } }
];

export const getAvailableRooms = (
  selectedDay: DayOfWeek, 
  selectedTimeIndex: number,
  searchQuery: string = '',
  filterType: string = 'All'
): RoomData[] => {
  return ROOMS_DATA.filter(room => {
    // 1. Check if room is free at selected slot
    const isFree = room.emptySlots[selectedDay]?.includes(selectedTimeIndex);
    
    // 2. Check search query
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 3. Check type filter
    const matchesType = filterType === 'All' || room.type === filterType;

    return isFree && matchesSearch && matchesType;
  });
};