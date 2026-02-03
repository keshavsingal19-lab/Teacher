import { WeeklySchedule, ClassSession } from './types';
import { parseTimeStringToMinutes } from './utils/timeUtils';

// Helper to create class objects cleanly
const createClass = (
  day: string,
  start: string,
  end: string,
  type: 'Lecture' | 'Tutorial',
  batch: string,
  room: string,
  extraInfo: string = ''
): ClassSession => {
  return {
    id: `${day}-${start}-${batch}`,
    day,
    startTime: start,
    endTime: end,
    type,
    subject: 'Corporate Laws', // Derived from footer
    batch: `${batch} ${extraInfo}`.trim(),
    room,
    rawTimeStart: parseTimeStringToMinutes(start),
    rawTimeEnd: parseTimeStringToMinutes(end),
  };
};

export const TEACHER_NAME = "Ms. Smita Sharma";

export const TIMETABLE: WeeklySchedule = {
  Monday: [
    createClass('Monday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-C-SEM II', 'CLAW-R1'),
    createClass('Monday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-H-SEM II', 'CLAW-T18', '(Grp H1)'),
  ],
  Tuesday: [
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-L-SEM II', 'CLAW-R1'),
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-N-SEM II', 'CLAW-T18', '(Grp N1)'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-C-SEM II', 'CLAW-R2'),
    createClass('Tuesday', '12:30 PM', '1:30 PM', 'Tutorial', 'MCOM-SEM II', 'CLCA-T9'),
  ],
  Wednesday: [
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-L-SEM II', 'CLAW-R5'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-A-SEM II', 'CLAW-T18', '(Grp A1)'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-H-SEM II', 'CLAW-T18', '(Grp H2)'),
  ],
  Thursday: [
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-L-SEM II', 'CLAW-R1'),
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-A-SEM II', 'CLAW-T18', '(Grp A2)'),
  ],
  Friday: [
    createClass('Friday', '8:30 AM', '9:30 AM', 'Tutorial', 'BCH-L-SEM II', 'CLAW-T9', '(Grp L2)'),
    createClass('Friday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-C-SEM II', 'CLAW-R1'),
    createClass('Friday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-G-SEM II', 'CLAW-T18', '(Grp G1)'),
  ],
  Saturday: [],
  Sunday: []
};