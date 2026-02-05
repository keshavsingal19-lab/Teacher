// functions/teacherData.js

// 1. Helper Function: Convert "9:30 AM" to minutes
const parseTimeStringToMinutes = (timeString) => {
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

// 2. Helper Function: Create Class Object
const createClass = (
  day,
  start,
  end,
  type,
  batch,
  room,
  subject
) => {
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

const EMPTY_SCHEDULE = {
  Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
};

// --- EXISTING DATA SECTION ---

// Data for Dr. Amanpreet Kaur (ANK)
const scheduleANK = {
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
const scheduleMTS = {
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
const scheduleMDH = {
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
const scheduleRAS = {
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
const scheduleAVB = {
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

// Data for Ms. Smita Sharma (SIS)
const scheduleSIS = {
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

// --- PREVIOUSLY ADDED TEACHERS ---

// Prof. Aruna Jha (AAJ)
const scheduleAAJ = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-B-SEM VI', 'R8', 'Corp. Gov'),
    createClass('Monday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-K-SEM VI', 'T29-K2', 'Corp. Gov'),
  ],
  Tuesday: [
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-B-SEM VI', 'R8', 'Corp. Gov'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-G-SEM VI', 'T29-G2', 'Corp. Gov'),
    createClass('Tuesday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-J-SEM VI', 'T29-J1', 'Corp. Gov'),
  ],
  Wednesday: [
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Lecture', 'BAHE-C-SEM II', 'R24', 'Fin. Mgmt (Beg)'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-B-SEM VI', 'R8', 'Corp. Gov'),
  ],
  Thursday: [
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Lecture', 'BAHE-C-SEM II', 'R24', 'Fin. Mgmt (Beg)'),
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Tutorial', 'BAHE-C-SEM II', 'T29-C1', 'Fin. Mgmt (Beg)'),
    createClass('Thursday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-E-SEM VI', 'T29-E2', 'Corp. Gov'),
  ],
  Friday: [
    createClass('Friday', '10:30 AM', '11:30 AM', 'Lecture', 'BAHE-C-SEM II', 'R24', 'Fin. Mgmt (Beg)'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Tutorial', 'BAHE-C-SEM II', 'T29-C3', 'Fin. Mgmt (Beg)'),
  ]
};

// Ms. Renu Agarwal (RUA)
const scheduleRUA = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-B-SEM II', 'CLAW-R2', 'Company Law'),
    createClass('Monday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-C-SEM II', 'CLAW-T9-C1', 'Company Law'),
  ],
  Tuesday: [
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-B-SEM II', 'CLAW-R2', 'Company Law'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-I-SEM II', 'CLAW-T9-11', 'Company Law'),
    createClass('Tuesday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-K-SEM II', 'T9-K3', 'HRM'),
  ],
  Wednesday: [
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-F-SEM II', 'CLAW-R2', 'Company Law'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-C-SEM II', 'CLAW-T9-C2', 'Company Law'),
  ],
  Thursday: [
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-B-SEM II', 'CLAW-R2', 'Company Law'),
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-F-SEM II', 'CLAW-R1', 'Company Law'),
    createClass('Thursday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-K-SEM II', 'CLAW-T9-K1', 'Company Law'),
  ],
  Friday: [
    createClass('Friday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-F-SEM II', 'CLAW-R2', 'Company Law'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-J-SEM II', 'CLAW-T9-1', 'Company Law'),
    createClass('Friday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-F-SEM II', 'CLAW-T9-F3', 'Company Law'),
  ]
};

// Dr. Reena Chadha (RNC)
const scheduleRNC = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-J-SEM II', 'CLAW-R1', 'Company Law'),
    createClass('Monday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-E-SEM II', 'CLAW-T17-E3', 'Company Law'),
    createClass('Monday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-C-SEM VIII', 'T17-EM4', 'Event Mgmt'),
  ],
  Tuesday: [
    createClass('Tuesday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-M-SEM II', 'CLAW-R1', 'Company Law'),
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-F-SEM II', 'CLAW-T17-F2', 'Company Law'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-B-SEM VIII', 'T17-EM4', 'Event Mgmt'),
  ],
  Wednesday: [
    createClass('Wednesday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-J-SEM II', 'CLAW-R1', 'Company Law'),
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-D-SEM II', 'CLAW-T17-D3', 'Company Law'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-M-SEM II', 'CLAW-R1', 'Company Law'),
  ],
  Thursday: [
    createClass('Thursday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-M-SEM II', 'CLAW-R1', 'Company Law'),
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-F-SEM II', 'CLAW-T17-F1', 'Company Law'),
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-A-SEM II', 'CLAW-T17-A3', 'Company Law'),
  ],
  Friday: [
    createClass('Friday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-J-SEM II', 'CLAW-R1', 'Company Law'),
    createClass('Friday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-D-SEM II', 'CLAW-T17-D1', 'Company Law'),
    createClass('Friday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-G-SEM II', 'CLAW-T17-G2', 'Company Law'),
  ]
};

