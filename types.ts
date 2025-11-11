export interface Submission {
  id: string;
  classId: string; // Added class context
  studentName: string;
  file: File;
  fileURL: string;
  grade: number | null;
  feedback: string | null;
  submittedAt: Date;
}

export interface Class {
  id: string;
  name: string;
}

export type Role = 'student' | 'teacher';

// Student is now tied to a class for attendance purposes
export interface Student {
  id:string;
  classId: string;
  name: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}
