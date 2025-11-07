export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number; // in seconds
  questions: Question[];
}

export enum UserRole {
  ADMIN = 'Admin',
  GURU = 'Guru',
  MURID = 'Murid',
}

export enum View {
  LOGIN,
  ADMIN_DASHBOARD,
  GURU_DASHBOARD,
  MURID_DASHBOARD,
  EXAM,
  RESULTS,
}