// Prof. Deepashree (DPE)
const scheduleDPE = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-C-SEM IV', 'T15', 'Intl. Business'),
    createClass('Monday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-C-SEM IV', 'T15', 'Intl. Business'),
    createClass('Monday', '2:00 PM', '3:00 PM', 'Lecture', 'JOINT-SEM II', 'R3-VAC19', 'Art of Being Happy'),
    createClass('Monday', '3:00 PM', '4:00 PM', 'Lab', 'JOINT-SEM II', 'R3-VAC20', 'Art of Being Happy'),
    createClass('Monday', '4:00 PM', '5:00 PM', 'Lab', 'JOINT-SEM II', 'R3-VAC20', 'Art of Being Happy'),
  ],
  Tuesday: [
    createClass('Tuesday', '2:00 PM', '3:00 PM', 'Lecture', 'JOINT-SEM IV', 'R3-VAC14', 'Art of Being Happy'),
    createClass('Tuesday', '3:00 PM', '4:00 PM', 'Lab', 'JOINT-SEM IV', 'R3-VAC15', 'Art of Being Happy'),
    createClass('Tuesday', '4:00 PM', '5:00 PM', 'Lab', 'JOINT-SEM IV', 'R3-VAC15', 'Art of Being Happy'),
  ],
  Wednesday: [
    createClass('Wednesday', '2:00 PM', '3:00 PM', 'Lecture', 'JOINT-SEM II', 'R3-VAC20', 'Art of Being Happy'),
    createClass('Wednesday', '3:00 PM', '4:00 PM', 'Lab', 'JOINT-SEM II', 'R3-VAC19', 'Art of Being Happy'),
    createClass('Wednesday', '4:00 PM', '5:00 PM', 'Lab', 'JOINT-SEM II', 'R3-VAC19', 'Art of Being Happy'),
  ],
  Thursday: [
    createClass('Thursday', '2:00 PM', '3:00 PM', 'Lecture', 'JOINT-SEM IV', 'R3-VAC15', 'Art of Being Happy'),
    createClass('Thursday', '3:00 PM', '4:00 PM', 'Lab', 'JOINT-SEM IV', 'R3-VAC14', 'Art of Being Happy'),
    createClass('Thursday', '4:00 PM', '5:00 PM', 'Lab', 'JOINT-SEM IV', 'R3-VAC14', 'Art of Being Happy'),
  ],
  Friday: [
    createClass('Friday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-C-SEM IV', 'T15-C1', 'Intl. Business'),
    createClass('Friday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-C-SEM IV', 'T15-C2', 'Intl. Business'),
  ]
};

// Dr. Sneh Lata Gupta (SLG)
const scheduleSLG = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-E-SEM IV', 'R17', 'Cost Accounting'),
  ],
  Tuesday: [
    createClass('Tuesday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-E-SEM IV', 'R21', 'Cost Accounting'),
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-C-SEM IV', 'T8-C2', 'Cost Accounting'),
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-M-SEM IV', 'R5', 'Cost Accounting'),
  ],
  Wednesday: [
    createClass('Wednesday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-E-SEM IV', 'R21', 'Cost Accounting'),
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-B-SEM IV', 'T8-B1', 'Cost Accounting'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-B-SEM IV', 'T8-B2', 'Cost Accounting'),
  ],
  Thursday: [
    createClass('Thursday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-M-SEM IV', 'R27', 'Cost Accounting'),
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-A-SEM IV', 'T8-A2', 'Cost Accounting'),
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-B-SEM IV', 'T8-B3', 'Cost Accounting'),
  ],
  Friday: [
    createClass('Friday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-M-SEM IV', 'R8', 'Cost Accounting'),
    createClass('Friday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-C-SEM IV', 'T8-C3', 'Cost Accounting'),
    createClass('Friday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-A-SEM IV', 'T8-A3', 'Cost Accounting'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Tutorial', 'MCOM-SEM II', 'T8', 'Adv Mgmt A/c'),
  ]
};

