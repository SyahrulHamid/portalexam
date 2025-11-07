// FIX: Provide full implementation for the WelcomeScreen component.
import React from 'react';
import { Exam } from '../types.ts';

interface WelcomeScreenProps {
  exam: Exam;
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ exam, onStart }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 text-white text-center">
      <div className="bg-slate-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-cyan-400">{exam.title}</h1>
        <p className="text-lg text-slate-300 mb-6">Mata Pelajaran: {exam.subject}</p>
        
        <div className="text-left bg-slate-700/50 p-6 rounded-lg space-y-3 mb-8 border border-slate-600">
          <h2 className="text-xl font-semibold mb-3 text-slate-100">Instruksi Ujian</h2>
          <p className="text-slate-300">Jumlah Pertanyaan: <span className="font-bold text-white">{exam.questions.length}</span></p>
          <p className="text-slate-300">Durasi Ujian: <span className="font-bold text-white">{Math.floor(exam.duration / 60)} menit</span></p>
          <p className="text-slate-300">Pilih jawaban yang paling tepat untuk setiap pertanyaan.</p>
          <p className="text-slate-300">Waktu akan mulai berjalan saat Anda menekan tombol "Mulai".</p>
        </div>
        
        <button
          onClick={onStart}
          className="px-10 py-4 bg-cyan-500 text-slate-900 font-bold text-xl rounded-lg hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-all duration-300 transform hover:scale-105"
        >
          Mulai Ujian
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
