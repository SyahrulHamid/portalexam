// FIX: Provide full content for types.ts to define data structures used across the app.
export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Exam {
  id: number;
  title: string;
  subject: string;
  questions: Question[];
  duration: number; // in seconds
}

export type UserRole = 'admin' | 'guru' | 'murid';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}