// Prof. Surya Prakash (SAP)
const scheduleSAP = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-C-SEM VI', 'R10', 'Advertising'),
    createClass('Monday', '11:30 AM', '12:30 PM', 'Tutorial', 'MCOM-SEM IV', 'T12', 'Consumer Beh.'),
    createClass('Monday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-C-SEM VI', 'T12-ADV7', 'Advertising'),
  ],
  Tuesday: [
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-C-SEM VI', 'R10', 'Advertising'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-A-SEM VI', 'R10', 'Advertising'),
  ],
  Wednesday: [
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-A-SEM VI', 'R10', 'Advertising'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Tutorial', 'MCOM-SEM II', 'T12', 'Consumer Beh.'),
  ],
  Thursday: [
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-A-SEM VI', 'T12-ADV2', 'Advertising'),
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-A-SEM VI', 'R8', 'Advertising'),
    createClass('Thursday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-E-SEM VI', 'T12-ADV15', 'Advertising'),
  ],
  Friday: [
    createClass('Friday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-D-SEM VI', 'T12-ADV10', 'Advertising'),
    createClass('Friday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-C-SEM VI', 'R10', 'Advertising'),
  ]
};

// Prof. Naveen Mittal (NNM)
const scheduleNNM = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-A-SEM VI', 'R34', 'GST & Customs'),
    createClass('Monday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-H-SEM VI', 'T35-H3', 'GST & Customs'),
    createClass('Monday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-G-SEM VI', 'R21', 'GST & Customs'),
    createClass('Monday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-F-SEM VI', 'T35-F1', 'GST & Customs'),
    createClass('Monday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-K-SEM VI', 'T35-K1', 'GST & Customs'),
  ],
  Tuesday: [
    createClass('Tuesday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-A-SEM VI', 'R13', 'GST & Customs'),
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-E-SEM VI', 'T35-E2', 'GST & Customs'),
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-M-SEM VI', 'T35-M2', 'GST & Customs'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Tutorial', 'MCOM-SEM IV', 'T35', 'Corp Tax'),
  ],
  Thursday: [
    createClass('Thursday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-A-SEM VI', 'R21', 'GST & Customs'),
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-J-SEM VI', 'T35-J3', 'GST & Customs'),
  ],
  Friday: [
    createClass('Friday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-G-SEM VI', 'R5', 'GST & Customs'),
    createClass('Friday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-C-SEM VI', 'T35-C3', 'GST & Customs'),
  ],
  Saturday: [
    createClass('Saturday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-G-SEM VI', 'R10', 'GST & Customs'),
  ]
};

// Dr. Jigmet Wangdus (JTW)
const scheduleJTW = {
  ...EMPTY_SCHEDULE,
  Tuesday: [
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-F-SEM IV', 'T50-F3', 'Intl. Business'),
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-A-SEM IV', 'R3', 'Intl. Business'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-I-SEM IV', 'R21', 'Intl. Business'),
  ],
  Wednesday: [
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-H-SEM IV', 'T50-H3', 'Intl. Business'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-A-SEM IV', 'R34', 'Intl. Business'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-L-SEM IV', 'T45-L1', 'Intl. Business'),
    createClass('Wednesday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-H-SEM IV', 'R17', 'Intl. Business'),
  ],
  Thursday: [
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-A-SEM IV', 'R13', 'Intl. Business'),
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-D-SEM IV', 'T50-D3', 'Intl. Business'),
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-C-SEM VI', 'T50-C1', 'Corp. Gov'),
    createClass('Thursday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-H-SEM IV', 'R32', 'Intl. Business'),
  ],
  Friday: [
    createClass('Friday', '8:30 AM', '9:30 AM', 'Tutorial', 'BCH-H-SEM VI', 'T50-H1', 'Corp. Gov'),
    createClass('Friday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-I-SEM IV', 'R32', 'Intl. Business'),
    createClass('Friday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-G-SEM IV', 'T50-G3', 'Intl. Business'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-H-SEM IV', 'R3', 'Intl. Business'),
  ],
  Saturday: [
    createClass('Saturday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-I-SEM IV', 'R1', 'Intl. Business'),
  ]
};

