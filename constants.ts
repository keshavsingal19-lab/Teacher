import { WeeklySchedule, ClassSession, TeacherProfile } from './types';
import { parseTimeStringToMinutes } from './utils/timeUtils';

// Helper to create class objects cleanly
const createClass = (
  day: string,
  start: string,
  end: string,
  type: 'Lecture' | 'Tutorial' | 'Lab',
  batch: string,
  room: string,
  subject: string
): ClassSession => {
  return {
    id: `${day}-${start}-${batch}-${room}`.replace(/\s+/g, '-'),
    day,
    startTime: start,
    endTime: end,
    type,
    subject,
    batch,
    room,
    rawTimeStart: parseTimeStringToMinutes(start),
    rawTimeEnd: parseTimeStringToMinutes(end),
  };
};

const EMPTY_SCHEDULE: WeeklySchedule = {
  Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
};

// Data for Dr. Amanpreet Kaur (ANK)
const scheduleANK: WeeklySchedule = {
  ...EMPTY_SCHEDULE,
  Monday: [createClass('Monday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-H-SEM IV', 'R22', 'Commerce-SM')],
  Tuesday: [
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-G-SEM IV', 'R13', 'Commerce-SM'),
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-I-SEM IV', 'T42-I2', 'Commerce-SM'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-G-SEM IV', 'T33-G1', 'Commerce-SM'),
    createClass('Tuesday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-J-SEM IV', 'T33-J2', 'Commerce-SM'),
  ],
  Wednesday: [
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-J-SEM IV', 'T5-J1', 'Commerce-SM'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-I-SEM IV', 'T4-I1', 'Commerce-SM'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-H-SEM IV', 'R22', 'Commerce-SM'),
  ],
  Thursday: [
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-J-SEM II', 'T5-J1', 'Commerce-HRM'),
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-G-SEM IV', 'R15', 'Commerce-SM'),
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-I-SEM IV', 'T33-I3', 'Commerce-SM'),
  ],
  Friday: [
    createClass('Friday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-M-SEM II', 'T5-M2', 'Commerce-HRM'),
    createClass('Friday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-H-SEM IV', 'R26', 'Commerce-SM'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-G-SEM IV', 'R34', 'Commerce-SM'),
  ]
};

// Data for Ms. Manpreet Sharma (MTS)
const scheduleMTS: WeeklySchedule = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-A-SEM IV', 'R15', 'Bus. Stats'),
    createClass('Monday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-D-SEM IV', 'R15', 'Bus. Stats'),
  ],
  Tuesday: [
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-A-SEM IV', 'R32', 'Bus. Stats'),
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-D-SEM IV', 'R20-DP1', 'Bus. Stats'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Lab', 'BCH-D-SEM IV', 'R20-DP2', 'Bus. Stats'),
  ],
  Wednesday: [
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-A-SEM IV', 'R28', 'Bus. Stats'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-D-SEM IV', 'R20-DP1', 'Bus. Stats'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Lab', 'BCH-D-SEM IV', 'R20-DP2', 'Bus. Stats'),
  ],
  Thursday: [
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-D-SEM IV', 'R15', 'Bus. Stats'),
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-A-SEM II', 'T33-A1', 'HRM'),
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Lab', 'BCH-A-SEM IV', 'R20-AP1', 'Bus. Stats'),
    createClass('Thursday', '12:30 PM', '1:30 PM', 'Lab', 'BCH-A-SEM IV', 'R20-AP2', 'Bus. Stats'),
  ],
  Friday: [
    createClass('Friday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-D-SEM IV', 'R15', 'Bus. Stats'),
    createClass('Friday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-G-SEM II', 'T46-G3', 'HRM'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Lab', 'BCH-A-SEM IV', 'R20-AP1', 'Bus. Stats'),
    createClass('Friday', '12:30 PM', '1:30 PM', 'Lab', 'BCH-A-SEM IV', 'R20-AP2', 'Bus. Stats'),
  ]
};

// Data for Mr. Mohd. Hassan (MDH)
const scheduleMDH: WeeklySchedule = {
  ...EMPTY_SCHEDULE,
  Tuesday: [
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-L-SEM IV', 'T24-L2', 'Commerce-IB'),
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-G-SEM IV', 'T27-G2', 'Commerce-IB'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-C-SEM IV', 'R23', 'Commerce-IB'),
    createClass('Tuesday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-E-SEM IV', 'R13', 'Commerce-IB'),
  ],
  Wednesday: [
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-H-SEM IV', 'T23-H1', 'Commerce-IB'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-B-SEM IV', 'T1-B2', 'Commerce-IB'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-C-SEM IV', 'R35', 'Commerce-IB'),
    createClass('Wednesday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-G-SEM IV', 'R18', 'Commerce-IB'),
  ],
  Thursday: [
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-I-SEM II', 'T50-I2', 'CLAW'),
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-M-SEM IV', 'T5-M3', 'Commerce-IB'),
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-E-SEM IV', 'R7', 'Commerce-IB'),
    createClass('Thursday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-G-SEM IV', 'R18', 'Commerce-IB'),
  ],
  Friday: [
    createClass('Friday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-M-SEM IV', 'T35-M2', 'Commerce-IB'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-E-SEM IV', 'R13', 'Commerce-IB'),
    createClass('Friday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-C-SEM IV', 'R28', 'Commerce-IB'),
  ],
  Saturday: [
    createClass('Saturday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-G-SEM IV', 'R2', 'Commerce-IB'),
  ]
};

