// FIX: Provide full implementation for the API service.
import { USERS, EXAMS } from '../constants/data.ts';
import { User, Exam } from '../types.ts';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const login = async (username: string, password?: string): Promise<User | null> => {
  await delay(500);
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  return null;
};

export const fetchUsers = async (): Promise<User[]> => {
  await delay(500);
  // Return users without passwords
  return USERS.map(user => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  });
};

export const fetchExams = async (): Promise<Exam[]> => {
  await delay(500);
  return EXAMS;
};


export const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
    await delay(500);
    const newUser: User = { ...user, id: Date.now() };
    const userWithPassword = { ...newUser, password: user.password || 'password' };
    USERS.push(userWithPassword);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = userWithPassword;
    return userWithoutPassword;
};

export const updateUser = async (user: User): Promise<User> => {
    await delay(500);
    const index = USERS.findIndex(u => u.id === user.id);
    if (index !== -1) {
        USERS[index] = { ...USERS[index], ...user };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = USERS[index];
    return userWithoutPassword;
};

export const deleteUser = async (userId: number): Promise<void> => {
    await delay(500);
    const index = USERS.findIndex(u => u.id === userId);
    if (index !== -1) {
        USERS.splice(index, 1);
    }
};