// Dr. Shashank Vikram Pratap Singh (SVP)
const scheduleSVP = {
  ...EMPTY_SCHEDULE,
  Wednesday: [
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-M-SEM IV', 'R27', 'Intl. Business'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-N-SEM IV', 'T14-N3', 'Intl. Business'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-D-SEM II', 'R33', 'HRM'),
    createClass('Wednesday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-D-SEM II', 'R3', 'HRM'),
    createClass('Wednesday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-F-SEM II', 'T14-F3', 'HRM'),
    createClass('Wednesday', '1:30 PM', '2:30 PM', 'Lecture', 'BCH-D-SEM IV', 'R18', 'Intl. Business'),
  ],
  Thursday: [
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-M-SEM IV', 'R28', 'Intl. Business'),
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-I-SEM II', 'T14-I1', 'HRM'),
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-D-SEM IV', 'T14-D2', 'Intl. Business'),
    createClass('Thursday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-D-SEM IV', 'R13', 'Intl. Business'),
    createClass('Thursday', '1:30 PM', '2:30 PM', 'Tutorial', 'BCH-C-SEM II', 'T14-C2', 'HRM'),
  ],
  Friday: [
    createClass('Friday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-D-SEM IV', 'T14-D1', 'Intl. Business'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-M-SEM IV', 'R8', 'Intl. Business'),
    createClass('Friday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-D-SEM IV', 'R13', 'Intl. Business'),
  ],
  Saturday: [
    createClass('Saturday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-D-SEM II', 'R35', 'HRM'),
    createClass('Saturday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-M-SEM II', 'T14-M1', 'HRM'),
  ]
};

// Dr. Saumya Aggarwal (SAA)
const scheduleSAA = {
  ...EMPTY_SCHEDULE,
  Tuesday: [
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Lab', 'BCH-L-SEM VI', 'R4-LP2', 'Business Analytics'),
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-M-SEM VI', 'CL1-MP2', 'Business Analytics'),
  ],
  Wednesday: [
    createClass('Wednesday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-L-SEM VI', 'R32', 'Business Analytics'),
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Lab', 'BCH-B-SEM VI', 'CL1-BP2', 'Business Analytics'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-B-SEM VI', 'CL1-BP2', 'Business Analytics'),
  ],
  Thursday: [
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Lab', 'BCH-L-SEM VI', 'R19-LP2', 'Business Analytics'),
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-L-SEM VI', 'R19-LP2', 'Business Analytics'),
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Lab', 'BCH-M-SEM VI', 'CL1-MP2', 'Business Analytics'),
    createClass('Thursday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-J-SEM VI', 'R34', 'Business Analytics'),
  ],
  Friday: [
    createClass('Friday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-L-SEM VI', 'CL1', 'Business Analytics'),
    createClass('Friday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-B-SEM VI', 'CLIB-BP2', 'Business Analytics'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Lab', 'BCH-B-SEM VI', 'CLIB-BP2', 'Business Analytics'),
    createClass('Friday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-J-SEM VI', 'R32', 'Business Analytics'),
  ],
  Saturday: [
    createClass('Saturday', '9:30 AM', '10:30 AM', 'Lab', 'BCH-N-SEM VI', 'CL1-NP2', 'Business Analytics'),
    createClass('Saturday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-N-SEM VI', 'CL1-NP2', 'Business Analytics'),
  ]
};

// Dr. Amit Kumar (ATK)
const scheduleATK = {
  ...EMPTY_SCHEDULE,
  Tuesday: [
    createClass('Tuesday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-G-SEM IV', 'CL2', 'Business Stats'),
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-J-SEM IV', 'R3', 'Business Stats'),
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-G-SEM IV', 'R4-GP2', 'Business Stats'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Lab', 'BCH-J-SEM IV', 'R4-JP2', 'Business Stats'),
  ],
  Wednesday: [
    createClass('Wednesday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-J-SEM IV', 'CLIB', 'Business Stats'),
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Lab', 'BCH-J-SEM IV', 'R16-JP2', 'Business Stats'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-J-SEM IV', 'SCR1-JP1', 'Business Stats'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-B-SEM VI', 'T49-B3', 'GST & Customs'),
  ],
  Thursday: [
    createClass('Thursday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-G-SEM IV', 'R33', 'Business Stats'),
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Lab', 'BCH-J-SEM IV', 'SCR1-JP1', 'Business Stats'),
    createClass('Thursday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-E-SEM VI', 'T49-E1', 'GST & Customs'),
  ],
  Friday: [
    createClass('Friday', '8:30 AM', '9:30 AM', 'Lab', 'BCH-G-SEM IV', 'R6-GP1', 'Business Stats'),
    createClass('Friday', '9:30 AM', '10:30 AM', 'Lab', 'BCH-G-SEM IV', 'R6-GP2', 'Business Stats'),
    createClass('Friday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-J-SEM IV', 'R18', 'Business Stats'),
  ],
  Saturday: [
    createClass('Saturday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-G-SEM IV', 'R2', 'Business Stats'),
    createClass('Saturday', '9:30 AM', '10:30 AM', 'Lab', 'BCH-G-SEM IV', 'R2-GP1', 'Business Stats'),
  ]
};

// --- NEW TEACHERS FROM RECENT PDF ---

