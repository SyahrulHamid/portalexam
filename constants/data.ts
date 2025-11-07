// FIX: Provide full content for data.ts with mock data for the application.
import { Exam, Question, User } from '../types.ts';

const sampleQuestions: Question[] = [
  {
    id: 1,
    questionText: "Apa ibu kota Indonesia?",
    options: ["Jakarta", "Bandung", "Surabaya", "Medan"],
    correctAnswerIndex: 0,
  },
  {
    id: 2,
    questionText: "Siapakah presiden pertama Indonesia?",
    options: ["Soeharto", "Soekarno", "B.J. Habibie", "Joko Widodo"],
    correctAnswerIndex: 1,
  },
  {
    id: 3,
    questionText: "Berapa hasil dari 5 + 7?",
    options: ["10", "11", "12", "13"],
    correctAnswerIndex: 2,
  },
  {
    id: 4,
    questionText: "Planet apa yang dikenal sebagai Planet Merah?",
    options: ["Venus", "Mars", "Jupiter", "Saturnus"],
    correctAnswerIndex: 1,
  },
  {
    id: 5,
    questionText: "Apa nama sungai terpanjang di dunia?",
    options: ["Nil", "Amazon", "Yangtze", "Mississippi"],
    correctAnswerIndex: 0,
  },
];

export const sampleExams: Exam[] = [
  {
    id: 1,
    title: "Ujian Pengetahuan Umum",
    subject: "Umum",
    questions: sampleQuestions,
    duration: 300, // 5 minutes
  },
  {
    id: 2,
    title: "Ujian Matematika Dasar",
    subject: "Matematika",
    questions: [
        { id: 1, questionText: '1 + 1 = ?', options: ['1', '2', '3', '4'], correctAnswerIndex: 1 },
        { id: 2, questionText: '2 * 3 = ?', options: ['4', '5', '6', '7'], correctAnswerIndex: 2 },
    ],
    duration: 120, // 2 minutes
  },
];

export const sampleUsers: User[] = [
  { id: 'admin1', name: 'Admin Utama', role: 'admin' },
  { id: 'guru1', name: 'Budi Hartono', role: 'guru' },
  { id: 'guru2', name: 'Dewi Lestari', role: 'guru' },
  { id: 'murid1', name: 'Siti Aminah', role: 'murid' },
  { id: 'murid2', name: 'Eko Prasetyo', role: 'murid' },
  { id: 'murid3', name: 'Fitriani', role: 'murid' },
  { id: 'murid4', name: 'Rizky Abdullah', role: 'murid' },
];