// Data for Dr. Rutika Saini (RAS)
const scheduleRAS: WeeklySchedule = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-G-SEM VI', 'R18', 'Corp. Gov.'),
    createClass('Monday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-L-SEM VI', 'T43-L3', 'Corp. Gov.'),
  ],
  Tuesday: [
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-F-SEM VI', 'PB3', 'Corp. Gov.'),
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-J-SEM VI', 'T43-J2', 'Corp. Gov.'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-E-SEM VI', 'R33', 'Corp. Gov.'),
  ],
  Wednesday: [
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-K-SEM VI', 'T43-K1', 'Corp. Gov.'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-G-SEM VI', 'R33', 'Corp. Gov.'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-E-SEM VI', 'R33', 'Corp. Gov.'),
    createClass('Wednesday', '12:30 PM', '1:30 PM', 'Tutorial', 'MCOM-SEM II', 'T40-A2', 'CGBE'),
  ],
  Thursday: [
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-G-SEM VI', 'R21', 'Corp. Gov.'),
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-B-SEM VI', 'T43-B3', 'Corp. Gov.'),
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-F-SEM VI', 'R18', 'Corp. Gov.'),
  ],
  Friday: [
    createClass('Friday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-F-SEM VI', 'R28', 'Corp. Gov.'),
    createClass('Friday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-A-SEM VI', 'T43-A3', 'Corp. Gov.'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-M-SEM VI', 'T43-M1', 'Corp. Gov.'),
    createClass('Friday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-E-SEM VI', 'R33', 'Corp. Gov.'),
  ]
};

// Data for Mr. Anuj Vijay Bhatia (AVB)
const scheduleAVB: WeeklySchedule = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-M-SEM VI', 'R34', 'Corp. Gov.'),
    createClass('Monday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-L-SEM VI', 'T29-L2', 'Corp. Gov.'),
    createClass('Monday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-K-SEM VI', 'R33', 'Corp. Gov.'),
  ],
  Tuesday: [
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-M-SEM VI', 'R15', 'Corp. Gov.'),
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-J-SEM VI', 'T29-J3', 'Corp. Gov.'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-J-SEM VI', 'R34', 'Corp. Gov.'),
  ],
  Wednesday: [
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-M-SEM VI', 'R34', 'Corp. Gov.'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-K-SEM VI', 'T29-K3', 'Corp. Gov.'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-J-SEM VI', 'R34', 'Corp. Gov.'),
    createClass('Wednesday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-F-SEM VI', 'T29-F1', 'Corp. Gov.'),
  ],
  Thursday: [
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-K-SEM VI', 'PB3', 'Corp. Gov.'),
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-J-SEM VI', 'R33', 'Corp. Gov.'),
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Tutorial', 'BAHE-C-SEM II', 'T24-C2', 'Fin. Mgmt'),
  ],
  Friday: [
    createClass('Friday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-K-SEM VI', 'R34', 'Corp. Gov.'),
    createClass('Friday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-M-SEM VI', 'T29-M3', 'Corp. Gov.'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-M-SEM VI', 'T30-M2', 'Corp. Gov.'),
  ]
};

// Data for Ms. Smita Sharma (SIS) - Existing data
const scheduleSIS: WeeklySchedule = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-C-SEM II', 'CLAW-R1', 'Corp. Laws'),
    createClass('Monday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-H-SEM II', 'CLAW-T18', 'Corp. Laws'),
  ],
  Tuesday: [
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-L-SEM II', 'CLAW-R1', 'Corp. Laws'),
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-N-SEM II', 'CLAW-T18', 'Corp. Laws'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-C-SEM II', 'CLAW-R2', 'Corp. Laws'),
    createClass('Tuesday', '12:30 PM', '1:30 PM', 'Tutorial', 'MCOM-SEM II', 'CLCA-T9', 'Corp. Laws'),
  ],
  Wednesday: [
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-L-SEM II', 'CLAW-R5', 'Corp. Laws'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-A-SEM II', 'CLAW-T18', 'Corp. Laws'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-H-SEM II', 'CLAW-T18', 'Corp. Laws'),
  ],
  Thursday: [
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-L-SEM II', 'CLAW-R1', 'Corp. Laws'),
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-A-SEM II', 'CLAW-T18', 'Corp. Laws'),
  ],
  Friday: [
    createClass('Friday', '8:30 AM', '9:30 AM', 'Tutorial', 'BCH-L-SEM II', 'CLAW-T9', 'Corp. Laws'),
    createClass('Friday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-C-SEM II', 'CLAW-R1', 'Corp. Laws'),
    createClass('Friday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-G-SEM II', 'CLAW-T18', 'Corp. Laws'),
  ]
};

export const TEACHERS: Record<string, TeacherProfile> = {
  'ANK': { id: 'ANK', name: 'Dr. Amanpreet Kaur', department: 'Sustainability Marketing & HRM', schedule: scheduleANK },
  'MTS': { id: 'MTS', name: 'Ms. Manpreet Sharma', department: 'Business Statistics & HRM', schedule: scheduleMTS },
  'MDH': { id: 'MDH', name: 'Mr. Mohd. Hassan', department: 'International Business & Company Law', schedule: scheduleMDH },
  'RAS': { id: 'RAS', name: 'Dr. Rutika Saini', department: 'Corp. Governance & Business Ethics', schedule: scheduleRAS },
  'AVB': { id: 'AVB', name: 'Mr. Anuj Vijay Bhatia', department: 'Corp. Governance & Finance', schedule: scheduleAVB },
  'SIS': { id: 'SIS', name: 'Ms. Smita Sharma', department: 'Corporate Laws', schedule: scheduleSIS },
  'abcd': { id: 'abcd', name: 'Ms. Smita Sharma', department: 'Corporate Laws', schedule: scheduleSIS } // Legacy/Fallback
};