// Ms. Anubha Godara (AAG)
const scheduleAAG = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-H-SEM VI', 'CL2', 'Business Analytics'), // Room implied from Wed, or R16 from Tue
    createClass('Monday', '11:30 AM', '12:30 PM', 'Lab', 'BCH-H-SEM VI', 'CL2', 'Business Analytics'),
  ],
  Tuesday: [
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-H-SEM VI', 'R16-HP2', 'Business Analytics'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Lab', 'BCH-H-SEM VI', 'R16-HP2', 'Business Analytics'),
  ],
  Wednesday: [
    createClass('Wednesday', '8:30 AM', '9:30 AM', 'Tutorial', 'BCH-E-SEM VI', 'T37-ADV14', 'Advertising'),
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-C-SEM VI', 'T45-ADV8', 'Advertising'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-H-SEM VI', 'CL2-HP2', 'Business Analytics'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Lab', 'BCH-H-SEM VI', 'CL2-HP2', 'Business Analytics'),
    createClass('Wednesday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-H-SEM VI', 'T50-ADV24', 'Advertising'),
  ],
  Thursday: [
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-B-SEM VI', 'T37-ADV4', 'Advertising'),
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-B-SEM VI', 'T41-ADV5', 'Advertising'),
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-G-SEM VI', 'R1', 'Advertising'),
    createClass('Thursday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-D-SEM VI', 'T39-ADV11', 'Advertising'),
  ],
  Friday: [
    createClass('Friday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-J-SEM VI', 'R31-JP2', 'Business Analytics'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Lab', 'BCH-J-SEM VI', 'R31-JP2', 'Business Analytics'),
    createClass('Friday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-G-SEM VI', 'R22', 'Advertising'),
    createClass('Friday', '2:00 PM', '3:00 PM', 'Tutorial', 'BCH-H-SEM VI', 'T46-ADV23', 'Advertising'),
  ],
  Saturday: [
    createClass('Saturday', '1:30 PM', '2:30 PM', 'Lecture', 'BCH-G-SEM VI', 'R22', 'Advertising'), // Adjusted based on column count
  ]
};

// Dr. Anuj Jatav (AJJ)
const scheduleAJJ = {
  ...EMPTY_SCHEDULE,
  Tuesday: [
    createClass('Tuesday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-H-SEM VI', 'R34', 'Corp. Gov'),
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-E-SEM VI', 'T40-E3', 'Corp. Gov'),
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-G-SEM VI', 'T40-G3', 'Corp. Gov'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-D-SEM VI', 'R17', 'Corp. Gov'),
  ],
  Wednesday: [
    createClass('Wednesday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-H-SEM VI', 'R33', 'Corp. Gov'),
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-C-SEM VI', 'T40-C3', 'Corp. Gov'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-I-SEM VI', 'LIBRARY FF', 'Corp. Gov'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Tutorial', 'MCOM-SEM IV', 'T49', 'EXIM'),
  ],
  Thursday: [
    createClass('Thursday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-H-SEM VI', 'R31', 'Corp. Gov'),
    createClass('Thursday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-F-SEM VI', 'T40-F2', 'Corp. Gov'),
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-I-SEM VI', 'R22', 'Corp. Gov'),
  ],
  Friday: [
    createClass('Friday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-D-SEM VI', 'R32', 'Corp. Gov'),
    createClass('Friday', '9:30 AM', '10:30 AM', 'Lecture', 'BCH-I-SEM VI', 'LIBRARY FF', 'Corp. Gov'),
    createClass('Friday', '10:30 AM', '11:30 AM', 'Tutorial', 'BCH-A-SEM VI', 'T40-A2', 'Corp. Gov'),
  ],
  Saturday: [
    createClass('Saturday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-D-SEM VI', 'R22', 'Corp. Gov'),
    createClass('Saturday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-N-SEM VI', 'T38-N1', 'Corp. Gov'),
  ]
};

