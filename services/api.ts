import { MOCK_EXAMS } from '../constants/data';
import { Exam } from '../types';

// Simulate a network delay
const API_DELAY = 1200; // in milliseconds

/**
 * Fetches the list of all available exams.
 * In a real application, this would be a network request to a backend server.
 * 
 * @returns A Promise that resolves with an array of Exam objects.
 */
export const fetchExams = (): Promise<Exam[]> => {
  console.log('API: Fetching exams...');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // To simulate a potential API error, uncomment the following lines:
      // if (Math.random() > 0.8) {
      //   console.error('API: Simulated fetch error!');
      //   reject(new Error('Simulated API error'));
      //   return;
      // }
      
      console.log('API: Exams fetched successfully.');
      resolve(MOCK_EXAMS);
    }, API_DELAY);
  });
};
