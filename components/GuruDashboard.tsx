import React, { useState, useEffect } from 'react';
import { Exam } from '../types';
import { fetchExams } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const GuruDashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExams = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const fetchedExams = await fetchExams();
        setExams(fetchedExams);
      } catch (err) {
        setError('Gagal memuat daftar ujian. Silakan coba lagi nanti.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadExams();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-40"><LoadingSpinner /></div>;
    }

    if (error) {
      return <div className="text-center text-red-400 p-4 bg-red-500/10 rounded-lg">{error}</div>;
    }

    if (exams.length === 0) {
      return <div className="text-center text-slate-400">Belum ada ujian yang dibuat.</div>;
    }

    return (
       <div className="space-y-4">
          {exams.map(exam => (
            <div key={exam.id} className="bg-slate-700/50 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-white">{exam.title}</h3>
                <p className="text-sm text-slate-400">{exam.subject} - {exam.questions.length} Soal</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-sm px-3 py-1 bg-slate-600 rounded hover:bg-slate-500">Edit</button>
                <button className="text-sm px-3 py-1 bg-blue-600 rounded hover:bg-blue-500">Lihat Hasil</button>
                 <button className="text-sm px-3 py-1 bg-red-600 rounded hover:bg-red-500">Hapus</button>
              </div>
            </div>
          ))}
        </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-white pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Dasbor Guru</h1>
        <button className="px-6 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 transition-colors">
          Buat Ujian Baru
        </button>
      </div>
      
      <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Daftar Ujian Anda</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default GuruDashboard;