// Dr. Asha Rani (AAR)
const scheduleAAR = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-E-SEM IV', 'R22', 'Business Stats'),
    createClass('Monday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-B-SEM IV', 'R3', 'Business Stats'),
  ],
  Tuesday: [
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-A-SEM VI', 'T33-A2', 'GST'),
    createClass('Tuesday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-B-SEM IV', 'R3', 'Business Stats'),
    createClass('Tuesday', '2:00 PM', '3:00 PM', 'Lab', 'BCH-E-SEM IV', 'R14-EP1', 'Business Stats'),
    createClass('Tuesday', '3:00 PM', '4:00 PM', 'Lab', 'BCH-E-SEM IV', 'R14-EP1', 'Business Stats'),
    createClass('Tuesday', '4:00 PM', '5:00 PM', 'Lecture', 'BCH-E-SEM IV', 'R17', 'Business Stats'),
  ],
  Wednesday: [
    createClass('Wednesday', '2:00 PM', '3:00 PM', 'Lab', 'BCH-E-SEM IV', 'R14-EP2', 'Business Stats'),
    createClass('Wednesday', '3:00 PM', '4:00 PM', 'Lab', 'BCH-E-SEM IV', 'R14-EP2', 'Business Stats'),
    createClass('Wednesday', '4:00 PM', '5:00 PM', 'Lab', 'BCH-B-SEM IV', 'R6-BP1', 'Business Stats'),
  ],
  Thursday: [
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-B-SEM IV', 'R27', 'Business Stats'),
    createClass('Thursday', '2:00 PM', '3:00 PM', 'Lab', 'BCH-B-SEM IV', 'R14-BP2', 'Business Stats'),
  ],
  Friday: [
    createClass('Friday', '8:30 AM', '9:30 AM', 'Lecture', 'BCH-E-SEM IV', 'R3', 'Business Stats'),
    createClass('Friday', '9:30 AM', '10:30 AM', 'Tutorial', 'BCH-A-SEM VI', 'T33-A1', 'GST'),
    createClass('Friday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-B-SEM IV', 'R14-BP2', 'Business Stats'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Lab', 'BCH-B-SEM IV', 'R14-BP1', 'Business Stats'),
  ]
};

// Ms. Priyanka Bhatia (PB)
const schedulePB = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '10:30 AM', '11:30 AM', 'Lecture', 'BAHE-B-SEM IV', 'R25', 'Intro Econometrics'),
    createClass('Monday', '11:30 AM', '12:30 PM', 'Lecture', 'BAHE-A-SEM IV', 'R24', 'Intro Econometrics'),
  ],
  Tuesday: [
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Lecture', 'BAHE-A-SEM IV', 'R24', 'Intro Econometrics'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Lab', 'BAHE-A-SEM IV', 'R29-A3', 'Intro Econometrics'),
  ],
  Wednesday: [
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Lecture', 'BAHE-B-SEM IV', 'R24', 'Intro Econometrics'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Lab', 'BAHE-B-SEM IV', 'R29-B1', 'Intro Econometrics'),
    createClass('Wednesday', '12:30 PM', '1:30 PM', 'Lab', 'BAHE-B-SEM IV', 'R29-B2', 'Intro Econometrics'),
  ],
  Thursday: [
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Lecture', 'BAHE-A-SEM IV', 'R24', 'Intro Econometrics'),
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Lab', 'BAHE-A-SEM IV', 'R29-A1', 'Intro Econometrics'),
    createClass('Thursday', '12:30 PM', '1:30 PM', 'Lab', 'BAHE-A-SEM IV', 'R29-A2', 'Intro Econometrics'),
  ],
  Friday: [
    createClass('Friday', '10:30 AM', '11:30 AM', 'Lecture', 'BAHE-B-SEM IV', 'R24', 'Intro Econometrics'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Lab', 'BAHE-B-SEM IV', 'R29-B3', 'Intro Econometrics'),
  ]
};

// Ms. Shreya Shreedhar (SHS)
const scheduleSHS = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '8:30 AM', '9:30 AM', 'Tutorial', 'BAHE-A-SEM VIII', 'T2-A3', 'EDPI'),
    createClass('Monday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-J-SEM II', 'T1-J2', 'PME-1'),
    createClass('Monday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-A-SEM VIII', 'R6', 'SIIE'),
    createClass('Monday', '2:00 PM', '3:00 PM', 'Lecture', 'BCH-A-SEM VIII', 'R6', 'SIIE'),
    createClass('Monday', '3:00 PM', '4:00 PM', 'Lecture', 'BCH-G-SEM VI', 'R3', 'SIIE'),
    createClass('Monday', '4:00 PM', '5:00 PM', 'Lecture', 'BCH-G-SEM VI', 'R3', 'SIIE'),
    createClass('Monday', '5:00 PM', '6:00 PM', 'Lecture', 'BCH-A-SEM VIII', 'R4', 'SIIE'),
  ],
  Tuesday: [
    createClass('Tuesday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-B-SEM VIII', 'R6', 'SIIE'),
    createClass('Tuesday', '2:00 PM', '3:00 PM', 'Lecture', 'BCH-B-SEM VIII', 'R6', 'SIIE'),
    createClass('Tuesday', '3:00 PM', '4:00 PM', 'Lecture', 'BCH-K-SEM VI', 'R3', 'SIIE'),
    createClass('Tuesday', '4:00 PM', '5:00 PM', 'Lecture', 'BCH-K-SEM VI', 'R3', 'SIIE'),
    createClass('Tuesday', '5:00 PM', '6:00 PM', 'Lecture', 'BCH-B-SEM VIII', 'R4', 'SIIE'),
  ],
  Wednesday: [
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-C-SEM VIII', 'R6', 'SIIE'),
    createClass('Wednesday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-C-SEM VIII', 'R6', 'SIIE'),
    createClass('Wednesday', '2:00 PM', '3:00 PM', 'Lecture', 'BCH-C-SEM VIII', 'R6', 'SIIE'),
    createClass('Wednesday', '3:00 PM', '4:00 PM', 'Lecture', 'BCH-M-SEM VI', 'R3', 'SIIE'),
    createClass('Wednesday', '4:00 PM', '5:00 PM', 'Lecture', 'BCH-M-SEM VI', 'R3', 'SIIE'),
    createClass('Wednesday', '5:00 PM', '6:00 PM', 'Lecture', 'BCH-C-SEM VIII', 'R4', 'SIIE'),
  ]
};

