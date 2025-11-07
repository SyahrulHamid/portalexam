// FIX: Created mock data for users and exams.
import { User, Exam } from '../types.ts';

export const USERS: User[] = [
  { id: 1, username: 'admin', name: 'Admin Utama', role: 'admin', password: 'admin_854416#', profilePicture: 'https://i.pravatar.cc/150?u=admin' },
  { id: 2, username: '198501012010011001', name: 'Budi Guru', role: 'guru', password: 'password', profilePicture: 'https://i.pravatar.cc/150?u=guru1', nip: '198501012010011001', subject: 'Matematika' },
  { id: 3, username: '199002022015022002', name: 'Ani Guruwati', role: 'guru', password: 'password', profilePicture: 'https://i.pravatar.cc/150?u=guru2', nip: '199002022015022002', subject: 'Ilmu Pengetahuan Alam' },
  { id: 4, username: '0051234567', name: 'Siti Murid', role: 'murid', password: 'password', profilePicture: 'https://i.pravatar.cc/150?u=murid1', nisn: '0051234567', class: 'XII IPA 1' },
  { id: 5, username: '0067654321', name: 'Joko Muridun', role: 'murid', password: 'password', profilePicture: 'https://i.pravatar.cc/150?u=murid2', nisn: '0067654321', class: 'XII IPS 2' },
];

export const EXAMS: Exam[] = [
  {
    id: 1,
    title: 'Ulangan Harian 1: Aljabar Dasar',
    subject: 'Matematika',
    duration: 1800, // 30 minutes
    questions: [
      {
        id: 101,
        questionText: 'Berapakah hasil dari 2x + 5 = 15?',
        options: ['x = 2', 'x = 5', 'x = 10', 'x = 2.5'],
        correctAnswerIndex: 1,
      },
      {
        id: 102,
        questionText: 'Sederhanakan ekspresi 3(a + 2b) - (a - 4b).',
        options: ['2a + 10b', '2a + 2b', '4a + 10b', '4a + 2b'],
        correctAnswerIndex: 0,
      },
      {
        id: 103,
        questionText: 'Jika y = 3, berapakah nilai dari y^2 + 2y - 1?',
        options: ['12', '14', '15', '16'],
        correctAnswerIndex: 1,
      },
      {
        id: 104,
        questionText: 'Faktorkan x^2 - 4.',
        options: ['(x-2)(x-2)', '(x+2)(x+2)', '(x-2)(x+2)', '(x-4)(x+1)'],
        correctAnswerIndex: 2,
      }
    ],
  },
  {
    id: 2,
    title: 'Kuis Singkat: Tata Surya',
    subject: 'Ilmu Pengetahuan Alam',
    duration: 600, // 10 minutes
    questions: [
      {
        id: 201,
        questionText: 'Planet manakah yang dikenal sebagai Planet Merah?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturnus'],
        correctAnswerIndex: 1,
      },
      {
        id: 202,
        questionText: 'Apa nama satelit alami Bumi?',
        options: ['Phobos', 'Europa', 'Bulan', 'Titan'],
        correctAnswerIndex: 2,
      }
    ],
  },
];