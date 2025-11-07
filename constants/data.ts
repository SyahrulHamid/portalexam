import { Exam } from '../types';

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'mat-001',
    title: 'Ujian Matematika Dasar',
    subject: 'Matematika',
    duration: 300, // 5 minutes
    questions: [
      {
        id: 1,
        questionText: 'Berapakah hasil dari 15 + 27?',
        options: ['32', '42', '45', '52'],
        correctAnswerIndex: 1,
      },
      {
        id: 2,
        questionText: 'Berapakah hasil dari 8 x 9?',
        options: ['64', '72', '81', '68'],
        correctAnswerIndex: 1,
      },
      {
        id: 3,
        questionText: 'Jika sebuah persegi memiliki sisi 5 cm, berapakah kelilingnya?',
        options: ['15 cm', '20 cm', '25 cm', '30 cm'],
        correctAnswerIndex: 1,
      },
      {
        id: 4,
        questionText: 'Berapakah hasil dari 100 / 4?',
        options: ['20', '25', '30', '35'],
        correctAnswerIndex: 1,
      },
       {
        id: 5,
        questionText: 'Bentuk sederhana dari pecahan 12/16 adalah...',
        options: ['2/3', '3/4', '4/5', '5/6'],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: 'ipa-001',
    title: 'Ujian Ilmu Pengetahuan Alam',
    subject: 'IPA',
    duration: 240, // 4 minutes
    questions: [
      {
        id: 1,
        questionText: 'Planet manakah yang dikenal sebagai "Planet Merah"?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturnus'],
        correctAnswerIndex: 1,
      },
      {
        id: 2,
        questionText: 'Apa rumus kimia untuk air?',
        options: ['CO2', 'O2', 'H2O', 'NaCl'],
        correctAnswerIndex: 2,
      },
      {
        id: 3,
        questionText: 'Proses tumbuhan membuat makanannya sendiri disebut...',
        options: ['Respirasi', 'Fotosintesis', 'Evaporasi', 'Transpirasi'],
        correctAnswerIndex: 1,
      },
       {
        id: 4,
        questionText: 'Bagian dari sel yang berfungsi sebagai pusat kendali adalah...',
        options: ['Sitoplasma', 'Membran Sel', 'Nukleus', 'Mitokondria'],
        correctAnswerIndex: 2,
      },
    ],
  },
   {
    id: 'ips-001',
    title: 'Ujian Sejarah Indonesia',
    subject: 'Sejarah',
    duration: 180, // 3 minutes
    questions: [
      {
        id: 1,
        questionText: 'Siapakah presiden pertama Republik Indonesia?',
        options: ['Soeharto', 'B.J. Habibie', 'Soekarno', 'Joko Widodo'],
        correctAnswerIndex: 2,
      },
      {
        id: 2,
        questionText: 'Kapan Proklamasi Kemerdekaan Indonesia dibacakan?',
        options: ['17 Agustus 1945', '20 Mei 1908', '28 Oktober 1928', '1 Juni 1945'],
        correctAnswerIndex: 0,
      },
      {
        id: 3,
        questionText: 'Siapakah pahlawan yang dikenal dengan julukan "Bapak Pendidikan Nasional"?',
        options: ['Pangeran Diponegoro', 'Ki Hajar Dewantara', 'R.A. Kartini', 'Cut Nyak Dien'],
        correctAnswerIndex: 1,
      },
    ],
  },
];