// Mr. Ashwani Kumar (AK)
const scheduleAK = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '9:30 AM', '10:30 AM', 'Lecture', 'BAHE-C-SEM II', 'R37', 'Intro Macro'),
    createClass('Monday', '10:30 AM', '11:30 AM', 'Tutorial', 'BAHE-D-SEM II', 'T30-D3', 'Intro Macro'),
  ],
  Tuesday: [
    createClass('Tuesday', '9:30 AM', '10:30 AM', 'Lecture', 'BAHE-D-SEM II', 'R37', 'Intro Macro'),
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BAHE-C-SEM II', 'T30-C1', 'Intro Macro'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-F-SEM II', 'T26-F1', 'PME-1'),
    createClass('Tuesday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-G-SEM II', 'T30-G1', 'PME-1'),
  ],
  Wednesday: [
    createClass('Wednesday', '9:30 AM', '10:30 AM', 'Lecture', 'BAHE-C-SEM II', 'R8', 'Intro Macro'),
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Tutorial', 'BAHE-D-SEM II', 'T30-D1', 'Intro Macro'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Tutorial', 'BAHE-C-SEM II', 'T30-C2', 'Intro Macro'),
    createClass('Wednesday', '12:30 PM', '1:30 PM', 'Tutorial', 'BCH-C-SEM II', 'T30-C1', 'PME-1'),
  ],
  Friday: [
    createClass('Friday', '9:30 AM', '10:30 AM', 'Lecture', 'BAHE-D-SEM II', 'R37', 'Intro Macro'),
    createClass('Friday', '10:30 AM', '11:30 AM', 'Tutorial', 'BAHE-D-SEM II', 'T31-D2', 'Intro Macro'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Tutorial', 'BCH-B-SEM II', 'T30-B1', 'PME-1'),
  ],
  Saturday: [
    createClass('Saturday', '9:30 AM', '10:30 AM', 'Lecture', 'BAHE-C-SEM II', 'R26', 'Intro Macro'),
    createClass('Saturday', '10:30 AM', '11:30 AM', 'Lecture', 'BAHE-D-SEM II', 'PB4', 'Intro Macro'),
    createClass('Saturday', '11:30 AM', '12:30 PM', 'Tutorial', 'BAHE-C-SEM II', 'T30-C3', 'Intro Macro'),
  ]
};

// Dr. Prashasti Singh (PRS)
const schedulePRS = {
  ...EMPTY_SCHEDULE,
  Monday: [
    createClass('Monday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-L-SEM II', 'R30', 'DAVP'),
    createClass('Monday', '11:30 AM', '12:30 PM', 'Lab', 'BCH-A-SEM VI', 'CL1', 'Data Privacy'),
    createClass('Monday', '12:30 PM', '1:30 PM', 'Lab', 'BCH-A-SEM VI', 'CL1', 'Data Privacy'),
  ],
  Tuesday: [
    createClass('Tuesday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-L-SEM II', 'R30', 'DAVP'),
    createClass('Tuesday', '11:30 AM', '12:30 PM', 'Lab', 'BAHE-D/BCH-N', 'R31', 'Web Prog'),
    createClass('Tuesday', '12:30 PM', '1:30 PM', 'Lab', 'BAHE-D/BCH-N', 'R31', 'Web Prog'),
  ],
  Wednesday: [
    createClass('Wednesday', '10:30 AM', '11:30 AM', 'Lab', 'BCH-L-SEM II', 'R30', 'DAVP'),
    createClass('Wednesday', '11:30 AM', '12:30 PM', 'Lecture', 'BAHE-D/BCH-N', 'R16', 'Web Prog'),
    createClass('Wednesday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-A-SEM VI', 'R30', 'Data Privacy'),
  ],
  Thursday: [
    createClass('Thursday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-L-SEM II', 'R30', 'DAVP'),
    createClass('Thursday', '11:30 AM', '12:30 PM', 'Lecture', 'BAHE-D/BCH-N', 'R16', 'Web Prog'),
    createClass('Thursday', '12:30 PM', '1:30 PM', 'Lecture', 'BCH-A-SEM VI', 'R35', 'Data Privacy'),
  ],
  Friday: [
    createClass('Friday', '10:30 AM', '11:30 AM', 'Lecture', 'BCH-L-SEM II', 'R30', 'DAVP'),
    createClass('Friday', '11:30 AM', '12:30 PM', 'Lecture', 'BCH-A-SEM VI', 'R35', 'Data Privacy'),
    createClass('Friday', '12:30 PM', '1:30 PM', 'Lecture', 'BAHE-D/BCH-N', 'R19', 'Web Prog'),
  ]
};

