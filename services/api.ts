// FIX: Provide full content for api.ts to create a mock API service.
import { Exam, User } from '../types.ts';
import { sampleExams, sampleUsers } from '../constants/data.ts';

// Simulate API delay
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchExams = async (): Promise<Exam[]> => {
  console.log('Fetching exams...');
  await apiDelay(500);
  console.log('Fetched exams:', sampleExams);
  return sampleExams;
};

export const fetchUsers = async (): Promise<User[]> => {
  console.log('Fetching users...');
  await apiDelay(700);
  // In a real app, an admin might not see themselves in the user list
  const manageableUsers = sampleUsers.filter(u => u.role !== 'admin');
  console.log('Fetched manageable users:', manageableUsers);
  return manageableUsers;
};

export const login = async (username: string, password: string): Promise<User | null> => {
  console.log(`Attempting login for user: ${username}`);
  await apiDelay(500);
  // Simple mock login: find user by username, ignore password
  const user = sampleUsers.find(u => u.id === username);
  if (user) {
    console.log('Login successful for:', user);
    return user;
  }
  console.log('Login failed for:', username);
  return null;
}