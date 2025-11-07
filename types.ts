// FIX: Provide full implementation for type definitions.
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
  duration: number; // in seconds
  questions: Question[];
}

export type UserRole = 'admin' | 'guru' | 'murid';

export interface User {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  password?: string; // Password is made optional for security.
}