export const TEACHERS = {
  // Existing
  'ANK': { id: 'ANK', name: 'Dr. Amanpreet Kaur', department: 'Sustainability Marketing & HRM', schedule: scheduleANK },
  'MTS': { id: 'MTS', name: 'Ms. Manpreet Sharma', department: 'Business Statistics & HRM', schedule: scheduleMTS },
  'MDH': { id: 'MDH', name: 'Mr. Mohd. Hassan', department: 'International Business & Company Law', schedule: scheduleMDH },
  'RAS': { id: 'RAS', name: 'Dr. Rutika Saini', department: 'Corp. Governance & Business Ethics', schedule: scheduleRAS },
  'AVB': { id: 'AVB', name: 'Mr. Anuj Vijay Bhatia', department: 'Corp. Governance & Finance', schedule: scheduleAVB },
  'SIS': { id: 'SIS', name: 'Ms. Smita Sharma', department: 'Corporate Laws', schedule: scheduleSIS },
  'abcd': { id: 'abcd', name: 'Ms. Smita Sharma', department: 'Corporate Laws', schedule: scheduleSIS },
  
  // Previous PDF
  'AAJ': { id: 'AAJ', name: 'Prof. Aruna Jha', department: 'Corporate Governance & Fin Mgmt', schedule: scheduleAAJ },
  'RUA': { id: 'RUA', name: 'Ms. Renu Agarwal', department: 'HRM & Company Law', schedule: scheduleRUA },
  'RNC': { id: 'RNC', name: 'Dr. Reena Chadha', department: 'Event Mgmt & Company Law', schedule: scheduleRNC },
  'DPE': { id: 'DPE', name: 'Prof. Deepashree', department: 'International Business & VAC', schedule: scheduleDPE },
  'SLG': { id: 'SLG', name: 'Dr. Sneh Lata Gupta', department: 'Cost Accounting & Mgmt', schedule: scheduleSLG },
  'SAP': { id: 'SAP', name: 'Prof. Surya Prakash', department: 'Consumer Behaviour & Advertising', schedule: scheduleSAP },
  'NNM': { id: 'NNM', name: 'Prof. Naveen Mittal', department: 'GST & Corporate Tax', schedule: scheduleNNM },
  'JTW': { id: 'JTW', name: 'Dr. Jigmet Wangdus', department: 'Corp. Governance & Intl. Business', schedule: scheduleJTW },
  'SVP': { id: 'SVP', name: 'Dr. Shashank Vikram Pratap Singh', department: 'Intl. Business & HRM', schedule: scheduleSVP },
  'SAA': { id: 'SAA', name: 'Dr. Saumya Aggarwal', department: 'Business Analytics', schedule: scheduleSAA },
  'ATK': { id: 'ATK', name: 'Dr. Amit Kumar', department: 'Business Stats & GST', schedule: scheduleATK },

  // New PDF
  'AAG': { id: 'AAG', name: 'Ms. Anubha Godara', department: 'Advertising & Business Analytics', schedule: scheduleAAG },
  'AJJ': { id: 'AJJ', name: 'Dr. Anuj Jatav', department: 'EXIM & Corp. Governance', schedule: scheduleAJJ },
  'AAR': { id: 'AAR', name: 'Dr. Asha Rani', department: 'GST & Business Stats', schedule: scheduleAAR },
  'PB':  { id: 'PB',  name: 'Ms. Priyanka Bhatia', department: 'Intro Econometrics', schedule: schedulePB },
  'SHS': { id: 'SHS', name: 'Ms. Shreya Shreedhar', department: 'Indian Economy & Macro', schedule: scheduleSHS },
  'AK':  { id: 'AK',  name: 'Mr. Ashwani Kumar', department: 'Intro Macroeconomics', schedule: scheduleAK },
  'PRS': { id: 'PRS', name: 'Dr. Prashasti Singh', department: 'Computer Science', schedule: schedulePRS }
};